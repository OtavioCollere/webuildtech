// Abas do cardápio (Lanches, Acompanhamentos, Bebidas, Combos).
(function () {
  var abas = Array.prototype.slice.call(document.querySelectorAll(".aba"));
  var paineis = document.querySelectorAll(".painel-aba");
  if (!abas.length) return;

  function ativar(aba, focar) {
    abas.forEach(function (a) {
      var ativa = a === aba;
      a.classList.toggle("is-ativa", ativa);
      a.setAttribute("aria-selected", ativa ? "true" : "false");
      a.tabIndex = ativa ? 0 : -1;
    });
    paineis.forEach(function (p) { p.hidden = p.dataset.painel !== aba.dataset.aba; });
    if (focar) aba.focus();
  }

  abas.forEach(function (aba, i) {
    aba.tabIndex = aba.classList.contains("is-ativa") ? 0 : -1;
    aba.addEventListener("click", function () { ativar(aba, false); });
    aba.addEventListener("keydown", function (e) {
      var passo = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!passo) return;
      e.preventDefault();
      ativar(abas[(i + passo + abas.length) % abas.length], true);
    });
  });
})();
