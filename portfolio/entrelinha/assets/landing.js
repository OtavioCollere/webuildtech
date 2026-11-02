(function () {
  // Menu do celular
  var botao = document.querySelector('.topo__menu');
  var menu = document.getElementById('menu');
  if (botao && menu) {
    botao.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        menu.classList.remove('aberto');
        botao.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Comparadores de antes e depois: a linha acompanha o controle
  document.querySelectorAll('.comparador__imagens').forEach(function (caixa) {
    var controle = caixa.querySelector('.comparador__controle');
    controle.addEventListener('input', function () {
      caixa.style.setProperty('--pos', controle.value + '%');
    });
  });

  // Carrossel de antes e depois no celular
  var trilho = document.getElementById('comparadores');
  var barras = document.querySelectorAll('.paginacao__barras i');
  var proximo = document.querySelector('.paginacao__proximo');
  var nomes = ['Cílios e pele →', 'Pele →', 'Voltar ao início ←'];
  function passo() {
    var itens = trilho.children;
    return itens.length > 1 ? itens[1].offsetLeft - itens[0].offsetLeft : trilho.clientWidth;
  }
  function indiceAtual() {
    return Math.round(trilho.scrollLeft / passo());
  }
  function atualizar() {
    var i = Math.min(indiceAtual(), barras.length - 1);
    barras.forEach(function (b, n) { b.classList.toggle('ativo', n === i); });
    if (proximo) proximo.textContent = nomes[i];
  }
  if (trilho && barras.length) {
    trilho.addEventListener('scroll', function () { window.requestAnimationFrame(atualizar); }, { passive: true });
    if (proximo) {
      proximo.addEventListener('click', function () {
        var i = indiceAtual();
        var alvo = i >= barras.length - 1 ? 0 : i + 1;
        trilho.scrollTo({ left: alvo * passo(), behavior: 'smooth' });
      });
    }
  }

  // Dúvidas: uma aberta por vez
  var duvidas = document.querySelectorAll('.duvidas details');
  duvidas.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      duvidas.forEach(function (outra) { if (outra !== d) outra.open = false; });
    });
  });
})();
