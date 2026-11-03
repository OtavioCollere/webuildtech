/* Meio-Fio — conversa simulada no estilo do WhatsApp. Nada sai do navegador. */
(function () {
  'use strict';

  var fluxo = document.getElementById('fluxo');
  var conversa = document.getElementById('conversa');
  var estadoTopo = document.getElementById('chat-estado');

  var SERVICOS = [
    { id: 'degrade', nome: 'Corte degradê', preco: 'R$ 55' },
    { id: 'social', nome: 'Corte social', preco: 'R$ 50' },
    { id: 'barba', nome: 'Barba', preco: 'R$ 40' },
    { id: 'combo', nome: 'Corte + barba', preco: 'R$ 85' },
    { id: 'pigmentacao', nome: 'Pigmentação', preco: 'R$ 35' },
    { id: 'desenho', nome: 'Corte + desenho', preco: 'R$ 70' }
  ];
  var BARBEIROS = [
    { id: 'teco', nome: 'Teco', artigo: 'o' },
    { id: 'biel', nome: 'Biel', artigo: 'o' },
    { id: 'duda', nome: 'Duda', artigo: 'a' },
    { id: 'livre', nome: 'Tanto faz', artigo: '' }
  ];
  var DIAS = [
    { id: 'hoje', rotulo: 'Hoje (ter)', nome: 'hoje' },
    { id: 'amanha', rotulo: 'Amanhã (qua)', nome: 'quarta' },
    { id: 'qui', rotulo: 'Qui', nome: 'quinta' }
  ];
  var HORARIOS = {
    teco: { hoje: ['19h30', '20h15'], amanha: ['10h30', '14h', '15h30', '18h'], qui: ['11h', '16h', '18h'] },
    biel: { hoje: ['20h'], amanha: ['10h', '13h', '17h30', '19h'], qui: ['10h30', '15h'] },
    duda: { hoje: ['19h', '20h30'], amanha: ['11h', '14h30', '16h', '18h30'], qui: ['10h', '12h', '19h'] },
    livre: { hoje: ['19h', '19h30', '20h', '20h30'], amanha: ['10h', '10h30', '11h', '14h'], qui: ['10h', '10h30', '11h', '12h'] }
  };

  var params = new URLSearchParams(location.search);
  var auto = { servico: params.get('servico'), barbeiro: params.get('barbeiro') };
  var pedido = {};
  var minuto = 2;

  function hora() { return '19:' + String(minuto).padStart(2, '0'); }
  function avanca() { if (minuto < 59) minuto += 1; }
  function rola() { conversa.scrollTop = conversa.scrollHeight; }
  function el(tag, classe, html) { var n = document.createElement(tag); if (classe) n.className = classe; if (html != null) n.innerHTML = html; return n; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function barbeiro(id) { return BARBEIROS.filter(function (b) { return b.id === id; })[0]; }
  function servico(id) { return SERVICOS.filter(function (s) { return s.id === id; })[0]; }
  function dia(id) { return DIAS.filter(function (d) { return d.id === id; })[0]; }
  function comQuem() {
    var b = barbeiro(pedido.barbeiro);
    return pedido.barbeiro === 'livre' ? 'com o primeiro barbeiro livre' : 'com ' + b.artigo + ' ' + b.nome;
  }

  /* Bot digita e responde. opcoes: [{rotulo, valor, extra}], lista: botões em uma coluna. */
  function bot(texto, opcoes, aoEscolher, lista) {
    return new Promise(function (resolve) {
      estadoTopo.textContent = 'digitando…';
      var dig = el('div', 'digitando', '<i></i><i></i><i></i>');
      fluxo.appendChild(dig); rola();
      setTimeout(function () {
        dig.remove();
        estadoTopo.textContent = 'online';
        var bolha = el('div', 'msg msg--bot', '<span class="msg__texto">' + texto + '</span><span class="msg__hora">' + hora() + '</span>');
        if (!opcoes) { fluxo.appendChild(bolha); rola(); resolve(); return; }
        var grupo = el('div', 'msg-opcoes');
        grupo.appendChild(bolha);
        var caixa = el('div', 'opcoes' + (lista ? ' opcoes--lista' : ''));
        opcoes.forEach(function (o) {
          var b = el('button', 'opcao', esc(o.rotulo) + (o.extra ? '<span class="opcao__preco">' + esc(o.extra) + '</span>' : ''));
          b.type = 'button';
          b.addEventListener('click', function () {
            caixa.querySelectorAll('.opcao').forEach(function (x) { x.disabled = true; });
            b.classList.add('is-escolhida');
            eu(o.resposta || o.rotulo);
            setTimeout(function () { aoEscolher(o.valor); }, 450);
          });
          caixa.appendChild(b);
        });
        grupo.appendChild(caixa);
        fluxo.appendChild(grupo); rola();
        resolve(caixa);
      }, 750);
    });
  }

  function eu(texto) {
    var m = el('div', 'msg msg--eu', '<span class="msg__texto">' + esc(texto) + '</span><span class="msg__hora">' + hora() + ' <span class="msg__ticks">✓✓</span></span>');
    fluxo.appendChild(m); rola(); avanca();
  }

  /* Escolhe sozinho quando a landing mandou ?servico= ou ?barbeiro= */
  function autoEscolhe(caixa, valor) {
    if (!caixa || !valor) return false;
    var alvo = Array.prototype.filter.call(caixa.querySelectorAll('.opcao'), function (b) { return b.getAttribute('data-valor') === valor; })[0];
    if (!alvo) return false;
    setTimeout(function () { alvo.click(); }, 600);
    return true;
  }
  function marcaValores(caixa, opcoes) {
    if (!caixa) return caixa;
    caixa.querySelectorAll('.opcao').forEach(function (b, i) { b.setAttribute('data-valor', opcoes[i].valor); });
    return caixa;
  }

  /* ---------- Fluxo ---------- */

  function menu(texto) {
    var opcoes = [
      { rotulo: 'Agendar horário', valor: 'agendar' },
      { rotulo: 'Ver preços', valor: 'precos' },
      { rotulo: 'Endereço', valor: 'endereco' }
    ];
    return bot(texto, opcoes, function (v) {
      if (v === 'agendar') return passoServico();
      if (v === 'precos') {
        return bot('Corte degradê · R$ 55\nCorte social · R$ 50\nBarba · R$ 40\nCorte + barba · R$ 85\nPigmentação · R$ 35\nDesenho na navalha · + R$ 15')
          .then(function () { return menu('Quer marcar?'); });
      }
      return bot('Rua Trilho Velho, 410 · Rebouças, Curitiba.\nTer a sex, 10h às 21h · Sáb, 9h às 19h.')
        .then(function () { return menu('Posso marcar seu horário?'); });
    }).then(function (caixa) {
      marcaValores(caixa, opcoes);
      if (auto.servico || auto.barbeiro) { var c = caixa; auto.menu = true; autoEscolhe(c, 'agendar'); }
    });
  }

  function passoServico() {
    var opcoes = SERVICOS.map(function (s) { return { rotulo: s.nome, extra: s.preco, valor: s.id, resposta: s.nome + ' · ' + s.preco }; });
    return bot('Qual serviço?', opcoes, function (v) { pedido.servico = v; passoBarbeiro(); }, true)
      .then(function (caixa) {
        marcaValores(caixa, opcoes);
        if (auto.servico && autoEscolhe(caixa, auto.servico)) auto.servico = null;
      });
  }

  function passoBarbeiro() {
    var opcoes = BARBEIROS.map(function (b) { return { rotulo: b.nome, valor: b.id }; });
    return bot('Com quem?', opcoes, function (v) { pedido.barbeiro = v; passoDia(); })
      .then(function (caixa) {
        marcaValores(caixa, opcoes);
        if (auto.barbeiro && autoEscolhe(caixa, auto.barbeiro)) auto.barbeiro = null;
      });
  }

  function passoDia() {
    var opcoes = DIAS.map(function (d) { return { rotulo: d.rotulo, valor: d.id }; });
    return bot('Qual dia?', opcoes, function (v) { pedido.dia = v; passoHora(); });
  }

  function passoHora() {
    var d = dia(pedido.dia);
    var lista = HORARIOS[pedido.barbeiro][pedido.dia];
    var quem = pedido.barbeiro === 'livre' ? '' : ' com ' + barbeiro(pedido.barbeiro).artigo + ' ' + barbeiro(pedido.barbeiro).nome;
    var texto = 'Horários livres' + quem + (d.id === 'hoje' ? ' hoje:' : ' na ' + d.nome + ':');
    var opcoes = lista.map(function (h) { return { rotulo: h, valor: h }; });
    return bot(texto, opcoes, function (v) { pedido.hora = v; passoResumo(); });
  }

  function passoResumo() {
    var s = servico(pedido.servico) || SERVICOS[0];
    var d = dia(pedido.dia);
    var quando = d.id === 'hoje' ? 'hoje às ' + pedido.hora : d.nome + ' às ' + pedido.hora;
    var opcoes = [{ rotulo: 'Confirmar', valor: 'sim' }, { rotulo: 'Trocar horário', valor: 'nao' }];
    return bot(s.nome + ' ' + comQuem() + ', ' + quando + '. ' + s.preco + '. Confirma?', opcoes, function (v) {
      if (v === 'nao') return passoHora();
      passoFim();
    });
  }

  function passoFim() {
    var d = dia(pedido.dia);
    var lembrete = d.id === 'hoje' ? 'Te mando um lembrete uma hora antes.' : 'Te mando um lembrete na véspera.';
    bot('Fechado. ' + lembrete + '\nEndereço: Rua Trilho Velho, 410.').then(function () {
      setTimeout(function () {
        var card = el('div', 'msg-link',
          '<div class="msg-link__corpo"><span class="msg-link__titulo">O que roda depois da confirmação</span>' +
          '<span class="msg-link__desc">Lembrete, aviso de vez e convite pra voltar, no painel da casa.</span></div>' +
          '<a class="msg-link__acao" href="../bastidores/">Ver os bastidores →</a>');
        fluxo.appendChild(card); rola();
        var de = el('div', 'msg-opcoes');
        var caixa = el('div', 'opcoes opcoes--lista');
        var b = el('button', 'opcao', 'Recomeçar a demonstração');
        b.type = 'button';
        b.style.borderRadius = '8px';
        b.addEventListener('click', recomeca);
        caixa.appendChild(b); de.appendChild(caixa); fluxo.appendChild(de); rola();
      }, 500);
    });
  }

  function recomeca() {
    fluxo.innerHTML = '<span class="chat__data">Hoje</span>';
    pedido = {}; minuto = 2; auto = {};
    menu('Fala! Aqui é a Meio-Fio. Bora marcar seu horário?');
  }

  menu('Fala! Aqui é a Meio-Fio. Bora marcar seu horário?');
})();
