import { useCallback, useEffect, useRef, useState } from 'react'
import { INITIAL_STATE, type SiteState, displayTitle, slug } from './data'
import { LANG_OF, type ChangeKey, type Lang } from './code'
import ControlPanel, { STEPS } from './components/ControlPanel'
import SitePreview from './components/SitePreview'
import CodePanel, { type Flash } from './components/CodePanel'
import BeforeAfter from './components/BeforeAfter'

const STORAGE_KEY = 'oficina-do-usuario-ao-criador'

function load(): { state: SiteState; step: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { state: { ...INITIAL_STATE, ...parsed.state }, step: Number(parsed.step) || 0 }
    }
  } catch {
    /* sem localStorage: começa do zero */
  }
  return { state: INITIAL_STATE, step: 0 }
}

export default function App() {
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

  return (
    <div className="flex h-screen flex-col bg-paper text-ink">
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
        <header className="flex items-center justify-between border-b-[1.5px] border-ink px-6 py-3">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-lg font-bold text-accent">&lt;/&gt;</span>
            <h1 className="text-xl font-extrabold tracking-tight">Do usuário ao criador</h1>
            <span className="hidden font-mono text-sm text-black/45 md:inline">~/oficina/site-da-turma</span>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className="font-mono text-sm text-black/45 hover:text-ink" onClick={() => setConfirmReset(true)}>
              ↺ Recomeçar oficina
            </button>
            <button type="button" className="btn-accent" onClick={enterPresentation}>
              ▶ Modo apresentação
            </button>
          </div>
        </header>
      )}

      <div className="flex min-h-0 flex-1">
        <aside className={`shrink-0 border-r-[1.5px] border-ink bg-paper ${presenting ? 'w-[36%] max-w-[640px]' : 'w-[440px]'}`}>
          <ControlPanel
            state={state}
            update={update}
            step={step}
            setStep={setStep}
            presenting={presenting}
            onTransform={() => setTransform(true)}
          />
        </aside>

        <section className={`flex min-w-0 flex-1 flex-col ${presenting ? 'p-4' : 'p-6'}`}>
          {/* Navegador falso */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border-2 border-ink bg-white shadow-[8px_8px_0_#111]">
            <div className="flex items-center gap-3 border-b-2 border-ink bg-paper px-4 py-2.5">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full border-[1.5px] border-ink bg-[#FF5C5C]" />
                <span className="h-3 w-3 rounded-full border-[1.5px] border-ink bg-[#FFBD2E]" />
                <span className="h-3 w-3 rounded-full border-[1.5px] border-ink bg-[#28C840]" />
              </div>
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border-[1.5px] border-ink bg-white px-4 py-1 font-mono text-sm">
                <span className="text-black/40">🔒</span>
                <span className="truncate">
                  <span className="text-black/40">https://</span>
                  {slug(displayTitle(state))}.com.br
                </span>
              </div>
              <button
                type="button"
                key={codeOpen ? 'open' : pulse}
                onClick={() => setCodeOpen((o) => !o)}
                className={`shrink-0 border-[1.5px] border-ink px-3 py-1 font-mono text-sm font-bold transition-colors ${
                  codeOpen ? 'bg-ink text-paper' : `bg-white hover:bg-accent hover:text-white ${pulse ? 'pulse' : ''}`
                }`}
              >
                &lt;/&gt; {codeOpen ? 'Esconder código' : 'Ver código'}
              </button>
            </div>

            <div className="relative min-h-0 flex-1">
              <SitePreview state={state} />
            </div>

            {codeOpen && (
              <div className="h-[42%] min-h-[200px] shrink-0">
                <CodePanel state={state} tab={codeTab} onTab={setCodeTab} flash={flash} onClose={() => setCodeOpen(false)} />
              </div>
            )}
          </div>
        </section>
      </div>

      {transform && <BeforeAfter state={state} onClose={() => setTransform(false)} />}

      {confirmReset && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-6" onClick={() => setConfirmReset(false)}>
          <div className="step-in w-full max-w-md border-2 border-ink bg-paper p-7 shadow-[8px_8px_0_#111]" onClick={(e) => e.stopPropagation()}>
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
