/* Meio-Fio — totem de check-in (demonstração, tudo simulado no navegador). */
(function () {
  'use strict';

  var totem = document.getElementById('totem');
  var moldura = document.getElementById('moldura');

  var SERVICOS = [
    { id: 'degrade', nome: 'Corte degradê', desc: 'Máquina, tesoura e navalha · 45 min', preco: 'R$ 55' },
    { id: 'social', nome: 'Corte social', desc: 'Tesoura, sem degradê · 40 min', preco: 'R$ 50' },
    { id: 'barba', nome: 'Barba', desc: 'Toalha quente e navalha · 30 min', preco: 'R$ 40' },
    { id: 'combo', nome: 'Corte + barba', desc: 'Degradê ou social + barba · 1h15', preco: 'R$ 85' },
    { id: 'pigmentacao', nome: 'Pigmentação', desc: 'Barba ou cabelo · 30 min', preco: 'R$ 35' },
    { id: 'desenho', nome: 'Desenho na navalha', desc: 'Junto com o corte · +15 min', preco: '+ R$ 15' }
  ];

  /* Fila de cada barbeiro antes de você entrar (o 1º está na cadeira). */
  var BARBEIROS = {
    teco: { nome: 'Teco', foto: '../assets/teco.jpg', espera: 25, fila: [['Rafael S.', 'Na cadeira'], ['Marcos T.', 'Corte + barba']] },
    biel: { nome: 'Biel', foto: '../assets/biel.jpg', espera: 40, fila: [['Paulo R.', 'Na cadeira'], ['Diego A.', 'Barba'], ['Caio M.', 'Corte social']] },
    duda: { nome: 'Duda', foto: '../assets/duda.jpg', espera: 15, fila: [['Ana L.', 'Na cadeira']] }
  };

  var ICONE = {
    seta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
    voltar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" aria-hidden="true"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>',
    apagar: '<svg viewBox="0 0 24 24" fill="none" stroke="#F2F2EE" stroke-width="2" stroke-linecap="square" aria-hidden="true"><path d="M10 5h11v14H10l-7-7z"/><path d="m18 9-6 6"/><path d="m12 9 6 6"/></svg>',
    raio: '<svg viewBox="0 0 24 24" fill="none" stroke="#F2F2EE" stroke-width="1.5" stroke-linecap="square" aria-hidden="true"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="#0B0B0C" stroke-width="3" stroke-linecap="square" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="#F2F2EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>'
  };

  var LOGO = '<span class="t-logo" aria-label="Meio-Fio"><span>Meio</span><i></i><span>Fio</span></span>';
  var DEMO_TEL = '88123456';

  var estado = { tela: 'inicio', fluxo: null, servico: null, barbeiro: null, digitos: '' };
  var timer = null;

  function topo(rotulo) {
    return '<header class="t-topo">' + LOGO + '<span class="t-topo__rotulo">' + rotulo + '</span></header>';
  }
  function rodape(direita, voltarPara) {
    return '<footer class="t-rodape">' +
      '<button class="t-voltar" data-acao="voltar" data-para="' + voltarPara + '">' + ICONE.voltar + 'Voltar</button>' +
      (direita || '') + '</footer>';
  }
  function info(texto) { return '<span class="t-rodape__info">' + texto + '</span>'; }
  function pergunta(passo, titulo, sub) {
    return '<div class="t-pergunta"><span class="t-rotulo t-passo">' + passo + '</span>' +
      '<h1 class="t-h1">' + titulo + '</h1>' + (sub ? '<p class="t-sub">' + sub + '</p>' : '') + '</div>';
  }
  function ordinal(n) { return n + 'º'; }

  /* ---------- Telas ---------- */

  var telas = {
    inicio: function () {
      return '<div class="t-tela t-inicio">' +
        '<img class="t-inicio__foto" src="../assets/hero.jpg" alt="">' +
        '<div class="t-inicio__degrade"></div>' +
        '<header class="t-topo">' + LOGO + '<span class="t-topo__rotulo">Check-in</span></header>' +
        '<div class="t-inicio__conteudo">' +
          '<h1 class="t-inicio__titulo">Chegou?<br>Faz o<br>check-in.</h1>' +
          '<div class="t-botoes">' +
            '<button class="t-botao t-botao--amarelo" data-acao="ir" data-para="telefone"><span class="t-botao__textos"><span class="t-botao__titulo">Tenho horário</span><span class="t-botao__sub">Busco pelo seu telefone</span></span>' + ICONE.seta + '</button>' +
            '<button class="t-botao t-botao--escuro" data-acao="ir" data-para="servico"><span class="t-botao__textos"><span class="t-botao__titulo">Sem horário</span><span class="t-botao__sub">Entro na fila agora</span></span>' + ICONE.seta + '</button>' +
          '</div>' +
        '</div>' +
        '<footer class="t-fila-rodape"><span class="t-fila-rodape__status"><span class="t-ponto"></span>Fila agora · 2 na frente · uns 20 min</span><span class="t-fila-rodape__dica">Toque para começar</span></footer>' +
      '</div>';
    },

    telefone: function () {
      var aviso = estado.fluxo === 'sem';
      return '<div class="t-tela">' +
        topo(aviso ? 'Check-in · Sem horário' : 'Check-in · Tenho horário') +
        (aviso
          ? pergunta('Passo 3 de 3', 'Pra te avisar<br>no WhatsApp', 'Quando faltar um cliente, a gente te chama. Se preferir, pule.')
          : pergunta('Passo 1 de 2', 'Qual o seu<br>telefone?', 'O mesmo que você usou pra marcar no WhatsApp.')) +
        '<div class="t-campo"><div class="t-campo__linha" id="campo" aria-live="polite"></div></div>' +
        '<div class="t-teclado">' +
          [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (n) { return '<button class="t-tecla" data-acao="digito" data-valor="' + n + '">' + n + '</button>'; }).join('') +
          '<button class="t-tecla t-tecla--apagar" data-acao="apagar" aria-label="Apagar">' + ICONE.apagar + '</button>' +
          '<button class="t-tecla" data-acao="digito" data-valor="0">0</button>' +
          '<button class="t-tecla t-tecla--ok" data-acao="buscar">' + (aviso ? 'Entrar' : 'Buscar') + '</button>' +
        '</div>' +
        rodape(aviso ? '<button class="t-pular" data-acao="pular">Pular</button>' : info('Seu número só serve pra achar o horário.'), aviso ? 'barbeiro' : 'inicio') +
      '</div>';
    },

    achei: function () {
      return '<div class="t-tela">' +
        topo('Check-in · Tenho horário') +
        pergunta('Passo 2 de 2', 'Achei seu<br>horário.', 'Confere e confirma a chegada.') +
        '<div class="t-achei">' +
          '<div class="t-achei__card"><span class="t-achei__servico">Corte degradê</span><span class="t-achei__det">Hoje, 15h30 · com o Teco · R$ 55</span></div>' +
          '<div class="t-achei__acoes">' +
            '<button class="t-achei__btn t-achei__btn--sim" data-acao="chegada">Confirmar chegada</button>' +
            '<button class="t-achei__btn t-achei__btn--nao" data-acao="ir" data-para="telefone">Não sou eu</button>' +
          '</div>' +
        '</div>' +
        rodape(info('Fila do Teco: 1 na cadeira'), 'telefone') +
      '</div>';
    },

    servico: function () {
      return '<div class="t-tela">' +
        topo('Check-in · Sem horário') +
        pergunta('Passo 1 de 3', 'O que vai<br>ser hoje?', 'Toque no serviço. O preço é o da tabela da parede.') +
        '<div class="t-lista">' +
          SERVICOS.map(function (s) {
            return '<button class="t-opcao' + (estado.servico === s.id ? ' is-escolhida' : '') + '" data-acao="servico" data-valor="' + s.id + '">' +
              '<span class="t-opcao__textos"><span class="t-opcao__nome">' + s.nome + '</span><span class="t-opcao__desc">' + s.desc + '</span></span>' +
              '<span class="t-opcao__preco">' + s.preco + '</span>' + ICONE.chevron + '</button>';
          }).join('') +
        '</div>' +
        rodape(info('Fila agora: 2 na frente · uns 20 min'), 'inicio') +
      '</div>';
    },

    barbeiro: function () {
      var s = servicoAtual();
      var card = function (id) {
        var b = BARBEIROS[id];
        return '<button class="t-card' + (estado.barbeiro === id ? ' is-escolhido' : '') + '" data-acao="barbeiro" data-valor="' + id + '">' +
          '<img class="t-card__foto" src="' + b.foto + '" alt="">' +
          '<span class="t-card__info"><span class="t-card__nome">' + b.nome + '</span><span class="t-card__espera">uns ' + b.espera + ' min</span></span></button>';
      };
      return '<div class="t-tela">' +
        topo('Check-in · Sem horário') +
        pergunta('Passo 2 de 3', 'Com quem?', s.nome + ' · ' + s.preco + '. O tempo é a espera de cada um agora.') +
        '<div class="t-grade">' + card('teco') + card('biel') + card('duda') +
          '<button class="t-card t-card--livre' + (estado.barbeiro === 'livre' ? ' is-escolhido' : '') + '" data-acao="barbeiro" data-valor="livre">' +
            '<span class="t-selo">Mais rápido</span>' + ICONE.raio +
            '<span class="t-card__info"><span class="t-card__nome">Primeiro<br>livre</span><span class="t-card__espera">uns ' + BARBEIROS.duda.espera + ' min</span></span>' +
          '</button>' +
        '</div>' +
        rodape(info('Fila agora: 2 na frente · uns 20 min'), 'servico') +
      '</div>';
    },

    fila: function () {
      var agendado = estado.fluxo === 'com';
      var id = agendado ? 'teco' : (estado.barbeiro === 'livre' ? 'duda' : estado.barbeiro);
      var b = BARBEIROS[id];
      var s = servicoAtual();
      var fila = agendado ? [['Rafael S.', 'Na cadeira']] : b.fila;
      var pos = fila.length + 1;
      var minutos = agendado ? 5 : b.espera;
      var itens = fila.map(function (p, i) {
        var cadeira = p[1] === 'Na cadeira';
        return '<li class="t-fila__item"><span class="t-fila__num">' + ordinal(i + 1) + '</span><span class="t-fila__nome">' + p[0] + '</span>' +
          '<span class="t-fila__status' + (cadeira ? ' t-fila__status--cadeira' : '') + '">' + p[1] + '</span></li>';
      }).join('') +
        '<li class="t-fila__item t-fila__item--voce"><span class="t-fila__num">' + ordinal(pos) + '</span><span class="t-fila__nome">Você</span><span class="t-fila__status">' + s.nome + '</span></li>';

      return '<div class="t-tela">' +
        topo('Check-in feito') +
        '<div class="t-posicao">' +
          '<span class="t-ok"><span class="t-ok__caixa">' + ICONE.check + '</span><span class="t-rotulo">Check-in feito · ' + s.nome + ' com ' + (id === 'duda' ? 'a' : 'o') + ' ' + b.nome + '</span></span>' +
          '<h1 class="t-h1 t-posicao__h1">Você é o</h1>' +
          '<div class="t-posicao__linha"><span class="t-posicao__num">' + ordinal(pos) + '</span>' +
            '<span class="t-posicao__tempo"><span class="t-posicao__min">Uns ' + minutos + ' min</span><span class="t-posicao__quem">na fila ' + (id === 'duda' ? 'da' : 'do') + ' ' + b.nome + '</span></span></div>' +
        '</div>' +
        '<div class="t-fila">' +
          '<span class="t-fila__titulo t-rotulo"><span class="t-ponto"></span>Fila ao vivo</span>' +
          '<ol class="t-fila__lista">' + itens + '</ol>' +
          '<div class="t-aviso">' + ICONE.chat + '<p>' + (estado.digitos || agendado ? 'Quando faltar um, o WhatsApp te chama.' : 'Fica de olho na tela: seu nome sobe a cada corte.') + '<br><span>' + (estado.digitos || agendado ? 'Pode tomar um café.' : 'Pra ser avisado no WhatsApp, deixe o telefone na próxima vez.') + '</span></p></div>' +
        '</div>' +
        '<footer class="t-rodape"><div class="t-progresso" id="progresso"></div>' +
          '<span class="t-rodape__info t-rodape__info--esq" id="contagem">Esta tela volta ao início em 10 s</span>' +
          '<button class="t-pronto" data-acao="ir" data-para="inicio">Pronto</button></footer>' +
      '</div>';
    }
  };

  function servicoAtual() {
    return SERVICOS.filter(function (s) { return s.id === estado.servico; })[0] || SERVICOS[0];
  }

  /* ---------- Render ---------- */

  function render() {
    clearInterval(timer);
    totem.innerHTML = telas[estado.tela]();
    if (estado.tela === 'telefone') atualizaCampo();
    if (estado.tela === 'fila') iniciaContagem();
  }

  function ir(tela) {
    if (tela === 'inicio') { estado.fluxo = null; estado.servico = null; estado.barbeiro = null; estado.digitos = ''; }
    if (tela === 'telefone' && estado.tela === 'inicio') { estado.fluxo = 'com'; estado.digitos = ''; }
    if (tela === 'servico' && estado.tela === 'inicio') { estado.fluxo = 'sem'; }
    estado.tela = tela;
    render();
  }

  function atualizaCampo() {
    var campo = document.getElementById('campo');
    if (!campo) return;
    var d = estado.digitos;
    var mascara = '____-____';
    var digitado = '', resto = '', i = 0, j;
    for (j = 0; j < mascara.length; j++) {
      if (mascara[j] === '-') {
        if (i < d.length) digitado += '-'; else resto += '-';
        continue;
      }
      if (i < d.length) { digitado += d[i]; i++; } else { resto += '_'; }
    }
    campo.innerHTML = '<span>(41) 9 ' + digitado + '</span><span class="t-cursor"></span><span class="t-campo__resto">' + resto + '</span>';
  }

  function iniciaContagem() {
    var restante = 10;
    var barra = document.getElementById('progresso');
    var texto = document.getElementById('contagem');
    requestAnimationFrame(function () {
      barra.style.transition = 'width 10s linear';
      barra.style.width = '100%';
    });
    timer = setInterval(function () {
      restante -= 1;
      if (restante <= 0) { clearInterval(timer); ir('inicio'); return; }
      texto.textContent = 'Esta tela volta ao início em ' + restante + ' s';
    }, 1000);
  }

  /* ---------- Interação ---------- */

  totem.addEventListener('click', function (ev) {
    var alvo = ev.target.closest('[data-acao]');
    if (!alvo) return;
    var acao = alvo.getAttribute('data-acao');
    var valor = alvo.getAttribute('data-valor');

    if (acao === 'ir' || acao === 'voltar') {
      var para = alvo.getAttribute('data-para');
      if (acao === 'voltar' && para === 'barbeiro') estado.digitos = '';
      ir(para);
    } else if (acao === 'digito') {
      if (estado.digitos.length < 8) { estado.digitos += valor; atualizaCampo(); }
    } else if (acao === 'apagar') {
      estado.digitos = estado.digitos.slice(0, -1); atualizaCampo();
    } else if (acao === 'buscar') {
      // Demonstração: completa o número para não travar quem está só testando.
      if (estado.digitos.length < 8) estado.digitos = (estado.digitos + DEMO_TEL.slice(estado.digitos.length)).slice(0, 8);
      atualizaCampo();
      setTimeout(function () { ir(estado.fluxo === 'sem' ? 'fila' : 'achei'); }, 350);
    } else if (acao === 'pular') {
      estado.digitos = '';
      ir('fila');
    } else if (acao === 'chegada') {
      estado.servico = 'degrade';
      ir('fila');
    } else if (acao === 'servico') {
      estado.servico = valor;
      marca(alvo, 'is-escolhida', '.t-opcao');
      setTimeout(function () { ir('barbeiro'); }, 280);
    } else if (acao === 'barbeiro') {
      estado.barbeiro = valor;
      marca(alvo, 'is-escolhido', '.t-card');
      setTimeout(function () { estado.digitos = ''; ir('telefone'); }, 280);
    }
  });

  function marca(el, classe, seletor) {
    totem.querySelectorAll(seletor).forEach(function (n) { n.classList.remove(classe); });
    el.classList.add(classe);
  }

  document.addEventListener('keydown', function (ev) {
    if (estado.tela !== 'telefone') return;
    if (/^[0-9]$/.test(ev.key) && estado.digitos.length < 8) { estado.digitos += ev.key; atualizaCampo(); }
    else if (ev.key === 'Backspace') { estado.digitos = estado.digitos.slice(0, -1); atualizaCampo(); }
    else if (ev.key === 'Enter') { var ok = totem.querySelector('[data-acao="buscar"]'); if (ok) ok.click(); }
  });

  /* ---------- Escala da moldura (desktop) ---------- */

  function ajustaEscala() {
    if (window.innerWidth <= 900) return;
    var disponivel = window.innerHeight - 40 - 48 - 36;
    var s = Math.max(0.3, Math.min(disponivel / 1920, 0.6));
    moldura.style.setProperty('--s', s.toFixed(4));
  }
  window.addEventListener('resize', ajustaEscala);
  ajustaEscala();

  render();
})();
