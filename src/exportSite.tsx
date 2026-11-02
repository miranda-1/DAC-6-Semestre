// Gera um arquivo .html completo com o site da turma + uma página "Continue aprendendo".
import siteCss from './site.css?raw'
import SitePreview from './components/SitePreview'
import { CODE, type Lang } from './code'
import { Icon } from './icons'
import { WIDGETS_JS } from './widgets'
import { DEFAULT_PALETTE, type SiteState, displayTitle, getFont, getMessage, getPalette, getTheme, slug } from './data'

const FONT_LINKS: Record<string, string> = {
  moderna: 'Poppins:wght@400;700;800',
  classica: 'Playfair+Display:wght@400;700;800',
  gamer: 'Press+Start+2P',
  manuscrita: 'Caveat:wght@400;700',
}

const YOUTUBE = [
  {
    title: 'Aula 1: comece o HTML5 e CSS3 aqui',
    who: 'Curso em Vídeo · primeiro vídeo',
    text: 'O vídeo de abertura do curso: explica o que você vai aprender e como estudar.',
    url: 'https://www.youtube.com/watch?v=Ejkb_YpuHWs',
  },
  {
    title: 'Aula 1: o que o JavaScript é capaz de fazer?',
    who: 'Curso em Vídeo · primeiro vídeo',
    text: 'Antes de programar, veja tudo o que dá para criar com JavaScript.',
    url: 'https://www.youtube.com/watch?v=Ptbk2af68e8',
  },
  {
    title: 'HTML5 e CSS3 do zero',
    who: 'Curso em Vídeo · Gustavo Guanabara',
    text: 'O curso mais famoso do Brasil para começar. Módulo 1 de 5, com exercícios e material em PDF.',
    url: 'https://www.youtube.com/playlist?list=PLHz_AreHm4dkZ9-atkcmcBaMZdmLHft8n',
  },
  {
    title: 'JavaScript para iniciantes',
    who: 'Curso em Vídeo · Gustavo Guanabara',
    text: 'Aprenda a fazer a página reagir: variáveis, condições, repetições e eventos de clique.',
    url: 'https://www.youtube.com/playlist?list=PLHz_AreHm4dlsK3Nr9GVvXCbpQyHQl1o1',
  },
  {
    title: 'Canal Curso em Vídeo',
    who: 'YouTube',
    text: 'Os outros módulos de HTML e CSS, além de cursos de algoritmos, Python e mais.',
    url: 'https://www.youtube.com/@CursoemVideo',
  },
  {
    title: 'Canal Rocketseat',
    who: 'YouTube',
    text: 'Vídeos sobre programação web, projetos práticos e carreira em tecnologia.',
    url: 'https://www.youtube.com/@rocketseat',
  },
]

const SITES = [
  {
    title: 'Primo Academy',
    who: 'em português · open source',
    text: 'Trilhas guiadas, do primeiro código ao primeiro projeto no ar, no seu ritmo.',
    url: 'https://aprenda.oprimo.dev',
  },
  {
    title: 'MDN Web Docs',
    who: 'Mozilla · em português',
    text: 'O “dicionário oficial” da web. Tem um caminho guiado para quem está começando.',
    url: 'https://developer.mozilla.org/pt-BR/docs/Learn_web_development',
  },
  {
    title: 'freeCodeCamp',
    who: 'em português · com certificado grátis',
    text: 'Você escreve código direto no navegador e vai passando de fase, como num jogo.',
    url: 'https://www.freecodecamp.org/portuguese/learn',
  },
  {
    title: 'Khan Academy: HTML e CSS',
    who: 'em português',
    text: 'Aulas em vídeo interativas: dá para pausar e mexer no código do professor.',
    url: 'https://pt.khanacademy.org/computing/computer-programming/html-css',
  },
  {
    title: 'web.dev: Aprenda HTML',
    who: 'Google',
    text: 'Curso completo e gratuito de HTML. Depois tem o de CSS no mesmo site.',
    url: 'https://web.dev/learn/html?hl=pt-BR',
  },
  {
    title: 'Material do Guanabara',
    who: 'GitHub',
    text: 'Exercícios, exemplos e PDFs do curso de HTML e CSS, tudo para baixar.',
    url: 'https://github.com/gustavoguanabara/html-css',
  },
  {
    title: 'W3Schools',
    who: 'em inglês',
    text: 'Exemplos curtinhos com botão “Try it”: você edita e vê o resultado na hora.',
    url: 'https://www.w3schools.com/html/',
  },
]

