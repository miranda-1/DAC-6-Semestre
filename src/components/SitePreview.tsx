import { useState, type CSSProperties } from 'react'
import {
  DEFAULT_FONT,
  DEFAULT_PALETTE,
  type Deco,
  type SiteState,
  buttonLabel,
  buttonStyle,
  displayTitle,
  getFont,
  getMessage,
  getPalette,
  getTheme,
  paragraph,
} from '../data'

interface Props {
  state: SiteState
  interactive?: boolean
}

export default function SitePreview({ state, interactive = true }: Props) {
  const [modal, setModal] = useState<string | null>(null)
  const theme = getTheme(state)
  const pal = getPalette(state) ?? DEFAULT_PALETTE
  const font = getFont(state)
  const bs = buttonStyle(state.button, pal.accent, pal.onAccent, pal.text)

  const vars = {
    '--bg': pal.bg,
    '--surface': pal.surface,
    '--text': pal.text,
    '--accent': pal.accent,
    '--on-accent': pal.onAccent,
    '--fs': font?.scale ?? 1,
    fontFamily: font?.family ?? DEFAULT_FONT,
  } as CSSProperties

  const onClick = () => {
    if (!interactive) return
    const msg = getMessage(state)
    if (msg) setModal(msg)
  }

  const button = (label: string, handler: () => void) => (
    <button
      type="button"
      className={bs ? 'site-btn styled' : 'site-btn'}
      style={bs ?? undefined}
      onClick={handler}
    >
      {label}
    </button>
  )

  return (
    <div className="site-root" style={vars} data-theme={state.theme} data-font={state.font} data-color={state.color}>
      <div className="site-scroll">
        {theme ? (
          <div className="site-themed" key={theme.id}>
            <header className="site-nav">
              <span className="site-logo">
                <span>{theme.emoji}</span> {displayTitle(state)}
              </span>
              <nav>
                {theme.nav.map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </nav>
            </header>
            <main className="site-hero">
              <div className="site-hero-text">
                <p className="site-eyebrow">{theme.eyebrow}</p>
                <h1>{displayTitle(state)}</h1>
                <p className="site-lead">{theme.tagline}</p>
                {button(buttonLabel(state), onClick)}
              </div>
              <div className="site-art">
                <DecoArt deco={theme.deco} />
              </div>
            </main>
            <section className="site-cards">
              {theme.cards.map((c) => (
                <article key={c.title}>
                  <div className="site-card-icon">{c.icon}</div>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </article>
              ))}
            </section>
          </div>
        ) : (
          <div className="site-raw">
            <h1>{displayTitle(state)}</h1>
            <p>{paragraph(state)}</p>
            {button(buttonLabel(state), onClick)}
          </div>
        )}
      </div>

      {modal && (
        <div className="site-modal-backdrop" onClick={() => setModal(null)}>
          <div className="site-modal" onClick={(e) => e.stopPropagation()}>
            <div className="site-modal-icon">{theme?.emoji ?? '✨'}</div>
            <h2>{modal}</h2>
            {button('Fechar', () => setModal(null))}
          </div>
        </div>
      )}
    </div>
  )
}

const INVADER = [
  '..X.....X..',
  '...X...X...',
  '..XXXXXXX..',
  '.XX.XXX.XX.',
  'XXXXXXXXXXX',
  'X.XXXXXXX.X',
  'X.X.....X.X',
  '...XX.XX...',
]

function DecoArt({ deco }: { deco: Deco }) {
  switch (deco) {
    case 'pixels':
      return (
        <div className="deco-pixels">
          <div className="deco-score">HI-SCORE 013370</div>
          <div className="deco-invader">
            {INVADER.flatMap((row, y) =>
              row.split('').map((c, x) => <span key={`${x}-${y}`} className={c === 'X' ? 'on' : ''} />),
            )}
          </div>
          <div className="deco-ship">▲</div>
        </div>
      )
    case 'equalizer':
      return (
        <div className="deco-eq">
          {Array.from({ length: 14 }, (_, i) => (
            <span key={i} style={{ animationDelay: `${(i * 137) % 900}ms`, animationDuration: `${700 + ((i * 53) % 500)}ms` }} />
          ))}
          <div className="deco-eq-note">♪</div>
        </div>
      )
    case 'field':
      return (
        <div className="deco-field">
          <div className="mid" />
          <div className="circle" />
          <div className="box left" />
          <div className="box right" />
          <div className="ball">⚽</div>
        </div>
      )
    case 'filmstrip':
      return (
        <div className="deco-film">
          <div className="strip">
            {['🎬', '🍿', '⭐', '🎞️', '🎬', '🍿', '⭐', '🎞️'].map((e, i) => (
              <div key={i} className="frame">
                {e}
              </div>
            ))}
          </div>
        </div>
      )
    case 'stars':
      return (
        <div className="deco-space">
          {Array.from({ length: 28 }, (_, i) => (
            <span
              key={i}
              className="star"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 61) % 100}%`,
                animationDelay: `${(i * 191) % 2000}ms`,
              }}
            />
          ))}
          <div className="planet" />
          <div className="rocket">🚀</div>
        </div>
      )
  }
}
