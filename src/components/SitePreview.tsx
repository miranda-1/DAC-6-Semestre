import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Play, Repeat, Shuffle, SkipBack, SkipForward } from 'lucide-react'
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
import { Icon } from '../icons'
import { CONTENT } from '../themeContent'
import { montarWidget } from '../widgets'

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
    '--accent2': pal.accent2,
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
    <div
      className="site-root"
      style={vars}
      data-theme={state.theme}
      data-font={state.font}
      data-color={state.color}
    >
      <div className="site-scroll">
        {theme ? (
          <div className="site-themed" key={theme.id}>
            <header className="site-nav">
              <span className="site-logo">
                <span className="site-logo-badge">
                  <Icon name={theme.logo} size={18} />
                </span>
                <span className="site-logo-text">{displayTitle(state)}</span>
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
            <section className="site-widget">
              <div className="site-widget-head">
                <span className="site-card-icon">
                  <Icon name="lista" size={22} />
                </span>
                <div>
                  <h2>Minha lista</h2>
                  <p>Marque seus favoritos com ★.</p>
                </div>
              </div>
              <Widget theme={theme.id} />
            </section>
            <footer className="site-footer">
              <span>
                <Icon name={theme.logo} size={15} /> {displayTitle(state)}
              </span>
              <span>Feito pela turma com HTML, CSS e JavaScript</span>
            </footer>
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
            <div className="site-modal-burst" aria-hidden="true">
              {Array.from({ length: 14 }, (_, i) => (
                <span key={i} style={{ '--i': i } as CSSProperties} />
              ))}
            </div>
            <div className="site-modal-icon">
              <Icon name={theme?.logo ?? 'brilho'} size={30} />
            </div>
            <h2>{modal}</h2>
            {button('Fechar', () => setModal(null))}
          </div>
        </div>
      )}
    </div>
  )
}

// Jogo de blocos na tela do portátil: 8 colunas × 10 linhas; as últimas linhas já vêm empilhadas.
// A "Minha lista": o JavaScript (widgets.ts) monta os cartões dentro desta caixa.
function Widget({ theme }: { theme: keyof typeof CONTENT }) {
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (box.current) montarWidget(box.current)
  }, [theme])
  return <div ref={box} className="widget-body" data-tipo="lista" data-dados={JSON.stringify(CONTENT[theme])} />
}

const STACK = ['aa..bbk.', 'abb.bkka', 'akkbb.aa']
const CELL = 10

function Cell({ c, x, y }: { c: string; x: number; y: number }) {
  return <span className={`cell ${c}`} style={{ left: x * CELL, top: y * CELL }} />
}

function DecoArt({ deco }: { deco: Deco }) {
  switch (deco) {
    case 'pixels':
      return (
        <div className="deco-handheld">
          <div className="bezel">
            <div className="lcd">
              <div className="well">
                {STACK.flatMap((row, y) =>
                  row.split('').map((c, x) => (c === '.' ? null : <Cell key={`${x}-${y}`} c={c} x={x} y={7 + y} />)),
                )}
                <div className="piece">
                  <Cell c="b" x={1} y={0} />
                  <Cell c="b" x={0} y={1} />
                  <Cell c="b" x={1} y={1} />
                  <Cell c="b" x={2} y={1} />
                </div>
              </div>
              <div className="hud">
                <small>NEXT</small>
                <div className="next">
                  <Cell c="a" x={0} y={0} />
                  <Cell c="a" x={1} y={0} />
                  <Cell c="a" x={0} y={1} />
                  <Cell c="a" x={1} y={1} />
                </div>
                <small>LINHAS</small>
                <strong>042</strong>
              </div>
            </div>
            <span className="brand">PORTÁTIL</span>
          </div>
          <div className="controls">
            <div className="dpad">
              <span />
              <span />
            </div>
            <div className="ab">
              <b>B</b>
              <b>A</b>
            </div>
          </div>
          <div className="pills">
            <span />
            <span />
          </div>
          <div className="speaker">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      )
    case 'equalizer':
      return (
        <div className="deco-player">
          <div className="cover">
            <div className="disc">
              <Icon name="ondas" size={28} />
            </div>
            <div className="wave">
              {Array.from({ length: 9 }, (_, i) => (
                <span key={i} style={{ animationDelay: `${-((i * 211) % 900)}ms` }} />
              ))}
            </div>
          </div>
          <div className="info">
            <strong>Faixa 01</strong>
            <span>Playlist da turma</span>
          </div>
          <div className="progress">
            <i />
          </div>
          <div className="time">
            <span>1:24</span>
            <span>3:30</span>
          </div>
          <div className="controls">
            <Shuffle size={16} />
            <SkipBack size={20} />
            <span className="play">
              <Play size={20} fill="currentColor" />
            </span>
            <SkipForward size={20} />
            <Repeat size={16} />
          </div>
        </div>
      )
    case 'field':
      return (
        <div className="deco-scoreboard">
          <div className="board">
            <div className="top">
              <span className="live">AO VIVO</span>
              <span>
                2T 89<i>:</i>59
              </span>
            </div>
            <div className="score">
              <div>
                <b>TURMA</b>
                <strong>3</strong>
              </div>
              <span>×</span>
              <div>
                <b>RIVAIS</b>
                <strong>2</strong>
              </div>
            </div>
            <div className="goal">GOOOL!</div>
          </div>
          <div className="legs">
            <i />
            <i />
          </div>
        </div>
      )
    case 'filmstrip':
      return (
        <div className="deco-clapper">
          <div className="clap">
            <div className="arm" />
            <div className="stripes" />
            <div className="board">
              <div>
                <span>CENA</span>
                <b>01</b>
              </div>
              <div>
                <span>TAKE</span>
                <b>3</b>
              </div>
              <div className="wide">
                <span>DIREÇÃO</span>
                <b>A TURMA</b>
              </div>
            </div>
          </div>
          <div className="action">AÇÃO!</div>
        </div>
      )
    case 'stars':
      return (
        <div className="deco-astronaut">
          {Array.from({ length: 26 }, (_, i) => (
            <span
              key={i}
              className="star"
              style={{ left: `${(i * 37) % 100}%`, top: `${(i * 61) % 100}%`, animationDelay: `${(i * 191) % 2000}ms` }}
            />
          ))}
          <div className="planet" />
          <div className="astro">
            <div className="pack" />
            <div className="arm l" />
            <div className="arm r" />
            <div className="leg l" />
            <div className="leg r" />
            <div className="body">
              <i />
            </div>
            <div className="helmet">
              <div className="visor" />
            </div>
          </div>
        </div>
      )
  }
}
