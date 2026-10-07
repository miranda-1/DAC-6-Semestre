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
| `src/data.ts` | Tipos, `INITIAL_STATE`, opções (`THEMES`, `PALETTES`, `FONTS`, `BUTTONS`, `MESSAGES`) e helpers (`getTheme`, `getPalette`, `buttonStyle`, `slug`…). Textos/cores se mudam aqui. |
| `src/code.ts` | Gera o código **didático** (não é o código real) mostrado em "Ver código". Cada `CodeLine` tem `tags: ChangeKey[]`; linhas com a tag da última mudança piscam. `ART_HTML`/`artCss` descrevem a arte de cada tema. `LANG_OF` diz qual aba abrir por mudança. |
| `src/App.tsx` | Estado, `update(patch, key)` (aplica mudança + `flash` + troca aba), localStorage, modo apresentação (classe `presenting` no `<html>` → font-size 19px; Fullscreen API), teclado (←/→ só no modo apresentação e fora de inputs; Esc fecha camadas), reset com confirmação. |
| `src/components/ControlPanel.tsx` | `STEPS` (6 etapas: Tema, Título, Cores, Fonte, Botão, Ação) e um componente por etapa. `Card` é `div role="button"` (porque contém `<input>` na mensagem custom). |
| `src/components/SitePreview.tsx` | O site da turma. Cores via variáveis CSS (`--bg`, `--text`, `--accent`, `--surface`, `--on-accent`, `--fs`). Sem tema = visual "HTML cru"; com tema = nav + hero + arte (`DecoArt`) + cartões. Modal próprio (nunca `window.alert`). Prop `interactive=false` no Antes/Depois. |
| `src/components/CodePanel.tsx` | Abas HTML/CSS/JS, destaque (`key` inclui `flash.id` para reiniciar a animação), realce de sintaxe por regex, scroll até a linha destacada. |
| `src/components/BeforeAfter.tsx` | Tela "Vocês fizeram isso.": `SitePreview` com `INITIAL_STATE` vs estado atual, escalado; fases via `setTimeout`; confete CSS. |
| `src/site.css` | Estilos do site da turma, arte dos temas e keyframes. Deve usar só `var(--…)` para cor, para tema/cor/fonte ficarem independentes. |
| `src/index.css` | Estilos da ferramenta (`.btn-*`, `.choice`, `.chip`, `.code-line.flash`, `.tok-*`). |
| `Explicacao-do-codigo.pdf` | Guia detalhado (30 págs) para o aluno responder perguntas do professor. |

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
