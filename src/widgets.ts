// O JavaScript da "Minha lista" do site da turma.
// É texto de propósito: o mesmo código roda dentro da ferramenta e vai junto no HTML baixado.
export const WIDGETS_JS = String.raw`
function criar(tag, classe, texto) {
  var el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto != null) el.textContent = texto;
  if (tag === 'button') el.type = 'button';
  return el;
}

function montarWidget(el) {
  var itens = JSON.parse(el.getAttribute('data-dados'));
  el.innerHTML = '';
  lista(el, itens);
}

// Minha lista: marque favoritos com estrela e filtre só os seus
function lista(el, itens) {
  var favoritos = [];
  var soMinhaLista = false;
  var topo = criar('div', 'w-topo');
  var contador = criar('span', 'w-contador');
  var filtro = criar('button', 'w-filtro');
  var grade = criar('div', 'w-grade');
  topo.append(contador, filtro);
  el.append(topo, grade);
  function mostrar() {
    grade.innerHTML = '';
    itens.forEach(function (item, i) {
      var favorito = favoritos.indexOf(i) >= 0;
      if (soMinhaLista && !favorito) return;
      var card = criar('div', 'w-card' + (favorito ? ' favorito' : ''));
      card.innerHTML = '<button type="button" class="w-estrela">★</button><strong></strong><span></span>';
      card.querySelector('strong').textContent = item.title;
      card.querySelector('span').textContent = item.text;
      card.querySelector('button').onclick = function () {
        if (favorito) favoritos.splice(favoritos.indexOf(i), 1);
        else favoritos.push(i);
        mostrar();
      };
      grade.append(card);
    });
    if (soMinhaLista && favoritos.length === 0) grade.append(criar('p', 'w-nota', 'Sua lista está vazia. Toque na ★ de um item!'));
    contador.textContent = '★ Minha lista: ' + favoritos.length;
    filtro.textContent = soMinhaLista ? 'Ver todos' : 'Ver só a minha lista';
  }
  filtro.onclick = function () { soMinhaLista = !soMinhaLista; mostrar(); };
  mostrar();
}
`

// Roda o código acima num elemento (usado dentro da ferramenta).
export const montarWidget = new Function('el', `${WIDGETS_JS}\nmontarWidget(el);`) as (el: HTMLElement) => void
