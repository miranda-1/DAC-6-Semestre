import type { ReactNode } from 'react'
import {
  BUTTONS,
  FONTS,
  MESSAGES,
  PALETTES,
  THEMES,
  type SiteState,
  buttonStyle,
  displayTitle,
  getPalette,
  getTheme,
} from '../data'
import type { ChangeKey } from '../code'

export const STEPS = [
  { n: '01', label: 'Tema', lang: 'html', question: 'Sobre o que é o site da turma?' },
  { n: '02', label: 'Título', lang: 'html', question: 'Qual é o nome do site?' },
  { n: '03', label: 'Cores', lang: 'css', question: 'Qual é a cor do site?' },
  { n: '04', label: 'Fonte', lang: 'css', question: 'Qual é o estilo da letra?' },
  { n: '05', label: 'Botão', lang: 'css', question: 'Como vai ser o botão?' },
  { n: '06', label: 'Ação', lang: 'js', question: 'O que acontece ao clicar no botão?' },
] as const

const CONCEPT = {
  html: { name: 'HTML', text: 'o que existe na página', color: 'bg-[#FFB547]' },
  css: { name: 'CSS', text: 'como a página aparece', color: 'bg-[#4DC9FF]' },
  js: { name: 'JavaScript', text: 'o que a página faz', color: 'bg-[#F7DF1E]' },
}

interface Props {
  state: SiteState
  update: (patch: Partial<SiteState>, key: ChangeKey) => void
  step: number
  setStep: (n: number) => void
  presenting: boolean
  onTransform: () => void
}

