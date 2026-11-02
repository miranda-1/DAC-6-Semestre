# Do usuário ao criador

Protótipo para a oficina de extensão: a turma toma decisões e o site se transforma ao vivo, mostrando a relação **ESCOLHA → CÓDIGO → RESULTADO**.

## Como executar

Requer Node.js 18+.

```bash
npm install      # só na primeira vez (depois funciona offline)
npm run dev      # abre em http://localhost:5173
```

Versão final (opcional):

```bash
npm run build
npm run preview  # abre em http://localhost:4173
```

## Como usar na apresentação

1. **Antes de começar:** clique em **↺ Recomeçar oficina** (canto superior direito) para garantir o site "sem graça" inicial.
2. Clique em **▶ Modo apresentação** — entra em tela cheia, aumenta textos e o preview.
   - **→ / ←** avançam/voltam as etapas (ou os botões *Próximo / Anterior*).
   - **Esc** sai do modo apresentação.
3. Siga as etapas com a turma. Tudo muda na hora, sem botão de salvar:
   - **01 Tema** · **02 Título** → *HTML = o que existe na página*
   - **03 Cores** · **04 Fonte** · **05 Botão** → *CSS = como a página aparece*
   - **06 Ação** → *JavaScript = o que a página faz* (clique no botão do site para ver a mensagem)
4. Clique em **</> Ver código** no navegador do preview. A cada escolha, a aba certa (HTML/CSS/JavaScript) abre e a linha alterada **pisca por ~1 segundo**. Dica: deixe o código aberto a partir da etapa de cores.
5. Na etapa final, clique em **Ver transformação ✨** para mostrar ANTES → DEPOIS ("Vocês fizeram isso."). **↺ Rever** repete a animação.

6. Na tela final, **⬇ Baixar nosso site** gera um arquivo `.html` com o site da turma funcionando e, logo abaixo, uma página **Continue aprendendo** com o código da turma, como editar o arquivo, cursos grátis no YouTube e onde estudar HTML, CSS e JavaScript de graça.

## No celular

A ferramenta também funciona no celular: o site aparece em cima e as escolhas embaixo. Com o `npm run dev` rodando, os celulares na **mesma rede Wi-Fi** abrem o endereço `Network` que aparece no terminal (ex.: `http://192.168.0.10:5173`).

O estado fica salvo no navegador (localStorage): se a página recarregar, a criação da turma não se perde.
