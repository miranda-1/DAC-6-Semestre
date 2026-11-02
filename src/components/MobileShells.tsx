// A ferramenta no celular: site em cima, opções num painel que dá para esconder e as 6 etapas numa barra no rodapé.
import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, CaseSensitive, ChevronDown, ChevronUp, LayoutGrid, MousePointerClick, Palette, RotateCcw, Sparkles, Type, Zap } from 'lucide-react'
import type { SiteState } from '../data'
import type { ChangeKey } from '../code'
import { CONCEPT, STEPS, StepBody } from './ControlPanel'
import PreviewFrame, { type PreviewProps } from './PreviewFrame'
import { PencilUnderline, SoundToggle } from './Pencil'

export interface ShellProps {
  state: SiteState
  update: (patch: Partial<SiteState>, key: ChangeKey) => void
  step: number
  setStep: (n: number) => void
  onTransform: () => void
  onReset: () => void
  preview: PreviewProps
}

const STEP_ICONS = [LayoutGrid, Type, Palette, CaseSensitive, MousePointerClick, Zap]
const last = STEPS.length - 1

function SlimHeader({ onReset }: { onReset: () => void }) {
  return (
    <header className="app-header flex items-center gap-2 border-b-[1.5px] border-ink px-4 py-2.5">
      <span className="font-mono text-lg font-bold text-accent">&lt;/&gt;</span>
      <h1 className="min-w-0 flex-1 truncate text-base font-extrabold tracking-tight">Do usuário ao criador</h1>
      <SoundToggle />
      <button type="button" title="Recomeçar oficina" className="grid h-9 w-9 place-items-center text-black/45" onClick={onReset}>
        <RotateCcw size={18} />
      </button>
    </header>
  )
}

function StepTitle({ step }: { step: number }) {
  const s = STEPS[step]
  const c = CONCEPT[s.lang]
  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-xs">
        <span className={`${c.color} border-[1.5px] border-ink px-1.5 py-0.5 font-bold text-[#111]`}>{c.name}</span>
        <span className="text-black/55">= {c.text}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-mono text-sm text-accent">{s.n}/06</span>
        <span className="relative inline-block">
          <h2 className="text-2xl leading-none font-extrabold tracking-tight">{s.label}</h2>
          <PencilUnderline />
        </span>
      </div>
      <p className="mt-1 text-sm text-black/65">{s.question}</p>
    </div>
  )
}

function NextButton({ step, setStep, onTransform, className = '' }: Pick<ShellProps, 'step' | 'setStep' | 'onTransform'> & { className?: string }) {
  return step < last ? (
    <button type="button" className={`btn-ink inline-flex items-center justify-center gap-2 py-3 ${className}`} onClick={() => setStep(step + 1)}>
      Próximo <ArrowRight size={18} />
    </button>
  ) : (
    <button type="button" className={`btn-accent inline-flex items-center justify-center gap-2 py-3 ${className}`} onClick={onTransform}>
      Ver o resultado <Sparkles size={18} />
    </button>
  )
}

function BackButton({ step, setStep }: Pick<ShellProps, 'step' | 'setStep'>) {
  return (
    <button type="button" title="Anterior" className="btn-ghost grid w-12 place-items-center py-3" disabled={step === 0} onClick={() => setStep(step - 1)}>
      <ArrowLeft size={18} />
    </button>
  )
}

// Arrastar a alça do painel para baixo: ele segue o dedo e fecha se passar do limite ou se o gesto for rápido.
function useSheetDrag(onClose: () => void) {
  const [dy, setDy] = useState(0)
  const [closing, setClosing] = useState(false)
  const start = useRef<{ y: number; t: number } | null>(null)
  const close = () => {
    setClosing(true)
    setTimeout(() => {
      onClose()
      setClosing(false)
      setDy(0)
    }, 220)
  }
  const handlers = {
    onPointerDown: (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest('button')) return
      start.current = { y: e.clientY, t: performance.now() }
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (start.current) setDy(Math.max(0, e.clientY - start.current.y))
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (!start.current) return
      const moved = e.clientY - start.current.y
      const speed = moved / (performance.now() - start.current.t)
      start.current = null
      if (moved > 90 || (moved > 20 && speed > 0.5)) close()
      else setDy(0)
    },
    onPointerCancel: () => {
      start.current = null
      setDy(0)
    },
  }
  const dragging = start.current !== null
  const style: React.CSSProperties = {
    transform: closing ? 'translateY(100%)' : `translateY(${dy}px)`,
    transition: dragging ? 'none' : 'transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)',
  }
  return { handlers, style, close }
}

export default function MobileShell(p: ShellProps) {
  const [open, setOpen] = useState(true)
  const drag = useSheetDrag(() => setOpen(false))
  return (
    <>
      <SlimHeader onReset={p.onReset} />
      <div className="stage flex min-h-0 flex-1 flex-col p-2.5">
        <PreviewFrame {...p.preview} />
      </div>
      {open && (
        <div
          className="sheet step-in relative z-10 flex max-h-[52%] min-h-0 flex-col rounded-t-2xl border-x-2 border-t-2 border-ink bg-paper shadow-[0_-10px_30px_rgba(0,0,0,0.12)]"
          style={drag.style}
        >
          <div className="sheet-grip relative flex cursor-grab touch-none items-center justify-center pt-2.5 pb-2 select-none" title="Arraste para baixo para esconder" {...drag.handlers}>
            <span className="h-1.5 w-12 rounded-full bg-black/25" />
            <button
              type="button"
              className="sheet-close absolute top-1 right-2 inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-black/55"
              onClick={drag.close}
              title="Esconder escolhas"
            >
              Esconder <ChevronDown size={16} />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3" key={p.step}>
            <div className="step-in">
              <StepTitle step={p.step} />
              <div className="mt-3">
                <StepBody state={p.state} update={p.update} step={p.step} />
              </div>
            </div>
          </div>
          <div className="flex gap-2 border-t-[1.5px] border-ink px-3 py-2">
            <BackButton step={p.step} setStep={p.setStep} />
            <NextButton step={p.step} setStep={p.setStep} onTransform={p.onTransform} className="flex-1" />
          </div>
        </div>
      )}
      <nav className="tabbar grid grid-cols-6 border-t-2 border-ink bg-paper pb-[env(safe-area-inset-bottom)]">
        {STEPS.map((s, i) => {
          const I = STEP_ICONS[i]
          const active = i === p.step
          return (
            <button
              key={s.n}
              type="button"
              onClick={() => {
                if (active) setOpen((o) => !o)
                else {
                  p.setStep(i)
                  setOpen(true)
                }
              }}
              className={`tab-item relative flex flex-col items-center gap-0.5 py-2 text-[0.68rem] font-semibold ${active ? 'is-active text-accent' : 'text-black/55'}`}
            >
              {active && <span className="tab-mark absolute top-0 left-3 right-3 h-[3px] rounded-b bg-accent" />}
              <I size={20} />
              {s.label}
            </button>
          )
        })}
      </nav>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-accent fixed right-4 bottom-[76px] z-10 inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 shadow-lg"
        >
          <ChevronUp size={18} /> Escolher
        </button>
      )}
    </>
  )
}
