import { useEffect, useState } from 'react'
import { INITIAL_STATE, type SiteState, displayTitle, slug } from '../data'
import SitePreview from './SitePreview'

const W = 1000
const H = 640

function MiniBrowser({ state, scale, label }: { state: SiteState; scale: number; label: string }) {
  return (
    <div>
      <div className="mb-3 font-mono text-sm font-bold tracking-[0.3em] text-black/55">{label}</div>
      <div
        className="overflow-hidden rounded-xl border-2 border-ink bg-white shadow-[8px_8px_0_#111]"
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
      </div>
    </div>
  )
}

function useScale() {
  const calc = () => Math.min((window.innerWidth * 0.4) / W, (window.innerHeight * 0.55) / (H + 40))
  const [k, setK] = useState(calc)
  useEffect(() => {
    const on = () => setK(calc())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return k
}

const CONFETTI_COLORS = ['#6C4DFF', '#FFB547', '#4DC9FF', '#FF5C8A', '#0FA896', '#111111']

export default function BeforeAfter({ state, onClose }: { state: SiteState; onClose: () => void }) {
  const k = useScale()
  const [phase, setPhase] = useState(0)
  const [run, setRun] = useState(0)

  useEffect(() => {
    setPhase(0)
    const t1 = setTimeout(() => setPhase(1), 1600)
    const t2 = setTimeout(() => setPhase(2), 2700)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [run])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-paper px-6">
      <div className="absolute top-5 right-5 flex gap-2">
        <button type="button" className="btn-ghost" onClick={() => setRun((r) => r + 1)}>
          ↺ Rever
        </button>
        <button type="button" className="btn-ink" onClick={onClose}>
          Fechar (Esc)
        </button>
      </div>

      <h2
        className={`mb-10 text-center text-6xl font-extrabold tracking-tight transition-all duration-700 ${
          phase === 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        Vocês fizeram <span className="text-accent">isso.</span>
      </h2>

      <div className="flex items-center gap-8">
        <div className={`transition-all duration-700 ${phase === 0 ? 'scale-110' : 'scale-100 opacity-60'}`}>
          <MiniBrowser state={INITIAL_STATE} scale={k} label="ANTES" />
        </div>
        <div
          className={`text-6xl font-black text-accent transition-all duration-500 ${
            phase >= 1 ? 'opacity-100' : 'opacity-0 -translate-x-6'
          }`}
        >
          →
        </div>
        <div
          className={`transition-all duration-700 ease-[cubic-bezier(0.2,1.3,0.4,1)] ${
            phase >= 1 ? 'translate-x-0 scale-100 opacity-100' : 'translate-x-24 scale-75 opacity-0'
          }`}
        >
          <MiniBrowser state={state} scale={k} label="DEPOIS" />
        </div>
      </div>

      <p
        className={`mt-10 font-mono text-lg text-black/60 transition-opacity delay-300 duration-700 ${
          phase === 2 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        de usuários → a criadores de tecnologia
      </p>

      {phase === 2 && (
        <div className="pointer-events-none absolute inset-0" key={run}>
          {Array.from({ length: 60 }, (_, i) => (
            <span
              key={i}
              className="confetti"
              style={{
                left: `${(i * 53) % 100}%`,
                background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                animationDelay: `${(i * 47) % 900}ms`,
                animationDuration: `${2200 + ((i * 131) % 1600)}ms`,
                transform: `rotate(${i * 29}deg)`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
