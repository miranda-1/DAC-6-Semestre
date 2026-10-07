import { useEffect, useRef, type ReactNode } from 'react'
import type { SiteState } from '../data'
import { CODE, type ChangeKey, type Lang } from '../code'

export interface Flash {
  keys: ChangeKey[]
  id: number
}

const TABS: { id: Lang; label: string; hint: string }[] = [
  { id: 'html', label: 'HTML', hint: 'o que existe' },
  { id: 'css', label: 'CSS', hint: 'como aparece' },
  { id: 'js', label: 'JavaScript', hint: 'o que faz' },
]

interface Props {
  state: SiteState
  tab: Lang
  onTab: (t: Lang) => void
  flash: Flash | null
  onClose: () => void
}

export default function CodePanel({ state, tab, onTab, flash, onClose }: Props) {
  const lines = CODE[tab](state)
  const areaRef = useRef<HTMLPreElement>(null)

  // Garante que a linha destacada fique visível
  useEffect(() => {
    areaRef.current?.querySelector('.flash')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [flash, tab])
  return (
    <div className="flex h-full flex-col border-t-2 border-ink bg-code text-code-text">
      <div className="flex items-stretch border-b border-white/10 bg-black/30">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onTab(t.id)}
            className={`flex items-baseline gap-2 border-r border-white/10 px-5 py-2.5 font-mono text-sm transition-colors ${
              tab === t.id ? 'bg-code text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            <span className={`font-bold ${tab === t.id ? 'text-accent-soft' : ''}`}>{t.label}</span>
            <span className="text-xs opacity-70">= {t.hint}</span>
          </button>
        ))}
        <div className="flex-1" />
        <button
          type="button"
          onClick={onClose}
          className="px-4 font-mono text-sm text-white/50 hover:text-white"
          title="Fechar código"
        >
          ✕
        </button>
      </div>
      <pre ref={areaRef} className="code-area flex-1 overflow-auto py-3 font-mono">
        {lines.map((line, i) => {
          const hit = !!flash && !!line.tags?.some((k) => flash.keys.includes(k))
          return (
            <div key={hit ? `${i}-${flash!.id}` : i} className={`code-line ${hit ? 'flash' : ''}`}>
              <span className="code-num">{i + 1}</span>
              <span>{line.comment ? <span className="tok-comment">{line.text}</span> : highlight(line.text, tab)}</span>
            </div>
          )
        })}
      </pre>
    </div>
  )
}

// Realce de sintaxe bem simples, só para ficar bonito.
function highlight(text: string, lang: Lang): ReactNode {
  if (!text) return ' '
  const re =
    lang === 'html'
      ? /(<\/?[a-z0-9]+)|(\s[a-z]+=)|("[^"]*")|(>)/g
      : lang === 'css'
        ? /^([^\s{][^{]*?)(?=\s\{)|^(\s+[a-z-]+)(:)|(#[0-9A-Fa-f]{3,8})|("[^"]*")/g
        : /\b(function)\b|("[^"]*")|\b([a-zA-Z]+)(?=\()/g
  const out: ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  let k = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const s = m[0]
    let cls = ''
    if (lang === 'html') cls = m[1] || m[4] ? 'tok-tag' : m[2] ? 'tok-attr' : 'tok-str'
    else if (lang === 'css') {
      if (m[1]) cls = 'tok-tag'
      else if (m[2]) {
        out.push(<span key={k++} className="tok-attr">{m[2]}</span>)
        out.push(m[3])
        last = m.index + s.length
        continue
      } else cls = m[4] ? 'tok-num' : 'tok-str'
    } else cls = m[1] ? 'tok-kw' : m[2] ? 'tok-str' : 'tok-fn'
    out.push(
      <span key={k++} className={cls}>
        {s}
      </span>,
    )
    last = m.index + s.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}
