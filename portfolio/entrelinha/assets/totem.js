(function () {
  var tela = document.getElementById('tela');
  var raiz = document.documentElement;

  // ---------- Escala da moldura no desktop ----------
  function ajustarEscala() {
    if (window.innerWidth <= 760) { raiz.style.removeProperty('--escala'); return; }
    var altura = window.innerHeight - 40 - 64 - 46 - 28;
    var largura = Math.min(520, window.innerWidth - 2 * 80 - 40) - 28;
    var escala = Math.max(0.24, Math.min(altura / 1920, largura / 1080));
    raiz.style.setProperty('--escala', escala.toFixed(4));
  }
  ajustarEscala();
  window.addEventListener('resize', ajustarEscala);

  // ---------- Agenda de hoje (fictícia) ----------
  var agenda = [
    { nome: 'Camila S.', hora: '14h30', proc: 'Extensão de cílios fio a fio', prof: 'Marina', profCompleto: 'Marina Okada', tempo: '2 h', preco: 'R$ 230', tipo: 'cilios' },
    { nome: 'Débora L.', hora: '14h30', proc: 'Design com henna', prof: 'Lívia', profCompleto: 'Lívia Prado', tempo: '50 min', preco: 'R$ 85', tipo: 'sobrancelha' },
    { nome: 'Fernanda A.', hora: '15h', proc: 'Limpeza de pele', prof: 'Teresa', profCompleto: 'Teresa Vidal', tempo: '1h20', preco: 'R$ 190', tipo: 'pele' },
    { nome: 'Helena T.', hora: '15h30', proc: 'Brow lamination', prof: 'Joana', profCompleto: 'Joana Reis', tempo: '1 h', preco: 'R$ 150', tipo: 'sobrancelha' }
  ];
  var atual = agenda[0];
  var origem = 'telefone';
  var timer = null;

  // ---------- Navegação entre telas ----------
  function mostrar(nome) {
    clearTimeout(timer);
    tela.querySelectorAll('.t-passo').forEach(function (p) {
      p.classList.toggle('ativo', p.dataset.tela === nome);
    });
    tela.scrollTop = 0;
    if (nome === 'pronto') contagem(nome, 10);
    if (nome === 'recepcao') contagem(nome, 8);
    var foco = tela.querySelector('.t-passo.ativo h2');
    if (foco) { foco.setAttribute('tabindex', '-1'); foco.focus({ preventScroll: true }); }
  }

  function contagem(nome, segundos) {
    var passo = tela.querySelector('[data-tela="' + nome + '"]');
    var alvo = passo.querySelector('[data-contagem]');
    passo.style.setProperty('--duracao', segundos + 's');
    var resta = segundos;
    alvo.textContent = resta;
    (function tick() {
      timer = setTimeout(function () {
        resta -= 1;
        if (resta <= 0) { recomecar(); return; }
        alvo.textContent = resta;
        tick();
      }, 1000);
    })();
  }

  function preencher() {
    var dados = {
      quando: 'Hoje · ' + atual.hora, proc: atual.proc, 'prof-completo': atual.profCompleto,
      tempo: atual.tempo, preco: atual.preco, prof: atual.prof, hora: atual.hora
    };
    tela.querySelectorAll('[data-campo]').forEach(function (el) {
      var v = dados[el.dataset.campo];
      if (v) el.textContent = v;
    });
  }

  function recomecar() {
    numero = '';
    desenharNumero();
    limparFicha();
    atual = agenda[0];
    preencher();
    mostrar('inicio');
  }

  tela.addEventListener('click', function (e) {
    var botao = e.target.closest('[data-ir]');
    if (!botao) return;
    var destino = botao.dataset.ir;
    if (destino === 'voltar-busca') destino = origem;
    if (destino === 'telefone' || destino === 'nome') origem = destino;
    if (destino === 'ficha') prepararFicha();
    mostrar(destino);
  });
  document.querySelectorAll('[data-acao="recomecar"]').forEach(function (b) { b.addEventListener('click', recomecar); });

  // ---------- Telefone ----------
  var numero = '';
  var saida = document.getElementById('telefone-valor');
  var buscar = document.getElementById('buscar');
  function desenharNumero() {
    var d = (numero + '___________').slice(0, 11).split('');
    saida.textContent = '(' + d[0] + d[1] + ') ' + d[2] + ' ' + d.slice(3, 7).join('') + '-' + d.slice(7, 11).join('');
    buscar.disabled = numero.length < 11;
  }
  tela.querySelector('.t-teclado').addEventListener('click', function (e) {
    var t = e.target.closest('[data-tecla]');
    if (!t) return;
    var k = t.dataset.tecla;
    if (k === 'limpar') numero = '';
    else if (k === 'apagar') numero = numero.slice(0, -1);
    else if (numero.length < 11) numero += k;
    desenharNumero();
  });
  document.addEventListener('keydown', function (e) {
    if (!tela.querySelector('[data-tela="telefone"].ativo')) return;
    if (/^[0-9]$/.test(e.key) && numero.length < 11) { numero += e.key; desenharNumero(); }
    else if (e.key === 'Backspace') { numero = numero.slice(0, -1); desenharNumero(); }
    else if (e.key === 'Enter' && !buscar.disabled) buscar.click();
  });
  buscar.addEventListener('click', function () {
    atual = agenda[0];
    preencher();
    mostrar('confirmacao');
  });

  // ---------- Nome ----------
  var lista = document.getElementById('lista-hoje');
  agenda.forEach(function (item, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = '<span class="t-lista__nome"></span><span class="t-lista__hora"></span><span class="t-lista__proc"></span>';
    b.children[0].textContent = item.nome;
    b.children[1].textContent = item.hora;
    b.children[2].textContent = item.proc + ' · com a ' + item.prof;
    b.addEventListener('click', function () {
      atual = agenda[i];
      preencher();
      mostrar('confirmacao');
    });
    lista.appendChild(b);
  });

  // ---------- Ficha rápida ----------
  var concluir = document.getElementById('concluir');
  var perguntas = tela.querySelectorAll('.t-pergunta');
  function limparFicha() {
    tela.querySelectorAll('.t-chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
    concluir.disabled = true;
  }
  function prepararFicha() {
    tela.querySelector('[data-pergunta="lente"]').hidden = atual.tipo !== 'cilios';
    validar();
  }
  function validar() {
    var ok = true;
    perguntas.forEach(function (p) {
      if (p.hidden) return;
      if (!p.querySelector('[aria-pressed="true"]')) ok = false;
    });
    concluir.disabled = !ok;
  }
  perguntas.forEach(function (p) {
    var multipla = p.hasAttribute('data-multipla');
    p.addEventListener('click', function (e) {
      var chip = e.target.closest('.t-chip');
      if (!chip) return;
      var ligado = chip.getAttribute('aria-pressed') === 'true';
      if (!multipla) {
        p.querySelectorAll('.t-chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        chip.setAttribute('aria-pressed', 'true');
      } else if (chip.dataset.valor === 'nenhuma') {
        p.querySelectorAll('.t-chip').forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
      } else {
        p.querySelector('[data-valor="nenhuma"]').setAttribute('aria-pressed', 'false');
        chip.setAttribute('aria-pressed', ligado ? 'false' : 'true');
      }
      validar();
    });
  });
  concluir.addEventListener('click', function () {
    var avisos = document.getElementById('avisos');
    avisos.innerHTML = '';
    var alergias = Array.prototype.map.call(
      tela.querySelectorAll('[data-pergunta="alergia"] [aria-pressed="true"]'),
      function (c) { return c.dataset.valor; }
    ).filter(function (v) { return v !== 'nenhuma'; });
    var linhas = [];
    if (alergias.length) linhas.push('A ' + atual.prof + ' já viu a sua ficha e conversa com você sobre a alergia antes de começar.');
    if (atual.tipo === 'cilios') linhas.push('Se estiver de rímel, o demaquilante está no lavabo.');
    if (atual.tipo === 'pele') linhas.push('Se estiver maquiada, o demaquilante está no lavabo.');
    linhas.forEach(function (t) { var s = document.createElement('span'); s.textContent = t; avisos.appendChild(s); });
    var cha = document.createElement('span');
    cha.className = 'it';
    cha.textContent = 'Água, café e chá ao lado do espelho.';
    avisos.appendChild(cha);
    mostrar('pronto');
  });

  desenharNumero();
  preencher();
})();
