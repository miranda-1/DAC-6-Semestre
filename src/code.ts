// Gera um código "didático" (simplificado) que representa as escolhas da turma.
import {
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
} from './data'

export type ChangeKey = 'theme' | 'title' | 'color' | 'font' | 'button' | 'message'
export type Lang = 'html' | 'css' | 'js'

export interface CodeLine {
  text: string
  tags?: ChangeKey[]
  comment?: boolean
}

const L = (text: string, ...tags: ChangeKey[]): CodeLine => ({ text, tags })
const C = (text: string): CodeLine => ({ text, comment: true })

export function htmlCode(s: SiteState): CodeLine[] {
  const theme = getTheme(s)
  const title = displayTitle(s)
  const hasMsg = s.message !== 'none'
  const button = hasMsg
    ? L(`<button onclick="explorar()">${buttonLabel(s)}</button>`, 'message')
    : L(`<button>${buttonLabel(s)}</button>`, 'theme')

  if (!theme) {
    return [L(`<h1>${title}</h1>`, 'title'), L(`<p>${paragraph(s)}</p>`, 'theme'), button]
  }
  return [
    L('<header>', 'theme'),
    L(`  <span>${theme.emoji} ${title}</span>`, 'theme', 'title'),
    L(`  <nav>${theme.nav.map((n) => `<a>${n}</a>`).join(' ')}</nav>`, 'theme'),
    L('</header>', 'theme'),
    L(''),
    L(`<p class="tema">${theme.eyebrow}</p>`, 'theme'),
    L(`<h1>${title}</h1>`, 'title'),
    L(`<p>${theme.tagline}</p>`, 'theme'),
    button,
    L(''),
    ...ART_HTML[theme.deco].map((t) => L(t, 'theme')),
    L(''),
    L('<section class="cartoes">', 'theme'),
    ...theme.cards.map((c) => L(`  <div><h3>${c.icon} ${c.title}</h3> <p>${c.text}</p></div>`, 'theme')),
    L('</section>', 'theme'),
  ]
}

// A "arte" de cada tema, em HTML simplificado.
const ART_HTML: Record<Deco, string[]> = {
  pixels: [
    '<div class="arte fliperama">',
    '  <p>HI-SCORE 013370</p>',
    '  <div class="invasor">👾</div>',
    '  <div class="nave">▲</div>',
    '</div>',
  ],
  equalizer: [
    '<div class="arte equalizador">',
    '  <span class="nota">♪</span>',
    '  <span class="barra"></span>',
    '  <span class="barra"></span>',
    '  <!-- ...mais 12 barras iguais -->',
    '</div>',
  ],
  field: [
    '<div class="arte campo">',
    '  <div class="linha-do-meio"></div>',
    '  <div class="circulo-central"></div>',
    '  <div class="area esquerda"></div>',
    '  <div class="area direita"></div>',
    '  <span class="bola">⚽</span>',
    '</div>',
  ],
  filmstrip: [
    '<div class="arte filme">',
    '  <div class="quadro">🎬</div>',
    '  <div class="quadro">🍿</div>',
    '  <div class="quadro">⭐</div>',
    '  <div class="quadro">🎞️</div>',
    '</div>',
  ],
  stars: [
    '<div class="arte espaco">',
    '  <span class="estrela"></span>',
    '  <!-- ...mais 27 estrelas -->',
    '  <div class="planeta"></div>',
    '  <span class="foguete">🚀</span>',
    '</div>',
  ],
}