export default function ControlPanel({ state, update, step, setStep, presenting, onTransform }: Props) {
  const s = STEPS[step]
  const concept = CONCEPT[s.lang]

  return (
    <div className="flex h-full flex-col">
      {/* Abas das etapas */}
      <nav className="grid grid-cols-6 border-b-[1.5px] border-ink">
        {STEPS.map((st, i) => (
          <button
            key={st.n}
            type="button"
            onClick={() => setStep(i)}
            className={`relative border-r-[1.5px] border-ink px-1 py-2.5 text-left last:border-r-0 transition-colors ${
              i === step ? 'bg-ink text-paper' : 'hover:bg-black/5'
            }`}
          >
            <div className={`font-mono text-[0.7rem] ${i === step ? 'text-accent-soft' : 'text-black/45'}`}>{st.n}</div>
            <div className="truncate text-[0.82rem] font-semibold">{st.label}</div>
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto px-7 pt-6 pb-8" key={step}>
        <div className="step-in">
          <div className="mb-5 flex items-center gap-2 font-mono text-[0.8rem]">
            <span className={`${concept.color} border-[1.5px] border-ink px-2 py-0.5 font-bold`}>{concept.name}</span>
            <span className="text-black/60">= {concept.text}</span>
          </div>

          <div className="font-mono text-sm text-accent">
            {s.n} / 06
          </div>
          <h2 className={`font-extrabold leading-none tracking-tight ${presenting ? 'text-6xl' : 'text-5xl'}`}>{s.label}</h2>
          <p className="mt-3 mb-7 text-lg text-black/65">{s.question}</p>

          {step === 0 && <ThemeStep state={state} update={update} />}
          {step === 1 && <TitleStep state={state} update={update} />}
          {step === 2 && <ColorStep state={state} update={update} />}
          {step === 3 && <FontStep state={state} update={update} />}
          {step === 4 && <ButtonStep state={state} update={update} />}
          {step === 5 && <ActionStep state={state} update={update} />}
        </div>
      </div>

      <div className="flex items-center justify-between border-t-[1.5px] border-ink px-5 py-3">
        <button type="button" className="btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>
          ← Anterior
        </button>
        <span className="font-mono text-sm text-black/50">
          {step + 1} / {STEPS.length}
        </span>
        {step < STEPS.length - 1 ? (
          <button type="button" className="btn-ink" onClick={() => setStep(step + 1)}>
            Próximo →
          </button>
        ) : (
          <button type="button" className="btn-accent" onClick={onTransform}>
            Ver transformação ✨
          </button>
        )}
      </div>
    </div>
  )
}

type StepProps = Pick<Props, 'state' | 'update'>

function Card({
  selected,
  onClick,
  children,
  className = '',
}: {
  selected: boolean
  onClick: () => void
  children: ReactNode
  className?: string
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
      className={`choice ${selected ? 'selected' : ''} ${className}`}
    >
      {selected && <span className="choice-check">✓</span>}
      {children}
    </div>
  )
}

function ThemeStep({ state, update }: StepProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {THEMES.map((t) => (
        <Card key={t.id} selected={state.theme === t.id} onClick={() => update({ theme: t.id }, 'theme')} className="p-4 text-left">
          <div className="text-4xl">{t.emoji}</div>
          <div className="mt-3 text-xl font-bold">{t.label}</div>
          <div className="font-mono text-xs text-black/50">{t.eyebrow}</div>
        </Card>
      ))}
    </div>
  )
}

function TitleStep({ state, update }: StepProps) {
  const theme = getTheme(state)
  const suggestions = theme?.titles ?? ['Site da Turma', 'Nosso Site', 'Turma Criadora']
  return (
    <div>
      <div className="relative">
        <input
          value={state.title}
          onChange={(e) => update({ title: e.target.value }, 'title')}
          onFocus={(e) => e.target.select()}
          placeholder="Digite o título…"
          maxLength={40}
          className="w-full border-2 border-ink bg-white py-4 pr-14 pl-4 text-3xl font-bold outline-none focus:border-accent focus:shadow-[5px_5px_0_var(--color-accent)]"
        />
        {state.title && (
          <button
            type="button"
            title="Limpar"
            onClick={(e) => {
              update({ title: '' }, 'title')
              ;(e.currentTarget.previousElementSibling as HTMLInputElement).focus()
            }}
            className="absolute top-1/2 right-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-xl text-black/40 hover:bg-black/5 hover:text-ink"
          >
            ✕
          </button>
        )}
      </div>
      <div className="mt-4 border-[1.5px] border-ink bg-code px-4 py-3 font-mono text-lg text-code-text">
        <span className="tok-tag">&lt;h1&gt;</span>
        <span className="text-white">{displayTitle(state)}</span>
        <span className="tok-tag">&lt;/h1&gt;</span>
      </div>
      <p className="mt-2 text-sm text-black/55">
        A tag <code className="font-mono font-bold">&lt;h1&gt;</code> diz ao navegador: “este é o título principal”.
      </p>
      <div className="mt-6 mb-2 font-mono text-xs uppercase tracking-wider text-black/50">Sugestões</div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((t) => (
          <button key={t} type="button" className="chip" onClick={() => update({ title: t }, 'title')}>
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}

function ColorStep({ state, update }: StepProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {PALETTES.map((p) => (
        <Card key={p.id} selected={state.color === p.id} onClick={() => update({ color: p.id }, 'color')} className="overflow-hidden text-left">
          <div className="flex h-24 items-center gap-3 px-4" style={{ background: p.bg }}>
            <span className="h-12 w-12 rounded-full border-2" style={{ background: p.accent, borderColor: p.text }} />
            <span className="text-3xl font-black" style={{ color: p.text }}>
              Aa
            </span>
          </div>
          <div className="border-t-[1.5px] border-ink px-4 py-2.5">
            <div className="text-lg font-bold">{p.label}</div>
            <div className="font-mono text-xs text-black/50">{p.accent}</div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function FontStep({ state, update }: StepProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {FONTS.map((f) => (
        <Card key={f.id} selected={state.font === f.id} onClick={() => update({ font: f.id }, 'font')} className="px-5 py-4 text-left">
          <div style={{ fontFamily: f.family, fontSize: `${1.9 * f.scale}rem`, lineHeight: 1.4 }}>Site da turma</div>
          <div className="mt-1 font-mono text-xs text-black/50">{f.label}</div>
        </Card>
      ))}
    </div>
  )
}

function ButtonStep({ state, update }: StepProps) {
  const pal = getPalette(state)
  const accent = pal?.accent ?? '#6C4DFF'
  return (
    <div className="grid grid-cols-2 gap-3">
      {BUTTONS.map((b) => {
        const st = buttonStyle(b.id, accent, '#FFFFFF', '#111111')!
        return (
          <Card key={b.id} selected={state.button === b.id} onClick={() => update({ button: b.id }, 'button')} className="flex flex-col items-center gap-4 px-3 py-6">
            <span className="px-6 py-3 text-lg font-bold" style={st}>
              Explorar
            </span>
            <span className="font-mono text-xs text-black/55">{b.label}</span>
          </Card>
        )
      })}
    </div>
  )
}

function ActionStep({ state, update }: StepProps) {
  return (
    <div>
      <div className="grid gap-3">
        {MESSAGES.map((m) => (
          <Card key={m.id} selected={state.message === m.id} onClick={() => update({ message: m.id }, 'message')} className="px-5 py-4 text-left text-xl font-semibold">
            “{m.text}”
          </Card>
        ))}
        <Card selected={state.message === 'custom'} onClick={() => update({ message: 'custom' }, 'message')} className="px-5 py-4 text-left">
          <div className="text-xl font-semibold">✏️ Mensagem da turma</div>
          <input
            value={state.customMessage}
            onClick={(e) => e.stopPropagation()}
            onFocus={() => state.message !== 'custom' && update({ message: 'custom' }, 'message')}
            onChange={(e) => update({ customMessage: e.target.value, message: 'custom' }, 'message')}
            placeholder="Digite a mensagem…"
            maxLength={70}
            className="mt-3 w-full border-[1.5px] border-ink bg-white px-3 py-2.5 text-lg outline-none focus:border-accent"
          />
        </Card>
      </div>
      <p className="mt-5 border-l-4 border-accent pl-3 text-black/65">
        Agora clique no botão do site para testar! 👉
      </p>
    </div>
  )
}
