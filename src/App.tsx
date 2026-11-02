import { useCallback, useEffect, useRef, useState } from 'react'
import { INITIAL_STATE, type SiteState, sanitizeState } from './data'
import { LANG_OF, type ChangeKey, type Lang } from './code'
import ControlPanel, { STEPS } from './components/ControlPanel'
import { type Flash } from './components/CodePanel'
import PreviewFrame, { type PreviewProps } from './components/PreviewFrame'
import BeforeAfter from './components/BeforeAfter'
import MobileShell from './components/MobileShells'
import { SoundToggle } from './components/Pencil'
import { DoodleFilters } from './components/Doodle'

const STORAGE_KEY = 'oficina-do-usuario-ao-criador'

function load(): { state: SiteState; step: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const step = Math.trunc(Number(parsed?.step)) || 0
      return { state: sanitizeState(parsed?.state), step: Math.max(0, Math.min(STEPS.length - 1, step)) }
    }
  } catch {
    /* sem localStorage: começa do zero */
  }
  return { state: INITIAL_STATE, step: 0 }
}

// true abaixo de 1024px (onde a ferramenta usa o layout de celular)
function useIsMobile() {
  const query = '(max-width: 1023px)'
  const [mobile, setMobile] = useState(() => matchMedia(query).matches)
  useEffect(() => {
    const mq = matchMedia(query)
    const on = () => setMobile(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return mobile
}

export default function App() {
  const mobile = useIsMobile()
  const [initial] = useState(load)
  const [state, setState] = useState<SiteState>(initial.state)
  const [step, setStepRaw] = useState(initial.step)
  const [presenting, setPresenting] = useState(false)
  const [codeOpen, setCodeOpen] = useState(false)
  const [codeTab, setCodeTab] = useState<Lang>('html')
  const [flash, setFlash] = useState<Flash | null>(null)
  const [pulse, setPulse] = useState(0)
  const [transform, setTransform] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const flashId = useRef(0)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, step }))
    } catch {
      /* ignora */
    }
  }, [state, step])

  const setStep = useCallback((n: number) => setStepRaw(Math.max(0, Math.min(STEPS.length - 1, n))), [])

  const update = (patch: Partial<SiteState>, key: ChangeKey) => {
    setState((s) => ({ ...s, ...patch }))
    flashId.current += 1
    setFlash({ keys: [key], id: flashId.current })
    setCodeTab(LANG_OF[key])
    if (!codeOpen) setPulse(flashId.current)
  }

  // Modo apresentação: tela cheia + fonte maior
  useEffect(() => {
    document.documentElement.classList.toggle('presenting', presenting)
  }, [presenting])

  const enterPresentation = () => {
    setPresenting(true)
    document.documentElement.requestFullscreen?.().catch(() => {})
  }
  const exitPresentation = () => {
    setPresenting(false)
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
  }

  useEffect(() => {
    const onFs = () => {
      if (!document.fullscreenElement) setPresenting(false)
    }
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  // Atalhos de teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmReset) setConfirmReset(false)
        else if (transform) setTransform(false)
        else if (presenting) exitPresentation()
        return
      }
      if (!presenting || transform || confirmReset) return
      const t = e.target as HTMLElement
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowRight') setStep(step + 1)
      if (e.key === 'ArrowLeft') setStep(step - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const reset = () => {
    setState(INITIAL_STATE)
    setStep(0)
    setFlash(null)
    setCodeOpen(false)
    setCodeTab('html')
    setConfirmReset(false)
  }

  const preview: PreviewProps = { state, codeOpen, setCodeOpen, codeTab, setCodeTab, flash, pulse }

  return (
    <div className="flex h-dvh flex-col bg-paper text-ink">
      <DoodleFilters />
      {mobile ? (
        <MobileShell
          state={state}
          update={update}
          step={step}
          setStep={setStep}
          onTransform={() => setTransform(true)}
          onReset={() => setConfirmReset(true)}
          preview={preview}
        />
      ) : (
        <>
      {/* Barra superior */}
      {presenting ? (
        <header className="flex items-center gap-4 border-b-[1.5px] border-ink px-6 py-2.5">
          <span className="font-mono text-sm text-black/50">Do usuário ao criador</span>
          <div className="flex flex-1 items-center justify-center gap-4">
            <button type="button" className="btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>
              ← Anterior
            </button>
            <div className="min-w-48 text-center">
              <span className="font-mono text-accent">
                {step + 1} / {STEPS.length}
              </span>{' '}
              <span className="text-xl font-bold">{STEPS[step].label}</span>
            </div>
            <button type="button" className="btn-ink" disabled={step === STEPS.length - 1} onClick={() => setStep(step + 1)}>
              Próximo →
            </button>
          </div>
          <button type="button" className="font-mono text-sm text-black/50 hover:text-ink" onClick={exitPresentation}>
            Sair (Esc)
          </button>
        </header>
      ) : (
        <header className="app-header flex items-center justify-between gap-3 border-b-[1.5px] border-ink px-4 py-2.5 lg:px-6 lg:py-3">
          <div className="flex min-w-0 items-baseline gap-2 lg:gap-3">
            <span className="font-mono text-lg font-bold text-accent">&lt;/&gt;</span>
            <h1 className="truncate text-lg font-extrabold tracking-tight lg:text-xl">Do usuário ao criador</h1>
            <span className="hidden font-mono text-sm text-black/45 md:inline">~/oficina/site-da-turma</span>
          </div>
          <div className="flex items-center gap-3">
            <SoundToggle />
            <button
              type="button"
              title="Recomeçar oficina"
              className="shrink-0 font-mono text-sm text-black/45 hover:text-ink"
              onClick={() => setConfirmReset(true)}
            >
              ↺<span className="hidden sm:inline"> Recomeçar oficina</span>
            </button>
            <button type="button" className="btn-accent hidden lg:block" onClick={enterPresentation}>
              ▶ Modo apresentação
            </button>
          </div>
        </header>
      )}

      {/* No celular: preview em cima e escolhas embaixo. No computador: lado a lado. */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside
          className={`order-2 min-h-0 flex-1 border-t-[1.5px] border-ink bg-paper lg:order-none lg:flex-none lg:shrink-0 lg:border-t-0 lg:border-r-[1.5px] ${
            presenting ? 'lg:w-[36%] lg:max-w-[640px]' : 'lg:w-[440px]'
          }`}
        >
          <ControlPanel
            state={state}
            update={update}
            step={step}
            setStep={setStep}
            presenting={presenting}
            onTransform={() => setTransform(true)}
          />
        </aside>

        <section
          className={`stage flex min-w-0 shrink-0 flex-col p-3 transition-[height] duration-300 lg:h-auto lg:flex-1 lg:shrink ${
            codeOpen ? 'h-[62dvh]' : 'h-[44dvh]'
          } ${presenting ? 'lg:p-4' : 'lg:p-6'}`}
        >
          <PreviewFrame {...preview} />
        </section>
      </div>
        </>
      )}

      {transform && <BeforeAfter state={state} onClose={() => setTransform(false)} />}

      {confirmReset && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-6" onClick={() => setConfirmReset(false)}>
          <div className="step-in w-full max-w-md border-2 border-ink bg-paper p-7 shadow-[8px_8px_0_var(--hard)]" onClick={(e) => e.stopPropagation()}>
            <div className="font-mono text-sm text-accent">recomeçar</div>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight">Recomeçar a oficina?</h2>
            <p className="mt-3 text-black/65">Todas as escolhas da turma serão apagadas e o site volta ao estado inicial.</p>
            <div className="mt-7 flex justify-end gap-3">
              <button type="button" className="btn-ghost" onClick={() => setConfirmReset(false)}>
                Cancelar
              </button>
              <button type="button" className="btn-ink" onClick={reset} autoFocus>
                Sim, recomeçar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
