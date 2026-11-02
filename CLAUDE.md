# Do usuário ao criador — handoff

Protótipo para uma oficina de extensão universitária (alunos de Ciência da Computação → estudantes do ensino médio).
A turma toma decisões e o site se transforma ao vivo no telão, ensinando **ESCOLHA → CÓDIGO → RESULTADO**
(HTML = o que existe, CSS = como aparece, JavaScript = o que faz).

- Repositório: https://github.com/miranda-1/DAC-6-Semestre (público, branch `main`)
- Usuário fala português; responda em português.
- Status: funcional e testado (build ok, fluxo completo testado em Chromium headless sem erros de console).

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build — deve passar sem erros antes de qualquer commit
```

Stack: Vite 8, React 19, TypeScript 7, Tailwind CSS 4 (`@tailwindcss/vite`, config via `@theme` em `src/index.css`),
fontes locais via `@fontsource/*`. **Sem backend, sem API, sem serviços externos — precisa funcionar offline.**
Estado salvo em `localStorage` (chave `oficina-do-usuario-ao-criador`).

## Arquitetura

Um único estado `SiteState` no `App`; tudo o mais é função dele.

| Arquivo | Papel |
|---|---|
| `src/data.ts` | Tipos, `INITIAL_STATE`, opções (`THEMES`, `PALETTES`, `FONTS`, `BUTTONS`, `MESSAGES`) e helpers (`getTheme`, `getPalette`, `buttonStyle`, `slug`…). Textos/cores se mudam aqui. Cada paleta tem `accent2` (cor secundária: brilho da arte, borda dos cartões, ponto do selo). |
| `src/code.ts` | Gera o código **didático** (não é o código real) mostrado em "Ver código". Cada `CodeLine` tem `tags: ChangeKey[]`; linhas com a tag da última mudança piscam. `ART_HTML`/`artCss` descrevem a arte de cada tema. `LANG_OF` diz qual aba abrir por mudança. |
| `src/App.tsx` | Estado, `update(patch, key)` (aplica mudança + `flash` + troca aba), localStorage, modo apresentação (classe `presenting` no `<html>` → font-size 19px; Fullscreen API), teclado (←/→ só no modo apresentação e fora de inputs; Esc fecha camadas), reset com confirmação. |
| `src/components/ControlPanel.tsx` | `STEPS` (6 etapas: Tema, Título, Cores, Fonte, Botão, Ação) e um componente por etapa. `Card` é `div role="button"` (porque contém `<input>` na mensagem custom). |
| `src/components/SitePreview.tsx` | O site da turma. Cores via variáveis CSS (`--bg`, `--text`, `--accent`, `--accent2`, `--surface`, `--on-accent`, `--fs`). Sem tema = visual "HTML cru"; com tema = nav + hero + arte (`DecoArt`) + faixa animada + cartões + rodapé. Modal próprio com confete (nunca `window.alert`). Prop `interactive=false` no Antes/Depois e na exportação. |
| `src/components/CodePanel.tsx` | Abas HTML/CSS/JS, destaque (`key` inclui `flash.id` para reiniciar a animação), realce de sintaxe por regex, scroll até a linha destacada. |
| `src/components/BeforeAfter.tsx` | Tela "Vocês fizeram isso.": `SitePreview` com `INITIAL_STATE` vs estado atual, escalado (vertical no celular); fases via `setTimeout`; confete CSS; botão "Baixar nosso site". |
| `src/exportSite.tsx` | Gera o `.html` baixado: `renderToStaticMarkup(SitePreview)` + `site.css?raw` + JS puro do modal + página "Continue aprendendo" (código didático da turma, como editar o arquivo, cursos grátis no YouTube, sites para estudar, caminho de estudo). Carregado com `import()` só no clique (não pesa no carregamento). Links verificados em 31/10/2026. |
| `src/icons.tsx` | Ícones do site da turma (Lucide, os mesmos do shadcn/ui). `data.ts` guarda só o nome (`theme.logo`, `card.icon`); `<Icon name>` resolve. No código didático aparecem como `<img src="nome.svg">`. |
| Arte dos temas (escolhida com o usuário, uma de 5 versões cada) | Games: videogame portátil com jogo de blocos na tela + chão neon no fundo · Música: app de música (player) · Esportes: placar ao vivo · Filmes: claquete batendo · Espaço: astronauta flutuando. Tudo em `DecoArt` (`SitePreview.tsx`) + `site.css`, espelhado em `ART_HTML`/`artCss` (`code.ts`). |
| `src/site.css` | Estilos do site da turma, arte dos temas e keyframes. Deve usar só `var(--…)` para cor, para tema/cor/fonte ficarem independentes. Também é embutido no HTML exportado. O site se adapta pela largura do *container* (`@container site`), não da tela; esse bloco **fica no fim do arquivo** para vencer as regras base. |
| `src/index.css` | Estilos da ferramenta (`.btn-*`, `.choice`, `.chip`, `.code-line.flash`, `.tok-*`). |
| `Explicacao-do-codigo.pdf` | Guia detalhado (30 págs) para o aluno responder perguntas do professor. |

## Celular

Abaixo de `lg` (1024px) a ferramenta empilha: preview em cima (`44dvh`, `62dvh` com código aberto), escolhas no meio, anterior/próximo embaixo. Modo apresentação só no desktop. Efeitos de hover ficam em `@media (hover: hover)` (no toque eles "grudam"). Para as crianças acessarem pelo celular na mesma rede: `npm run dev` já usa `--host`; elas abrem o endereço "Network" que o Vite mostra.

**Celular:** abaixo de 1024px o `App` usa `MobileShell` (`MobileShells.tsx`, layout "abas embaixo", escolhido entre 5): site em cima, painel de opções que esconde e as 6 etapas numa barra no rodapé. Reaproveita `StepBody`/`CONCEPT` do `ControlPanel` e o `PreviewFrame` (navegador falso).

**Aparência da ferramenta:** "Caderno" (escolhida), em `src/skins.css` no seletor `html`: papel pautado com margem vermelha (`.bg-paper`), títulos em Caveat (só fora de `.site-root`), cantos tortinhos e fita adesiva nos cartões. A área do site (`.stage`) é uma mesa de madeira (lápis e régua na beirada, escondidos no celular) e o navegador é uma folha de caderno com espiral (`.frame-rings`, renderizado pelo `PreviewFrame`). Estilo cartum: `.choice`, `.chip`, `.btn-*` e `.sketch-field` (embrulho dos inputs) desenham contorno grosso, fundo e sombra num `::before` com `filter: url(#rabisco-forte)` (filtros SVG em `DoodleFilters`, renderizado uma vez no `App`), para o texto não tremer; cartões levemente tortos e inputs em Caveat. Os cartões de tema usam ícones rabiscados (`components/Doodle.tsx`: ícone Lucide com filtro SVG de traço tremido, segunda passada deslocada e marca-texto atrás; redesenha ao escolher). Animações de lápis em `components/Pencil.tsx` (`PencilCheck` no cartão escolhido, `PencilUnderline` no título da etapa) com keyframes em `index.css`. Elementos têm classes-gancho (`app-header`, `steps-nav`/`step-tab`, `step-footer`, `tabbar`/`tab-item`, `sheet`, `browser`/`browser-bar`/`browser-url`/`code-toggle`, `field`).

**Som:** `src/sound.ts` gera um som de lápis riscando com Web Audio (sem arquivo, funciona offline); toca ao escolher uma opção (`Card`) e ao sublinhar o título da etapa (`PencilUnderline`). Botão `SoundToggle` no cabeçalho liga/desliga (salvo em `localStorage`, chave `oficina-som`).

**Transformação (antes → depois):** `BeforeAfter.tsx` em fases: seta desenhada à mão → contorno do "depois" + camada de rascunho (`.sketch-layer`, cinza e hachurado com `backdrop-filter`) que some da esquerda para a direita com um lápis → título escrito à mão (`.write-in`) com "isso." circulado → cai papel de caderno, estrelinhas e raspas de lápis. CSS em `index.css`.

**Minha lista (os cartões do site):** os cartões viraram uma lista de favoritos (estrela + filtro "ver só a minha lista"). Itens por tema em `src/themeContent.ts`; o JavaScript é texto puro em `src/widgets.ts` (`WIDGETS_JS`), executado no app (`montarWidget`) e embutido no HTML baixado — mudar o comportamento é num lugar só. Cada tema dá um clima à seção em `site.css` (Games fliperama escuro, Música playlist, Esportes tabela, Filmes ingresso, Espaço céu estrelado).

## Regras ao mexer

- Ao mudar algo visual no `SitePreview`/`site.css`, **atualize também `code.ts`** para o código didático continuar refletindo o que aparece (o usuário já reclamou disso uma vez: a arte dos temas não aparecia no código).
- Código didático deve ser simples para quem nunca programou (HTML/CSS/JS puros, nomes em português).
- Design: fundo `#F4F4F3`, texto quase preto, accent `#6C4DFF`, bordas pretas finas, estilo editorial/terminal. Evitar cara de dashboard/SaaS, glassmorphism, excesso de gradiente.
- Não adicionar funcionalidades desnecessárias; prioridade é funcionar bem no projetor.
- Se o código mudar de forma relevante, o PDF fica desatualizado. Ele foi gerado a partir de um HTML (script Python + Chromium headless/puppeteer-core) que **não** está no repositório; para atualizar, regerar um HTML e imprimir com `chromium` (`page.pdf`).

## Git

- Commits em nome do usuário (identidade global do git já configurada). **Não** adicionar `Co-Authored-By` do Claude.
- A chave SSH tem senha e normalmente não está no agente → `git push` por SSH falha. Alternativas: o usuário roda `ssh-add ~/.ssh/id_ed25519`, ou push por HTTPS com o `gh` (logado como `miranda-1`):
  `git -c credential.helper= -c credential.helper='!gh auth git-credential' push https://github.com/miranda-1/DAC-6-Semestre.git main`
  (depois `git update-ref refs/remotes/origin/main HEAD` para o `origin/main` local ficar em dia).
