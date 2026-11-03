// No celular, os links da barra rolam na horizontal: deixa o link ativo à vista.
(function () {
  var links = document.querySelector(".demo-bar__links");
  var ativo = links && links.querySelector('[aria-current="page"]');
  if (!links || !ativo || links.scrollWidth <= links.clientWidth) return;
  var alvo = ativo.offsetLeft - (links.clientWidth - ativo.offsetWidth) / 2;
  links.scrollLeft = Math.max(0, alvo);
})();
