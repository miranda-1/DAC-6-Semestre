// Ícones do site da turma (Lucide, os mesmos do shadcn/ui), pelo nome usado em data.ts.
import {
  Clapperboard,
  ChartColumn,
  Film,
  Flame,
  Gamepad2,
  Headphones,
  Joystick,
  ListMusic,
  AudioLines,
  CircleHelp,
  ListChecks,
  PanelsTopLeft,
  Vote,
  Medal,
  Mic,
  Orbit,
  Popcorn,
  Rocket,
  Satellite,
  Sparkles,
  Star,
  Trophy,
  Zap,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  controle: Gamepad2,
  trofeu: Trophy,
  joystick: Joystick,
  raio: Zap,
  fone: Headphones,
  microfone: Mic,
  playlist: ListMusic,
  ondas: AudioLines,
  medalha: Medal,
  fogo: Flame,
  grafico: ChartColumn,
  claquete: Clapperboard,
  pipoca: Popcorn,
  estrela: Star,
  filme: Film,
  foguete: Rocket,
  orbita: Orbit,
  brilho: Sparkles,
  satelite: Satellite,
  votar: Vote,
  pergunta: CircleHelp,
  abas: PanelsTopLeft,
  lista: ListChecks,
}

export function Icon({ name, size = 24, className }: { name: string; size?: number; className?: string }) {
  const C = ICONS[name] ?? Sparkles
  return <C size={size} strokeWidth={1.9} className={className} aria-hidden="true" />
}