// O CSS que desenha e anima a arte de cada tema.
function artCss(deco: Deco, accent: string): CodeLine[] {
  const rule = (sel: string, ...props: [string, ChangeKey[]][]) => [
    L(`${sel} {`, 'theme'),
    ...props.map(([t, tags]) => L(`  ${t}`, ...tags)),
    L('}', 'theme'),
    L(''),
  ]
  const T: ChangeKey[] = ['theme']
  const TC: ChangeKey[] = ['theme', 'color']
  switch (deco) {
    case 'pixels':
      return [
        ...rule('.invasor', [`color: ${accent};`, TC], ['animation: flutuar 1.2s infinite;', T]),
        ...rule('.nave', ['animation: deslizar 3s infinite;', T]),
      ]
    case 'equalizer':
      return [
        ...rule('.equalizador', ['border-radius: 50%;', T]),
        ...rule('.barra', [`background-color: ${accent};`, TC], ['animation: pular 0.9s infinite;', T]),
      ]
    case 'field':
      return [
        ...rule('.campo, .area, .circulo-central', [`border: 3px solid ${accent};`, TC]),
        ...rule('.circulo-central', ['border-radius: 50%;', T]),
        ...rule('.bola', ['animation: chutar 2.4s infinite;', T]),
      ]
    case 'filmstrip':
      return [
        ...rule('.filme', ['transform: rotate(-8deg);', T], ['animation: rolar 6s infinite;', T]),
        ...rule('.quadro', [`background-color: ${accent};`, TC]),
      ]
    case 'stars':
      return [
        ...rule('.espaco', ['border-radius: 50%;', T], ['background-color: #07071A;', T]),
        ...rule('.estrela', ['animation: piscar 2s infinite;', T]),
        ...rule('.planeta', ['border-radius: 50%;', T], [`background-color: ${accent};`, TC]),
        ...rule('.foguete', ['animation: voar 3s infinite;', T]),
      ]
  }
}

export function cssCode(s: SiteState): CodeLine[] {
  const pal = getPalette(s)
  const font = getFont(s)
  const lines: CodeLine[] = []

  const theme = getTheme(s)
  if (!theme && !pal && !font && s.button === 'none') {
    return [
      C('/* Ainda não tem CSS!'),
      C('   Por isso o navegador usa o visual padrão:'),
      C('   fundo branco, letra preta, fonte "de jornal". */'),
    ]
  }

  if (pal || font) {
    lines.push(L('body {'))
    if (pal) {
      lines.push(L(`  background-color: ${pal.bg};`, 'color'))
      lines.push(L(`  color: ${pal.text};`, 'color'))
    }
    if (font) lines.push(L(`  font-family: ${font.css};`, 'font'))
    lines.push(L('}'), L(''))
  }

  if (pal) {
    lines.push(L('h1 {'), L(`  color: ${pal.accent};`, 'color'), L('}'), L(''))
  }

  const accent = pal?.accent ?? '#000000'
  const bs = buttonStyle(s.button, accent, pal?.onAccent ?? '#FFFFFF', pal?.text ?? '#000000')
  if (bs) {
    lines.push(L('button {'))
    lines.push(L(`  background-color: ${bs.background};`, 'color', 'button'))
    lines.push(L(`  color: ${bs.color};`, 'color', 'button'))
    lines.push(L(`  border-radius: ${bs.borderRadius};`, 'button'))
    lines.push(L(`  border: ${bs.border};`, 'button'))
    if (bs.boxShadow !== 'none') lines.push(L(`  box-shadow: ${bs.boxShadow};`, 'button'))
    lines.push(L('}'), L(''))
  }

  if (theme) {
    lines.push(C(`/* Arte do tema ${theme.label} */`))
    lines.push(...artCss(theme.deco, accent))
  }

  while (lines.length && lines[lines.length - 1].text === '') lines.pop()
  return lines
}

export function jsCode(s: SiteState): CodeLine[] {
  const msg = getMessage(s)
  if (!msg) {
    return [
      C('// Ainda não tem JavaScript.'),
      C('// O botão existe (HTML) e tem visual (CSS),'),
      C('// mas ainda não FAZ nada quando clicamos.'),
    ]
  }
  return [
    L('function explorar() {', 'message'),
    L(`  mostrarMensagem("${msg}");`, 'message'),
    L('}', 'message'),
  ]
}

export const CODE: Record<Lang, (s: SiteState) => CodeLine[]> = { html: htmlCode, css: cssCode, js: jsCode }

// Qual aba de código cada mudança afeta.
export const LANG_OF: Record<ChangeKey, Lang> = {
  theme: 'html',
  title: 'html',
  color: 'css',
  font: 'css',
  button: 'css',
  message: 'js',
}
