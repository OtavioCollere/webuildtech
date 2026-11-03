// Conversa simulada: nada é enviado. O "bot" responde a partir dos botões.
(function () {
  var conversa = document.getElementById('conversa');
  var status = document.getElementById('status');

  var PROCS = {
    design:     { nome: 'Design de sobrancelha', curto: 'Design de sobrancelha', tempo: '40\u00a0min', preco: 'R$ 65', area: 'sobrancelha', profs: ['Lívia', 'Joana'], prep: 'Venha sem maquiagem na sobrancelha.' },
    henna:      { nome: 'Design com henna', curto: 'Design com henna', tempo: '50\u00a0min', preco: 'R$ 85', area: 'sobrancelha', profs: ['Lívia', 'Joana'], prep: 'Venha sem maquiagem na sobrancelha. Se for a primeira henna, a gente faz o teste de toque antes.' },
    lamination: { nome: 'Brow lamination', curto: 'Brow lamination', tempo: '1\u00a0h', preco: 'R$ 150', area: 'sobrancelha', profs: ['Lívia', 'Joana'], prep: 'Venha sem maquiagem na sobrancelha.' },
    lifting:    { nome: 'Lash lifting', curto: 'Lash lifting', tempo: '1\u00a0h', preco: 'R$ 160', area: 'cilios', profs: ['Marina', 'Joana'], prep: 'Venha sem rímel e, se usar lente, traga o estojo.' },
    extensao:   { nome: 'Extensão de cílios fio a fio', curto: 'Extensão fio a fio', tempo: '2\u00a0h', preco: 'R$ 230', area: 'cilios', profs: ['Marina', 'Joana'], prep: 'Venha sem rímel e, se usar lente, traga o estojo.' },
    limpeza:    { nome: 'Limpeza de pele', curto: 'Limpeza de pele', tempo: '1h20', preco: 'R$ 190', area: 'pele', profs: ['Teresa'], prep: 'Venha sem maquiagem.' }
  };
  var PROFS = {
    livia: { nome: 'Lívia', procs: ['design', 'henna', 'lamination'] },
    marina: { nome: 'Marina', procs: ['lifting', 'extensao'] },
    joana: { nome: 'Joana', procs: ['lifting', 'extensao', 'design', 'lamination'] },
    teresa: { nome: 'Teresa', procs: ['limpeza'] }
  };
  var CUIDADOS = {
    sobrancelha: { titulo: 'Sobrancelha', texto: '• Venha sem maquiagem na sobrancelha.\n• Depois da henna, não molhe nem passe produto nas primeiras 24 h.\n• Na brow lamination, penteie os fios para cima todo dia.\n• O design dura de 15 a 20 dias.', proc: 'design' },
    lifting: { titulo: 'Lash lifting', texto: '• Venha sem rímel e, se usar lente, traga o estojo.\n• Nas primeiras 24 h, não molhe os cílios nem use rímel.\n• O lifting dura de 6 a 8 semanas.', proc: 'lifting' },
    extensao: { titulo: 'Extensão de cílios fio a fio', texto: '• Venha sem rímel e, se usar lente, traga o estojo.\n• Nas primeiras 24 h, não molhe os fios e fuja de vapor e sauna.\n• Depois, penteie com a escovinha todo dia.\n• A manutenção é em 21 dias.', proc: 'extensao' },
    limpeza: { titulo: 'Limpeza de pele', texto: '• Venha sem maquiagem.\n• Nas primeiras 48 h, use protetor solar e evite ácidos e esfoliantes.\n• O ideal é repetir a cada 30 a 45 dias.', proc: 'limpeza' }
  };
  var DIAS = {
    hoje: { botao: 'Hoje, ter', texto: 'hoje', resumo: 'hoje', horas: ['16h', '18h30'] },
    amanha: { botao: 'Amanhã, qua', texto: 'amanhã, quarta', resumo: 'amanhã, quarta', horas: ['10h', '13h', '16h30'] },
    quinta: { botao: 'Qui, 5/11', texto: 'na quinta, 5/11', resumo: 'quinta, 5/11,', horas: ['9h', '11h30', '14h30', '17h'] }
  };

  var pedido = {};
  var minuto = 1;
  var fila = Promise.resolve();
  var geracao = 0;

  function hora() { return '14:' + String(minuto).padStart(2, '0'); }
  function rolar() { conversa.scrollTop = conversa.scrollHeight; }
  function esperar(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function minuscula(t) { return t.charAt(0).toLowerCase() + t.slice(1); }

  function bolha(texto, eu) {
    var linha = document.createElement('div');
    linha.className = 'msg' + (eu ? ' msg--eu' : '');
    var b = document.createElement('div');
    b.className = 'balao';
    var t = document.createElement('span');
    if (texto.indexOf('<b>') === 0) { t.innerHTML = texto; } else { t.textContent = texto; }
    var h = document.createElement('span');
    h.className = 'balao__hora';
    h.textContent = hora() + (eu ? ' ✓✓' : '');
    b.appendChild(t); b.appendChild(h); linha.appendChild(b);
    conversa.appendChild(linha);
    rolar();
  }

  // Enfileira falas do atendimento com o "digitando…"
  function bot(textos, opcoes, extra) {
    var minha = geracao;
    fila = fila.then(function () {
      var seq = Promise.resolve();
      [].concat(textos).forEach(function (texto) {
        seq = seq.then(function () {
          if (minha !== geracao) return;
          status.textContent = 'digitando…';
          var d = document.createElement('div');
          d.className = 'msg';
          d.innerHTML = '<div class="balao"><span class="digitando"><i></i><i></i><i></i></span></div>';
          conversa.appendChild(d); rolar();
          return esperar(Math.min(1400, 450 + texto.length * 6)).then(function () {
            d.remove();
            status.textContent = 'online';
            if (minha === geracao) bolha(texto, false);
          });
        });
      });
      return seq.then(function () {
        if (minha !== geracao) return;
        if (extra) extra();
        if (opcoes && opcoes.length) mostrarOpcoes(opcoes);
      });
    });
  }

  function mostrarOpcoes(opcoes) {
    var caixa = document.createElement('div');
    caixa.className = 'opcoes';
    opcoes.forEach(function (o) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'opcao';
      b.textContent = o.texto;
      b.addEventListener('click', function () {
        caixa.remove();
        minuto += 1;
        bolha(o.fala || o.texto, true);
        o.acao();
      });
      caixa.appendChild(b);
    });
    conversa.appendChild(caixa);
    rolar();
  }

  // ---------- Fluxos ----------
  function menu(texto) {
    bot(texto, [
      { texto: 'Agendar horário', acao: escolherArea },
      { texto: 'Preços e duração', acao: precos },
      { texto: 'Cuidados', acao: cuidados },
      { texto: 'Endereço', acao: endereco }
    ]);
  }
  function outraDuvida() { menu('Claro. Sobre o quê?'); }

  function precos() {
    bot('<b>Preços e duração</b>\nDesign de sobrancelha · 40 min · R$ 65\nDesign com henna · 50 min · R$ 85\nBrow lamination · 1 h · R$ 150\nLash lifting · 1 h · R$ 160\nExtensão fio a fio · 2 h · R$ 230\n(manutenção em 21 dias, R$ 130)\nLimpeza de pele · 1h20 · R$ 190\n\nPix, débito ou crédito.', [
      { texto: 'Agendar horário', acao: escolherArea },
      { texto: 'Cuidados', acao: cuidados },
      { texto: 'Endereço', acao: endereco }
    ]);
  }

  function cuidados() {
    bot('De qual procedimento?', Object.keys(CUIDADOS).map(function (k) {
      return { texto: CUIDADOS[k].titulo === 'Extensão de cílios fio a fio' ? 'Extensão fio a fio' : CUIDADOS[k].titulo, acao: function () { mostrarCuidado(k); } };
    }));
  }
  function mostrarCuidado(k) {
    var c = CUIDADOS[k];
    var p = PROCS[c.proc];
    var quem = p.profs.length > 1 ? 'a ' + p.profs[0] + ' ou a ' + p.profs[1] : 'a ' + p.profs[0];
    bot(['<b>' + c.titulo + '</b>\n\n' + c.texto, 'Quer que eu já procure um horário com ' + quem + '?'], [
      { texto: 'Agendar ' + minuscula(p.curto), acao: function () { pedido = { proc: c.proc }; escolherProf(); } },
      { texto: 'Ver preços', acao: precos },
      { texto: 'Outra dúvida', acao: outraDuvida }
    ]);
  }

  function endereco() {
    bot('Rua das Camomilas, 186, Alto da Glória, Curitiba.\nTer a sex, das 9h às 20h. Sáb, das 9h às 16h.', [
      { texto: 'Agendar horário', acao: escolherArea },
      { texto: 'Outra dúvida', acao: outraDuvida }
    ]);
  }

  function escolherArea() {
    pedido = {};
    bot('Qual procedimento?', [
      { texto: 'Sobrancelha', acao: function () { escolherProc(['design', 'henna', 'lamination']); } },
      { texto: 'Cílios', acao: function () { escolherProc(['lifting', 'extensao']); } },
      { texto: 'Pele', acao: function () { pedido.proc = 'limpeza'; escolherProf(); } }
    ]);
  }
  function escolherProc(lista, pergunta) {
    bot(pergunta || 'Qual deles?', lista.map(function (k) {
      return { texto: PROCS[k].curto, acao: function () { pedido.proc = k; if (pedido.prof) escolherDia(); else escolherProf(); } };
    }));
  }

  function escolherProf() {
    var p = PROCS[pedido.proc];
    if (p.profs.length === 1) {
      pedido.prof = p.profs[0];
      bot('Quem faz ' + minuscula(p.nome) + ' aqui é a ' + p.profs[0] + '. Que dia fica melhor?', diasOpcoes());
      return;
    }
    bot('Com quem? A ' + p.profs[0] + ' e a ' + p.profs[1] + ' fazem ' + minuscula(p.curto) + '.', [
      { texto: p.profs[0], acao: function () { pedido.prof = p.profs[0]; escolherDia(); } },
      { texto: p.profs[1], acao: function () { pedido.prof = p.profs[1]; escolherDia(); } },
      { texto: 'Quem tiver horário antes', acao: function () { pedido.prof = p.profs[0]; escolherDia('Quem tem horário antes é a ' + p.profs[0] + '. Que dia fica melhor?'); } }
    ]);
  }

  function diasOpcoes() {
    return Object.keys(DIAS).map(function (k) {
      return { texto: DIAS[k].botao, acao: function () { pedido.dia = k; escolherHora(); } };
    });
  }
  function escolherDia(texto) { bot(texto || 'Que dia fica melhor?', diasOpcoes()); }

  function escolherHora() {
    var d = DIAS[pedido.dia];
    var p = PROCS[pedido.proc];
    var opcoes = d.horas.map(function (h) {
      return { texto: h, acao: function () { pedido.hora = h; resumo(); } };
    });
    opcoes.push({ texto: 'Outro dia', acao: function () { escolherDia(); } });
    bot('Horários da ' + pedido.prof + ' ' + d.texto + '. ' + p.curto + ' leva ' + (p.tempo === '2\u00a0h' ? 'umas 2\u00a0h' : p.tempo) + '.', opcoes);
  }

  function resumo() {
    var p = PROCS[pedido.proc];
    var d = DIAS[pedido.dia];
    bot(p.nome + ' com a ' + pedido.prof + ', ' + d.resumo + ' às ' + pedido.hora + '. Leva ' + p.tempo + ' e custa ' + p.preco + '. Confirma?', [
      { texto: 'Confirmar', acao: confirmar },
      { texto: 'Trocar horário', acao: function () { escolherDia(); } }
    ]);
  }

  function confirmar() {
    var p = PROCS[pedido.proc];
    bot('Marcado. ' + p.prep + ' Um dia antes eu te mando a confirmação. Rua das Camomilas, 186, Alto da Glória.', [
      { texto: 'Recomeçar a conversa', fala: 'Recomeçar', acao: function () { setTimeout(reiniciar, 500); } }
    ], function () {
      var a = document.createElement('a');
      a.className = 'cartao-link';
      a.href = '../bastidores/';
      a.innerHTML = '<span>Ver o que roda nos bastidores</span><span aria-hidden="true">→</span>';
      conversa.appendChild(a);
      rolar();
    });
  }

  // ---------- Início (com atalhos vindos da landing) ----------
  function recomecar() {
    geracao += 1;
    fila = Promise.resolve();
    pedido = {};
    minuto = 1;
    status.textContent = 'online';
    conversa.innerHTML = '<div class="chat__dia"><span>Hoje</span></div>';
    var q = new URLSearchParams(window.location.search);
    var proc = q.get('p'), prof = q.get('pro'), duvida = q.get('d');
    var saudacao = 'Oi, aqui é a Entrelinha. Posso te passar preço, tempo e cuidados de cada procedimento, ou já marcar o seu horário.';

    if (proc && PROCS[proc]) {
      bot(saudacao, null, function () {
        bolha('Quero agendar ' + minuscula(PROCS[proc].nome), true);
        pedido = { proc: proc };
        escolherProf();
      });
    } else if (prof && PROFS[prof]) {
      var pr = PROFS[prof];
      bot(saudacao, null, function () {
        bolha('Quero agendar com a ' + pr.nome, true);
        pedido = { prof: pr.nome };
        if (pr.procs.length === 1) { pedido.proc = pr.procs[0]; escolherDia('A ' + pr.nome + ' faz ' + minuscula(PROCS[pr.procs[0]].nome) + '. Que dia fica melhor?'); }
        else escolherProc(pr.procs, 'Com a ' + pr.nome + ', qual procedimento?');
      });
    } else if (duvida) {
      bot(saudacao, null, function () {
        bolha('Tenho uma dúvida', true);
        menu('Claro. Sobre o quê?');
      });
    } else {
      menu(saudacao);
    }
  }

  // Recomeçar do zero: descarta o atalho que veio na URL
  function reiniciar() {
    if (window.location.search) history.replaceState(null, '', window.location.pathname);
    recomecar();
  }
  document.querySelectorAll('[data-acao="recomecar"]').forEach(function (b) {
    b.addEventListener('click', reiniciar);
  });
  recomecar();
})();
