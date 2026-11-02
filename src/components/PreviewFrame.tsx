// O "navegador falso" com o site da turma e o painel de código.
import type { Dispatch, SetStateAction } from 'react'
import { type SiteState, displayTitle, slug } from '../data'
import type { Lang } from '../code'
import SitePreview from './SitePreview'
import CodePanel, { type Flash } from './CodePanel'

export interface PreviewProps {
  state: SiteState
  codeOpen: boolean
  setCodeOpen: Dispatch<SetStateAction<boolean>>
  codeTab: Lang
  setCodeTab: (t: Lang) => void
  flash: Flash | null
  pulse: number
}

export default function PreviewFrame({ state, codeOpen, setCodeOpen, codeTab, setCodeTab, flash, pulse }: PreviewProps) {
  return (
    <div className="frame relative flex min-h-0 flex-1 flex-col">
      {/* Espiral do caderno em cima do navegador */}
      <span className="frame-rings" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <i key={i} />
        ))}
      </span>
      <div className="browser flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border-2 border-ink bg-white shadow-[4px_4px_0_var(--hard)] lg:shadow-[8px_8px_0_var(--hard)]">
        <div className="browser-bar flex items-center gap-2 border-b-2 border-ink bg-paper px-2.5 py-1.5 lg:gap-3 lg:px-4 lg:py-2.5">
          <div className="hidden gap-1.5 sm:flex">
            <span className="h-3 w-3 rounded-full border-[1.5px] border-ink bg-[#FF5C5C]" />
            <span className="h-3 w-3 rounded-full border-[1.5px] border-ink bg-[#FFBD2E]" />
            <span className="h-3 w-3 rounded-full border-[1.5px] border-ink bg-[#28C840]" />
          </div>
          <div className="browser-url flex min-w-0 flex-1 items-center gap-2 rounded-full border-[1.5px] border-ink bg-white px-3 py-1 font-mono text-xs lg:px-4 lg:text-sm">
            <span className="hidden text-black/40 sm:inline">🔒</span>
            <span className="truncate">
              <span className="text-black/40">https://</span>
              {slug(displayTitle(state))}.com.br
            </span>
          </div>
          <button
            type="button"
            key={codeOpen ? 'open' : pulse}
            onClick={() => setCodeOpen((o) => !o)}
            className={`code-toggle shrink-0 border-[1.5px] border-ink px-2.5 py-1 font-mono text-xs font-bold transition-colors lg:px-3 lg:text-sm ${
              codeOpen ? 'bg-ink text-paper' : `bg-white hover:bg-accent hover:text-white ${pulse ? 'pulse' : ''}`
            }`}
          >
            &lt;/&gt;<span className="hidden sm:inline"> {codeOpen ? 'Esconder código' : 'Ver código'}</span>
            <span className="sm:hidden"> {codeOpen ? 'Fechar' : 'Código'}</span>
          </button>
        </div>

        <div className="relative min-h-0 flex-1">
          <SitePreview state={state} />
        </div>

        {codeOpen && (
          <div className="h-[52%] shrink-0 lg:h-[42%] lg:min-h-[200px]">
            <CodePanel state={state} tab={codeTab} onTab={setCodeTab} flash={flash} onClose={() => setCodeOpen(false)} />
          </div>
        )}
      </div>
    </div>
  )
}
