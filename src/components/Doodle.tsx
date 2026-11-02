// Ícones dos temas com cara de desenho a lápis: traço tremido, linha dupla e marca-texto atrás.
import { Clapperboard, Gamepad2, Headphones, Rocket, Volleyball, type LucideIcon } from 'lucide-react'
import type { ThemeId } from '../data'

const DOODLES: Record<Exclude<ThemeId, 'none'>, { Icon: LucideIcon; marker: string }> = {
  games: { Icon: Gamepad2, marker: '#c4b5fd' },
  musica: { Icon: Headphones, marker: '#f9a8d4' },
  esportes: { Icon: Volleyball, marker: '#86efac' },
  filmes: { Icon: Clapperboard, marker: '#fdba74' },
  espaco: { Icon: Rocket, marker: '#93c5fd' },
}

// Filtros que deixam o traço tremido (uma vez, no App)
export function DoodleFilters() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <filter id="rabisco">
        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="3" />
        <feDisplacementMap in="SourceGraphic" scale="2.4" />
      </filter>
      {/* traço mais solto, para contornos de cartões e botões */}
      <filter id="rabisco-forte">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" />
        <feDisplacementMap in="SourceGraphic" scale="4.5" />
      </filter>
      <filter id="rabisco-2">
        <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" seed="11" />
        <feDisplacementMap in="SourceGraphic" scale="3" />
      </filter>
    </svg>
  )
}

export function ThemeDoodle({ theme }: { theme: Exclude<ThemeId, 'none'> }) {
  const { Icon, marker } = DOODLES[theme]
  return (
    <span className="doodle" aria-hidden="true">
      <svg className="doodle-marker" viewBox="0 0 60 50" style={{ color: marker }}>
        <path d="M8 34 L30 10 M10 42 L42 12 M18 44 L50 16 M30 44 L52 26" />
      </svg>
      <Icon className="doodle-ink doodle-ghost" size={42} strokeWidth={1.8} />
      <Icon className="doodle-ink" size={42} strokeWidth={2.1} />
    </span>
  )
}
