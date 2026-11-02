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
import { PencilCheck, PencilUnderline } from './Pencil'
import { ThemeDoodle } from './Doodle'
import { scribble } from '../sound'

export const STEPS = [
  { n: '01', label: 'Tema', lang: 'html', question: 'Sobre o que é o site da turma?' },
  { n: '02', label: 'Título', lang: 'html', question: 'Qual é o nome do site?' },
  { n: '03', label: 'Cores', lang: 'css', question: 'Qual é a cor do site?' },
  { n: '04', label: 'Fonte', lang: 'css', question: 'Qual é o estilo da letra?' },
  { n: '05', label: 'Botão', lang: 'css', question: 'Como vai ser o botão?' },
  { n: '06', label: 'Ação', lang: 'js', question: 'O que acontece ao clicar no botão?' },
] as const

export const CONCEPT = {
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
      <nav className="steps-nav grid grid-cols-6 border-b-[1.5px] border-ink">
        {STEPS.map((st, i) => (
          <button
            key={st.n}
            type="button"
            onClick={() => setStep(i)}
            className={`step-tab relative min-w-0 border-r-[1.5px] border-ink px-1 py-2 text-left last:border-r-0 transition-colors lg:py-2.5 ${
              i === step ? 'is-active bg-ink text-paper' : 'hover:bg-black/5'
            }`}
          >
            <div className={`font-mono text-[0.7rem] ${i === step ? 'text-accent-soft' : 'text-black/45'}`}>{st.n}</div>
            <div className="truncate text-[0.72rem] font-semibold sm:text-[0.82rem]">{st.label}</div>
          </button>
        ))}
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-6 lg:px-7 lg:pt-6 lg:pb-8" key={step}>
        <div className="step-in">
          <div className="mb-3 flex items-center gap-2 font-mono text-[0.8rem] lg:mb-5">
            <span className={`${concept.color} border-[1.5px] border-ink px-2 py-0.5 font-bold text-[#111]`}>{concept.name}</span>
            <span className="text-black/60">= {concept.text}</span>
          </div>

          <div className="font-mono text-sm text-accent">
            {s.n} / 06
          </div>
          <div className="relative inline-block">
            <h2 className={`text-4xl font-extrabold leading-none tracking-tight ${presenting ? 'lg:text-6xl' : 'lg:text-5xl'}`}>{s.label}</h2>
            <PencilUnderline />
          </div>
          <p className="mt-2 mb-4 text-base text-black/65 lg:mt-3 lg:mb-7 lg:text-lg">{s.question}</p>

          <StepBody state={state} update={update} step={step} />
        </div>
      </div>

      <div className="step-footer flex items-center justify-between gap-2 border-t-[1.5px] border-ink px-3 py-2.5 lg:px-5 lg:py-3">
        <button type="button" className="btn-ghost whitespace-nowrap" disabled={step === 0} onClick={() => setStep(step - 1)}>
          ← Anterior
        </button>
        <span className="hidden font-mono text-sm text-black/50 sm:inline">
          {step + 1} / {STEPS.length}
        </span>
        {step < STEPS.length - 1 ? (
          <button type="button" className="btn-ink whitespace-nowrap" onClick={() => setStep(step + 1)}>
            Próximo →
          </button>
        ) : (
          <button type="button" className="btn-accent whitespace-nowrap" onClick={onTransform}>
            Ver <span className="hidden sm:inline">transformação</span>
            <span className="sm:hidden">o resultado</span> ✨
          </button>
        )}
      </div>
    </div>
  )
}

type StepProps = Pick<Props, 'state' | 'update'>

// As opções de cada etapa (usado no painel do computador e no do celular).
export function StepBody({ step, ...p }: StepProps & { step: number }) {
  return (
    <>
      {step === 0 && <ThemeStep {...p} />}
      {step === 1 && <TitleStep {...p} />}
      {step === 2 && <ColorStep {...p} />}
      {step === 3 && <FontStep {...p} />}
      {step === 4 && <ButtonStep {...p} />}
      {step === 5 && <ActionStep {...p} />}
    </>
  )
}

