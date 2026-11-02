// Animações de lápis: um "visto" desenhado na escolha e um sublinhado rabiscado no título da etapa.
import { useEffect, useState } from 'react'
import { Pencil, Volume2, VolumeX } from 'lucide-react'
import { scribble, setSound, soundOn } from '../sound'

export function PencilCheck() {
  return (
    <span className="pencil-check" aria-hidden="true">
      <svg viewBox="0 0 40 40">
        <path className="ring" pathLength={1} d="M20 4 C31 3 37 12 36 21 C35 31 26 37 18 36 C9 35 3 27 4 18 C5 10 12 5 23 5" />
        <path className="tick" pathLength={1} d="M12 21 L18 27 L29 13" />
      </svg>
      <Pencil className="pencil-tool" size={18} />
    </span>
  )
}

export function PencilUnderline() {
  useEffect(() => scribble(0.55), [])
  return (
    <span className="pencil-underline" aria-hidden="true">
      <svg viewBox="0 0 200 14" preserveAspectRatio="none">
        <path pathLength={1} d="M2 9 C30 3 55 12 85 7 S140 4 165 9 S190 8 198 6" />
      </svg>
      <Pencil className="pencil-tool" size={18} />
    </span>
  )
}

// Liga/desliga o som de lápis
export function SoundToggle({ className = '' }: { className?: string }) {
  const [on, setOn] = useState(soundOn)
  return (
    <button
      type="button"
      title={on ? 'Desligar som' : 'Ligar som'}
      className={`grid h-9 w-9 place-items-center text-black/45 hover:text-ink ${className}`}
      onClick={() => {
        setSound(!on)
        setOn(!on)
        if (!on) scribble(0.6) // som de teste ao ligar
      }}
    >
      {on ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  )
}