const PATH = [
  { tag: 'HTML', when: 'semanas 1 e 2', text: 'Títulos, parágrafos, imagens e links. Faça uma página sobre você.' },
  { tag: 'CSS', when: 'semanas 3 a 5', text: 'Cores, fontes, espaços e flexbox. Deixe a sua página com a sua cara.' },
  { tag: 'JS', when: 'semanas 6 a 8', text: 'Variáveis, funções e cliques. Faça um botão que faz alguma coisa.' },
  { tag: '★', when: 'depois', text: 'Refaça este site do zero, do seu jeito, e mostre para a turma.' },
]

const LANG_INFO: Record<Lang, { name: string; text: string; color: string }> = {
  html: { name: 'HTML', text: 'o que existe na página', color: '#FFB547' },
  css: { name: 'CSS', text: 'como a página aparece', color: '#4DC9FF' },
  js: { name: 'JavaScript', text: 'o que a página faz', color: '#F7DF1E' },
}

const esc = (t: string) =>
  t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const link = (r: { title: string; who: string; text: string; url: string }) => `
        <a class="recurso" href="${r.url}" target="_blank" rel="noopener">
          <span class="recurso-quem">${esc(r.who)}</span>
          <strong>${esc(r.title)} <span aria-hidden="true">↗</span></strong>
          <span>${esc(r.text)}</span>
        </a>`