function Options({ cols = 2, children }: { cols?: 1 | 2; children: ReactNode }) {
  return <div className={`grid gap-3 ${cols === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>{children}</div>
}

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
      onClick={() => {
        if (!selected) scribble(0.75)
        onClick()
      }}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
      className={`choice ${selected ? 'selected' : ''} ${className}`}
    >
      {selected && <PencilCheck />}
      {children}
    </div>
  )
}

function ThemeStep({ state, update }: StepProps) {
  return (
    <Options>
      {THEMES.map((t) => (
        <Card key={t.id} selected={state.theme === t.id} onClick={() => update({ theme: t.id }, 'theme')} className="p-3 text-left lg:p-4">
          {/* key muda ao escolher: o desenho é refeito */}
          <ThemeDoodle key={String(state.theme === t.id)} theme={t.id} />
          <div className="mt-2 text-lg font-bold lg:mt-3 lg:text-xl">{t.label}</div>
          <div className="font-mono text-xs text-black/50">{t.eyebrow}</div>
        </Card>
      ))}
    </Options>
  )
}

function TitleStep({ state, update }: StepProps) {
  const theme = getTheme(state)
  const suggestions = theme?.titles ?? ['Site da Turma', 'Nosso Site', 'Turma Criadora']
  return (
    <div>
      <div className="sketch-field relative">
        <input
          value={state.title}
          onChange={(e) => update({ title: e.target.value }, 'title')}
          onFocus={(e) => e.target.select()}
          placeholder="Digite o título…"
          maxLength={40}
          className="field w-full border-2 border-ink bg-white py-3 pr-14 pl-4 text-2xl font-bold outline-none lg:py-4 lg:text-3xl focus:border-accent focus:shadow-[5px_5px_0_var(--color-accent)]"
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
      <div className="mt-4 overflow-x-auto border-[1.5px] border-ink bg-code px-4 py-3 font-mono text-base whitespace-nowrap text-code-text lg:text-lg">
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
    <Options>
      {PALETTES.map((p) => (
        <Card key={p.id} selected={state.color === p.id} onClick={() => update({ color: p.id }, 'color')} className="p-1.5 text-left">
          <div className="flex h-20 items-center gap-3 rounded-[10px] px-4 lg:h-24" style={{ background: p.bg }}>
            <span className="relative h-11 w-11 shrink-0 rounded-full border-2 lg:h-12 lg:w-12" style={{ background: p.accent, borderColor: p.text }}>
              <span className="absolute -right-1.5 -bottom-1 h-5 w-5 rounded-full border-2" style={{ background: p.accent2, borderColor: p.text }} />
            </span>
            <span className="text-3xl font-black" style={{ color: p.text }}>
              Aa
            </span>
          </div>
          <div className="px-3 pt-2 pb-1">
            <div className="text-lg font-bold">{p.label}</div>
            <div className="font-mono text-xs text-black/50">{p.accent}</div>
          </div>
        </Card>
      ))}
    </Options>
  )
}

function FontStep({ state, update }: StepProps) {
  return (
    <Options cols={1}>
      {FONTS.map((f) => (
        <Card key={f.id} selected={state.font === f.id} onClick={() => update({ font: f.id }, 'font')} className="px-4 py-3 text-left lg:px-5 lg:py-4">
          <div style={{ fontFamily: f.family, fontSize: `${1.7 * f.scale}rem`, lineHeight: 1.4 }}>Site da turma</div>
          <div className="mt-1 font-mono text-xs text-black/50">{f.label}</div>
        </Card>
      ))}
    </Options>
  )
}

function ButtonStep({ state, update }: StepProps) {
  const pal = getPalette(state)
  const accent = pal?.accent ?? '#6C4DFF'
  return (
    <Options>
      {BUTTONS.map((b) => {
        const st = buttonStyle(b.id, accent, '#FFFFFF', '#111111')!
        return (
          <Card key={b.id} selected={state.button === b.id} onClick={() => update({ button: b.id }, 'button')} className="flex flex-col items-center gap-3 px-3 py-5 lg:gap-4 lg:py-6">
            <span className="px-6 py-3 text-lg font-bold" style={st}>
              Explorar
            </span>
            <span className="font-mono text-xs text-black/55">{b.label}</span>
          </Card>
        )
      })}
    </Options>
  )
}

function ActionStep({ state, update }: StepProps) {
  return (
    <div>
      <Options cols={1}>
        {MESSAGES.map((m) => (
          <Card key={m.id} selected={state.message === m.id} onClick={() => update({ message: m.id }, 'message')} className="py-3 pr-10 pl-4 text-left text-lg font-semibold lg:px-5 lg:py-4 lg:text-xl">
            “{m.text}”
          </Card>
        ))}
        <Card selected={state.message === 'custom'} onClick={() => update({ message: 'custom' }, 'message')} className="px-4 py-3 text-left lg:px-5 lg:py-4">
          <div className="text-lg font-semibold lg:text-xl">✏️ Mensagem da turma</div>
          <span className="sketch-field mt-3 block">
            <input
              value={state.customMessage}
              onClick={(e) => e.stopPropagation()}
              onFocus={() => state.message !== 'custom' && update({ message: 'custom' }, 'message')}
              onChange={(e) => update({ customMessage: e.target.value, message: 'custom' }, 'message')}
              placeholder="Digite a mensagem…"
              maxLength={70}
              className="field w-full border-[1.5px] border-ink bg-white px-3 py-2.5 text-lg outline-none focus:border-accent"
            />
          </span>
        </Card>
      </Options>
      <p className="mt-5 border-l-4 border-accent pl-3 text-black/65">
        Agora clique no botão do site para testar! <span className="hidden lg:inline">👉</span>
        <span className="lg:hidden">👆</span>
      </p>
    </div>
  )
}
