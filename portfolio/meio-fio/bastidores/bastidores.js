/* Meio-Fio — bastidores: simula, passo a passo, o que a automação dispara. */
(function () {
  'use strict';

  var passos = Array.prototype.slice.call(document.querySelectorAll('.passo'));
  var rodar = document.getElementById('rodar');
  var rodarTexto = document.getElementById('rodar-texto');
  var recomecar = document.getElementById('recomecar');

  var CHIP = {
    feito: '<span class="chip chip--feito"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFE600" stroke-width="3" stroke-linecap="square" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>Feito</span>',
    agora: '<span class="chip chip--agora"><i aria-hidden="true"></i>Agora</span>',
    agendado: '<span class="chip chip--agendado"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>Agendado</span>'
  };

  // Começa como na prancha: dois passos feitos e o terceiro rodando agora.
  var atual = 2;

  function pinta(animar) {
    passos.forEach(function (p, i) {
      var estado = i < atual ? 'feito' : (i === atual ? 'agora' : 'agendado');
      p.classList.remove('passo--feito', 'passo--agora', 'passo--agendado');
      p.classList.add('passo--' + estado);
      p.querySelector('.passo__status').innerHTML = CHIP[estado];
      if (animar && i === atual) chega(p);
    });
    rodarTexto.textContent = atual >= passos.length ? 'Rodar de novo' : 'Rodar próximo passo';
  }

  function chega(passo) {
    var bolha = passo.querySelector('.passo__bolha');
    var dig = document.createElement('div');
    dig.className = 'digitando';
    dig.innerHTML = '<i></i><i></i><i></i>';
    bolha.style.display = 'none';
    bolha.parentNode.insertBefore(dig, bolha);
    setTimeout(function () {
      dig.remove();
      bolha.style.display = '';
      bolha.classList.remove('is-chegando');
      void bolha.offsetWidth;
      bolha.classList.add('is-chegando');
    }, 700);
  }

  rodar.addEventListener('click', function () {
    if (atual >= passos.length) { atual = 0; } else { atual += 1; }
    pinta(true);
  });
  recomecar.addEventListener('click', function () { atual = 0; pinta(true); });

  pinta(false);
})();
