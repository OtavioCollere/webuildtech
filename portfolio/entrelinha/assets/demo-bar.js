// No celular os links da barra rolam na horizontal: deixa o link ativo à vista.
(function () {
  var trilho = document.querySelector('.demo-bar__links');
  var ativo = trilho && trilho.querySelector('[aria-current="page"]');
  if (!trilho || !ativo || trilho.scrollWidth <= trilho.clientWidth) return;
  var inicio = ativo.getBoundingClientRect().left - trilho.getBoundingClientRect().left;
  trilho.scrollLeft = inicio - (trilho.clientWidth - ativo.offsetWidth) / 2;
})();