export async function buildSiteHtml(state: SiteState): Promise<string> {
  const { renderToStaticMarkup } = await import('react-dom/server')
  const theme = getTheme(state)
  const pal = getPalette(state) ?? DEFAULT_PALETTE
  const font = getFont(state)
  const title = displayTitle(state)
  const msg = getMessage(state)
  const today = new Date().toLocaleDateString('pt-BR')

  const site = renderToStaticMarkup(<SitePreview state={state} interactive={false} />)

  // A fonte pixelada aparece nas artes dos temas (placar, claquete, portátil…); a manuscrita, nos títulos do caderno
  const families = [font?.id, theme ? 'gamer' : undefined, 'manuscrita']
    .filter((f, i, all): f is string => !!f && all.indexOf(f) === i)
    .map((f) => `family=${FONT_LINKS[f]}`)
  const fontLink = families.length
    ? `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${families.join('&')}&display=swap" />`
    : ''

  const codeBlocks = (['html', 'css', 'js'] as Lang[])
    .map((lang) => {
      const info = LANG_INFO[lang]
      const code = CODE[lang](state)
        .map((l) => esc(l.text))
        .join('\n')
      return `
        <figure class="codigo">
          <figcaption><span style="background:${info.color}">${info.name}</span> = ${info.text}</figcaption>
          <pre><code>${code}</code></pre>
        </figure>`
    })
    .join('')

  const script = msg
    ? `
  // Quando clicar no botão, a função explorar() mostra a mensagem da turma.
  var mensagem = ${JSON.stringify(msg).replace(/</g, '\\u003c')};
  var icone = ${JSON.stringify(renderToStaticMarkup(<Icon name={theme?.logo ?? 'brilho'} size={30} />))};
  var botao = document.querySelector('.site-root .site-btn');

  function explorar() {
    mostrarMensagem(mensagem);
  }

  function mostrarMensagem(texto) {
    var fundo = document.createElement('div');
    fundo.className = 'site-modal-backdrop';
    var confete = '';
    for (var i = 0; i < 14; i++) confete += '<span style="--i:' + i + '"></span>';
    fundo.innerHTML =
      '<div class="site-modal">' +
      '<div class="site-modal-burst">' + confete + '</div>' +
      '<div class="site-modal-icon">' + icone + '</div>' +
      '<h2></h2>' +
      '<button type="button">Fechar</button>' +
      '</div>';
    fundo.querySelector('h2').textContent = texto;
    var fechar = fundo.querySelector('button');
    fechar.className = botao.className;
    fechar.setAttribute('style', botao.getAttribute('style') || '');
    fundo.onclick = function (e) {
      if (e.target === fundo || e.target === fechar) fundo.remove();
    };
    document.querySelector('.site-root').appendChild(fundo);
  }

  botao.onclick = explorar;`
    : `
  // Ainda não tem JavaScript: o botão existe (HTML) e tem visual (CSS),
  // mas não FAZ nada quando clicamos. Que tal você programar isso?`

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<!--
  Este site foi criado pela turma na oficina "Do usuário ao criador" (${today}).

  DICA: este arquivo é um site completo. Abra ele num editor de texto
  (Bloco de Notas, TextEdit ou VS Code), procure por <h1 e troque o título.
  Salve, abra de novo no navegador e veja a mudança!
-->
${fontLink}
<style>
/* ===== CSS = como a página aparece ===== */
*, ::before, ::after { box-sizing: border-box; margin: 0; padding: 0; border: 0 solid; }
html { line-height: 1.5; -webkit-text-size-adjust: 100%; }
body { background: ${pal.bg}; -webkit-font-smoothing: antialiased; }
h1, h2, h3 { font-size: inherit; font-weight: inherit; }
a { color: inherit; }

${siteCss}

/* Ajustes para o site ocupar a página inteira */
.site-root, .site-scroll { height: auto; overflow: visible; }
.site-themed { min-height: 100vh; min-height: 100svh; }
.site-modal-backdrop { position: fixed; }

/* ===== Página "Continue aprendendo": folha de caderno, como na oficina ===== */
.aprenda {
  --papel: #fdfbf3; --tinta: #1f3a93; --vermelho: #e63946; --fita: rgba(255, 214, 102, 0.85);
  --torto: 6px 16px 8px 14px / 14px 8px 16px 6px;
  position: relative;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  color: var(--tinta);
  background-color: var(--papel);
  background-image: linear-gradient(90deg, transparent 46px, rgba(230, 57, 70, 0.35) 46px 48px, transparent 48px),
    repeating-linear-gradient(transparent 0 31px, rgba(31, 58, 147, 0.13) 31px 32px);
  border-top: 2px solid var(--tinta);
  padding: 80px 24px 40px 72px;
}
/* espiral do caderno */
.aprenda::before {
  content: ''; position: absolute; top: -16px; left: 0; right: 0; height: 34px;
  background: radial-gradient(ellipse 5px 15px at 50% 50%, transparent 2.5px, #8d93a3 3px 5px, transparent 5.5px) 0 0 / 38px 34px repeat-x;
}
.aprenda a { color: var(--vermelho); }
.aprenda-in { max-width: 1040px; margin: 0 auto; }
.aprenda-topo { max-width: 46em; margin-bottom: 56px; }
.aprenda-selo {
  display: inline-block; font: 700 22px/1.2 'Caveat', cursive; padding: 2px 16px; margin-bottom: 18px;
  background: var(--fita); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15); transform: rotate(-2deg);
}
.aprenda h2 { font: 700 clamp(44px, 8vw, 72px)/1 'Caveat', cursive; text-wrap: balance; }
.aprenda h2 em { font-style: normal; color: var(--vermelho); }
.aprenda-topo p { font-size: 18px; line-height: 1.6; margin-top: 16px; text-wrap: pretty; }
.aprenda section { margin-bottom: 64px; }
.aprenda h3 {
  display: inline; font: 700 36px/1.1 'Caveat', cursive;
  background: linear-gradient(transparent 58%, var(--fita) 58% 92%, transparent 92%);
}
.aprenda h3 + p { opacity: 0.75; margin: 10px 0 24px; }
.grade { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 22px; }

/* cartões com contorno de caneta, sombra e fita adesiva */
.codigo, .passos li, .recurso, .caminho div {
  position: relative; background: #fffef9; border: 2.5px solid var(--tinta); border-radius: var(--torto);
  box-shadow: 4px 5px 0 var(--tinta);
}
.recurso::after, .caminho div::after {
  content: ''; position: absolute; top: -10px; left: 50%; width: 58px; height: 18px; margin-left: -29px;
  background: var(--fita); transform: rotate(-3deg);
}
.grade > :nth-child(odd), .caminho div:nth-child(odd) { transform: rotate(-0.6deg); }
.grade > :nth-child(even), .caminho div:nth-child(even) { transform: rotate(0.5deg); }

.codigo { background: #17151f; color: #e7e5f0; overflow: hidden; min-width: 0; }
.codigo figcaption { font: 13px ui-monospace, Menlo, monospace; padding: 12px 14px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.65); }
.codigo figcaption span { color: #111; font-weight: 700; padding: 2px 7px; margin-right: 4px; border: 1.5px solid #111; }
.codigo pre { font: 12.5px/1.7 ui-monospace, Menlo, monospace; padding: 14px; overflow-x: auto; max-height: 340px; }

.passos { list-style: none; counter-reset: passo; display: grid; gap: 16px; }
.passos li { counter-increment: passo; padding: 16px 18px 16px 66px; line-height: 1.55; }
.passos li::before {
  content: counter(passo); position: absolute; left: 14px; top: 12px; width: 38px; height: 38px; border-radius: 50%;
  display: grid; place-items: center; font: 700 26px/1 'Caveat', cursive; background: var(--fita); border: 2px solid var(--tinta);
}
.passos code, .desafio code { font-family: ui-monospace, Menlo, monospace; background: rgba(255, 214, 102, 0.5); padding: 1px 6px; border-radius: 5px; }
.desafio {
  margin-top: 22px; padding: 16px 18px; line-height: 1.55; background: #fff3b0; transform: rotate(-1deg);
  box-shadow: 3px 4px 0 rgba(31, 58, 147, 0.25);
}

.recurso { display: flex; flex-direction: column; gap: 6px; text-decoration: none; padding: 20px 18px 18px; color: var(--tinta) !important; transition: transform 0.2s, box-shadow 0.2s; }
.recurso:hover { transform: translate(-2px, -3px) rotate(0deg); box-shadow: 7px 8px 0 var(--tinta); }
.recurso strong { font-size: 18px; color: var(--vermelho); }
.recurso span:last-child { opacity: 0.8; line-height: 1.5; font-size: 15px; }
.recurso-quem { font: 700 11px ui-monospace, Menlo, monospace; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.55; }
.youtube .recurso::after { background: rgba(255, 0, 51, 0.35); }

.caminho { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 22px; margin-top: 8px; }
.caminho div { padding: 22px 18px 18px; }
.caminho b {
  display: inline-grid; place-items: center; min-width: 48px; height: 34px; padding: 0 10px; color: #111;
  font: 700 15px ui-monospace, Menlo, monospace; border: 2px solid var(--tinta);
}
.caminho div:nth-child(1) b { background: #ffb547; }
.caminho div:nth-child(2) b { background: #4dc9ff; }
.caminho div:nth-child(3) b { background: #f7df1e; }
.caminho div:nth-child(4) b { background: var(--vermelho); color: #fff; }
.caminho small { display: block; margin: 12px 0 4px; font: 700 22px/1.1 'Caveat', cursive; color: var(--vermelho); }
.caminho p { line-height: 1.5; }
.dicas { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; margin-top: 28px; list-style: none; }
.dicas li { padding: 14px 16px; border-radius: var(--torto); border: 2px dashed rgba(31, 58, 147, 0.4); line-height: 1.5; }
.aprenda-fim { text-align: center; font: 700 26px/1.2 'Caveat', cursive; padding-top: 24px; border-top: 2px solid rgba(31, 58, 147, 0.2); }

/* No celular a margem vermelha vai para a beirada */
@media (max-width: 640px) {
  .aprenda {
    padding: 64px 18px 32px 22px;
    background-image: linear-gradient(90deg, transparent 6px, rgba(230, 57, 70, 0.35) 6px 8px, transparent 8px),
      repeating-linear-gradient(transparent 0 31px, rgba(31, 58, 147, 0.13) 31px 32px);
  }
}
</style>
</head>
<body>

<!-- ===== HTML = o que existe na página ===== -->
${site}

<!-- ===== Continue aprendendo ===== -->
<div class="aprenda">
  <div class="aprenda-in">
    <header class="aprenda-topo">
      <span class="aprenda-selo">Oficina “Do usuário ao criador” · ${today}</span>
      <h2>Vocês criaram este site. <em>Agora é só continuar.</em></h2>
      <p>Tudo o que aparece aí em cima foi feito com três linguagens: <b>HTML</b>, <b>CSS</b> e <b>JavaScript</b>.
      Elas são de graça, funcionam em qualquer computador e dá para aprender sozinho com os links desta página.</p>
    </header>

    <section>
      <h3>O código que a turma escolheu</h3>
      <p>Uma versão resumida para ler. O código completo está dentro deste arquivo: abra num editor de texto para ver.</p>
      <div class="grade">${codeBlocks}
      </div>
    </section>

    <section>
      <h3>Mexa no seu site</h3>
      <p>Este arquivo já é um site de verdade. Que tal mudar alguma coisa?</p>
      <ol class="passos">
        <li>Salve este arquivo no computador (ele se chama <code>${esc(slug(title))}.html</code>).</li>
        <li>Clique com o botão direito nele → <b>Abrir com</b> → Bloco de Notas (Windows) ou TextEdit (Mac). Melhor ainda: instale o <b>VS Code</b>, que é grátis.</li>
        <li>Aperte <b>Ctrl+F</b> e procure por <code>&lt;h1</code>. Troque o título que está ali por outro.</li>
        <li>Salve e abra o arquivo de novo no navegador. Pronto: você mudou um site!</li>
      </ol>
      <p class="desafio"><b>Desafio:</b> procure por <code>--accent:</code> e troque a cor por outra, tipo <code>#FF0055</code>.
      No celular, dá para treinar direto no navegador com o <a href="https://codepen.io/pen/" target="_blank" rel="noopener">CodePen</a>.</p>
    </section>

    <section class="youtube">
      <h3>▶ Cursos grátis no YouTube</h3>
      <p>Em português, do zero, sem precisar de cadastro.</p>
      <div class="grade">${YOUTUBE.map(link).join('')}
      </div>
    </section>

    <section>
      <h3>Onde estudar de graça</h3>
      <p>Sites com aulas, exercícios e até certificado, sem pagar nada.</p>
      <div class="grade">${SITES.map(link).join('')}
      </div>
    </section>

    <section>
      <h3>Um caminho para começar</h3>
      <p>Uma ordem que funciona: primeiro o que existe, depois como aparece, depois o que faz.</p>
      <div class="caminho">${PATH.map((p) => `
        <div><b>${p.tag}</b><small>${p.when}</small><p>${p.text}</p></div>`).join('')}
      </div>
      <ul class="dicas">
        <li>⏱️ <b>20 minutos por dia</b> valem mais do que 5 horas no domingo.</li>
        <li>🐛 <b>Errou? Ótimo.</b> Todo programador erra o tempo todo. Leia a mensagem de erro com calma.</li>
        <li>🔧 <b>Copie, quebre e conserte:</b> mude um exemplo pronto até entender como ele funciona.</li>
      </ul>
    </section>

    <p class="aprenda-fim">De usuários → a criadores de tecnologia. ${theme?.emoji ?? '✨'}</p>
  </div>
</div>

<script>
/* ===== JavaScript = o que a página faz ===== */${script}
${theme ? `
  // Minha lista: o código monta os cartões dentro de [data-tipo]
${WIDGETS_JS.replace(/<\/script/gi, '<\\/script')}
  document.querySelectorAll('[data-tipo]').forEach(montarWidget);` : ''}
</script>
</body>
</html>
`
}

// Abre o site numa aba nova, funcionando de verdade (no celular, abrir o .html baixado
// pelo app de arquivos às vezes só mostra uma prévia, sem JavaScript).
// A aba é aberta antes (no clique) para o navegador não bloquear como pop-up.
export async function openSite(state: SiteState, tab: Window | null) {
  const html = await buildSiteHtml(state)
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }))
  if (tab) tab.location.href = url
  else window.location.href = url
}

export async function downloadSite(state: SiteState) {
  const html = await buildSiteHtml(state)
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `${slug(displayTitle(state))}.html`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}
