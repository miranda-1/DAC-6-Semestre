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
    L(`  <span><img src="${theme.logo}.svg"> ${title}</span>`, 'theme', 'title'),
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
    L('<section class="lista">', 'theme'),
    L('  <h2>Minha lista</h2>', 'theme'),
    L('  <!-- o JavaScript cria o conteúdo aqui -->', 'theme'),
    L('</section>', 'theme'),
    L(''),
    L(`<footer>${title} · Feito pela turma</footer>`, 'theme', 'title'),
  ]
}

// Um resumo do JavaScript da "Minha lista" (o código completo vai no HTML baixado).
const LISTA_JS = ['let favoritos = [];', '', 'function favoritar(item) {', '  favoritos.push(item);', '  contador.textContent = favoritos.length;', '}']

// A "arte" de cada tema, em HTML simplificado.
const ART_HTML: Record<Deco, string[]> = {
  pixels: [
    '<div class="arte portatil">',
    '  <div class="tela">',
    '    <div class="peca"></div>',
    '    <!-- ...mais blocos empilhados -->',
    '    <p>LINHAS 042</p>',
    '  </div>',
    '  <div class="direcional"></div>',
    '  <button class="botao-b">B</button>',
    '  <button class="botao-a">A</button>',
    '</div>',
  ],
  equalizer: [
    '<div class="arte player">',
    '  <div class="capa"><img src="ondas.svg"></div>',
    '  <h3>Faixa 01</h3>',
    '  <p>Playlist da turma</p>',
    '  <div class="progresso"></div>',
    '  <button class="tocar">▶</button>',
    '</div>',
  ],
  field: [
    '<div class="arte placar">',
    '  <p class="ao-vivo">AO VIVO</p>',
    '  <p>TURMA <strong>3</strong> × <strong>2</strong> RIVAIS</p>',
    '  <p class="gol">GOOOL!</p>',
    '</div>',
  ],
  filmstrip: [
    '<div class="arte claquete">',
    '  <div class="haste"></div>',
    '  <p>CENA 01 · TAKE 3</p>',
    '  <p>DIREÇÃO: A TURMA</p>',
    '</div>',
    '<p class="acao">AÇÃO!</p>',
  ],
  stars: [
    '<div class="arte espaco">',
    '  <span class="estrela"></span>',
    '  <!-- ...mais 25 estrelas -->',
    '  <div class="planeta"></div>',
    '  <div class="astronauta">',
    '    <div class="capacete"><div class="visor"></div></div>',
    '    <div class="corpo"></div>',
    '  </div>',
    '</div>',
  ],
}

// O CSS que desenha e anima a arte de cada tema.
function artCss(deco: Deco, accent: string, accent2: string): CodeLine[] {
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
        ...rule('main::before', ['transform: perspective(260px) rotateX(58deg);', T], ['animation: andar 1.4s infinite;', T]),
        ...rule('.portatil', ['border-radius: 16px 16px 48px 16px;', T]),
        ...rule('.peca', [`background-color: ${accent2};`, TC], ['animation: cair 3.5s infinite;', T]),
        ...rule('.botao-a', [`background-color: ${accent};`, TC], ['border-radius: 50%;', T]),
      ]
    case 'equalizer':
      return [
        ...rule('.capa', [`background: linear-gradient(${accent}, ${accent2});`, TC], ['border-radius: 16px;', T]),
        ...rule('.progresso', [`background-color: ${accent};`, TC], ['animation: tocar 6s infinite;', T]),
        ...rule('.tocar', [`background-color: ${accent};`, TC], ['border-radius: 50%;', T]),
      ]
    case 'field':
      return [
        ...rule('.placar', ['background-color: #0B0D14;', T], ['font-family: "Press Start 2P";', T]),
        ...rule('.placar strong', [`text-shadow: 0 0 14px ${accent};`, TC]),
        ...rule('.gol', [`background-color: ${accent};`, TC], ['animation: piscar 1.6s infinite;', T]),
      ]
    case 'filmstrip':
      return [
        ...rule('.haste', ['transform-origin: left bottom;', T], ['animation: bater 2s infinite;', T]),
        ...rule('.claquete', [`box-shadow: 8px 8px 0 ${accent};`, TC]),
        ...rule('.acao', [`color: ${accent};`, TC], ['animation: aparecer 2s infinite;', T]),
      ]
    case 'stars':
      return [
        ...rule('.espaco', ['border-radius: 50%;', T], ['background-color: #07071A;', T]),
        ...rule('.estrela', ['animation: piscar 2s infinite;', T]),
        ...rule('.planeta', ['border-radius: 50%;', T], [`background-color: ${accent};`, TC]),
        ...rule('.astronauta', ['animation: flutuar 6s infinite;', T]),
        ...rule('.visor', [`background: linear-gradient(${accent}, ${accent2});`, TC]),
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

  if (theme && pal) {
    lines.push(L('.lista {', 'theme'))
    lines.push(L(`  background-color: ${pal.surface};`, 'color'))
    lines.push(L('  border-radius: 22px;', 'theme'))
    lines.push(L('}', 'theme'), L(''))
  }

  if (theme) {
    lines.push(C(theme.id === 'games' ? '/* Fundo neon e arte do tema Games */' : `/* Arte do tema ${theme.label} */`))
    lines.push(...artCss(theme.deco, accent, pal?.accent2 ?? '#000000'))
  }

  while (lines.length && lines[lines.length - 1].text === '') lines.pop()
  return lines
}

export function jsCode(s: SiteState): CodeLine[] {
  const msg = getMessage(s)
  const lines: CodeLine[] = msg
    ? [L('function explorar() {', 'message'), L(`  mostrarMensagem("${msg}");`, 'message'), L('}', 'message')]
    : [
        C('// O botão ainda não FAZ nada quando clicamos.'),
        C('// (escolha uma mensagem na etapa Ação)'),
      ]
  if (getTheme(s)) {
    lines.push(L(''), C('// Minha lista'), ...LISTA_JS.map((t) => L(t, 'theme')))
  } else if (!msg) {
    lines.unshift(C('// Ainda não tem JavaScript.'))
  }
  return lines
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
