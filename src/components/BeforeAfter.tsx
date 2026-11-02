import { useEffect, useState, type ReactNode } from 'react'
import { Download, Pencil, RotateCcw, X } from 'lucide-react'
import { INITIAL_STATE, type SiteState, displayTitle, slug } from '../data'
import { scribble } from '../sound'
import SitePreview from './SitePreview'

const W = 1000
const H = 640

function MiniBrowser({ state, scale, label, children }: { state: SiteState; scale: number; label: string; children?: ReactNode }) {
  return (
    <div className="relative">
      <div className="note-label">{label}</div>
      <div
        className="relative overflow-hidden rounded-xl border-2 border-ink bg-white shadow-[8px_8px_0_var(--hard)]"
        style={{ width: W * scale, height: (H + 40) * scale }}
      >
        <div style={{ width: W, height: H + 40, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <div className="flex h-10 items-center gap-2 border-b-2 border-ink bg-paper px-4">
            <span className="h-3 w-3 rounded-full border-[1.5px] border-ink" />
            <span className="h-3 w-3 rounded-full border-[1.5px] border-ink" />
            <span className="h-3 w-3 rounded-full border-[1.5px] border-ink" />
            <span className="ml-4 font-mono text-sm text-black/60">{slug(displayTitle(state))}.com.br</span>
          </div>
          <div style={{ height: H }}>
            <SitePreview state={state} interactive={false} />
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

// No celular as miniaturas ficam uma embaixo da outra.
const isNarrow = () => window.innerWidth < 768

function useScale() {
  const calc = () =>
    isNarrow()
      ? Math.min((window.innerWidth - 48) / W, (window.innerHeight * 0.21) / (H + 40))
      : Math.min((window.innerWidth * 0.4) / W, (window.innerHeight * 0.55) / (H + 40))
  const [k, setK] = useState(calc)
  useEffect(() => {
    const on = () => setK(calc())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return k
}

// O que cai no final: pedacinhos de caderno, estrelinhas e raspas de lápis
const BITS = ['paper', 'star', 'shaving', 'paper', 'star']
const STAR_COLORS = ['#e63946', '#1f3a93', '#f5b301', '#34c38f']

export default function BeforeAfter({ state, onClose }: { state: SiteState; onClose: () => void }) {
  const k = useScale()
  const [phase, setPhase] = useState(0)
  const [run, setRun] = useState(0)
  const [saving, setSaving] = useState(false)

  const download = async () => {
    setSaving(true)
    try {
      const { downloadSite } = await import('../exportSite')
      await downloadSite(state)
    } finally {
      setSaving(false)
    }
  }

  // Linha do tempo: 1 seta desenhada · 2 lápis contorna e colore o "depois" · 3 título escrito à mão · 4 final
  useEffect(() => {
    setPhase(0)
    const steps: [number, number, number][] = [
      [1, 900, 0.5],
      [2, 1500, 1.2],
      [3, 3300, 0.9],
      [4, 4400, 0],
    ]
    const timers = steps.map(([p, ms, sound]) =>
      setTimeout(() => {
        setPhase(p)
        if (sound) scribble(sound)
      }, ms),
    )
    return () => timers.forEach(clearTimeout)
  }, [run])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center overflow-x-hidden overflow-y-auto bg-paper px-6 pt-16 pb-8 md:justify-center md:overflow-hidden md:py-0">
      <div className="absolute top-3 right-3 flex gap-2 md:top-5 md:right-5">
        <button type="button" title="Rever" className="btn-ghost inline-flex items-center gap-1.5" onClick={() => setRun((r) => r + 1)}>
          <RotateCcw size={18} /><span className="hidden md:inline"> Rever</span>
        </button>
        <button type="button" title="Fechar" className="btn-ink inline-flex items-center gap-1.5" onClick={onClose}>
          <X size={18} /><span className="hidden md:inline"> Fechar (Esc)</span>
        </button>
      </div>

      <div className={`relative mb-9 md:mb-12 ${phase >= 3 ? '' : 'invisible'}`}>
        <h2 key={`t${run}-${phase >= 3}`} className="write-in text-center text-[2.6rem] leading-none md:text-7xl">
          Vocês fizeram{' '}
          <span className="relative inline-block text-accent">
            isso.
            {phase >= 3 && (
              <svg className="scribble-circle" viewBox="0 0 120 60" preserveAspectRatio="none" aria-hidden="true">
                <path pathLength={1} d="M10 32 C8 12 50 4 82 8 C110 12 116 34 100 46 C80 58 30 58 14 44 C6 36 14 22 30 16" />
              </svg>
            )}
          </span>
        </h2>
        {phase === 3 && <Pencil key={`p${run}`} className="write-pencil" size={30} aria-hidden="true" />}
      </div>

      <div className="flex flex-col items-center gap-3 md:flex-row md:gap-8">
        <div className={`-rotate-2 transition-all duration-700 ${phase === 0 ? 'scale-105' : 'scale-100 opacity-70'}`}>
          <MiniBrowser state={INITIAL_STATE} scale={k} label="antes" />
        </div>
        <svg className={`hand-arrow ${phase >= 1 ? 'draw' : ''}`} viewBox="0 0 100 60" aria-hidden="true">
          <path pathLength={1} d="M6 34 C28 22 56 44 88 30" />
          <path pathLength={1} d="M72 16 L90 30 L74 44" />
        </svg>
        <div
          className={`relative rotate-1 transition-all duration-500 ${phase >= 2 ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        >
          <MiniBrowser state={state} scale={k} label="depois">
            {phase >= 2 && (
              <div key={`c${run}`} className="sketch-layer" aria-hidden="true">
                <Pencil className="color-pencil" size={34} />
              </div>
            )}
          </MiniBrowser>
          {phase >= 2 && (
            <svg key={`o${run}`} className="sketch-outline" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path pathLength={1} d="M1 4 L98 1 L99 97 L2 99 Z" vectorEffect="non-scaling-stroke" />
            </svg>
          )}
        </div>
      </div>

      <div
        className={`mt-6 flex flex-col items-center gap-4 transition-opacity delay-300 duration-700 md:mt-10 ${
          phase === 4 ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <p className="text-center font-mono text-base text-black/60 md:text-lg">de usuários → a criadores de tecnologia</p>
        <button type="button" className="btn-accent relative z-10 inline-flex items-center gap-2 px-6 py-3 text-lg" onClick={download} disabled={saving}>
          {saving ? 'Preparando…' : <><Download size={20} /> Baixar nosso site</>}
        </button>
        <p className="max-w-sm text-center text-sm text-black/50">
          Um arquivo .html com o site da turma e dicas de cursos grátis para continuar aprendendo.
        </p>
      </div>

      {phase === 4 && (
        <div className="pointer-events-none absolute inset-0" key={run}>
          {Array.from({ length: 46 }, (_, i) => {
            const bit = BITS[i % BITS.length]
            return (
              <span
                key={i}
                className={`confetti bit-${bit}`}
                style={{
                  left: `${(i * 53) % 100}%`,
                  color: STAR_COLORS[i % STAR_COLORS.length],
                  animationDelay: `${(i * 47) % 900}ms`,
                  animationDuration: `${2400 + ((i * 131) % 1600)}ms`,
                  transform: `rotate(${i * 29}deg)`,
                }}
              >
                {bit === 'star' ? '★' : null}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
