// Simulação da automação depois do agendamento. Tudo local, nada é enviado.
(function () {
  var passos = document.querySelectorAll('.passo');
  var rodar = document.getElementById('rodar');
  var recomecarBtn = document.getElementById('recomecar');
  var status = document.getElementById('status');
  var fala = document.getElementById('fala');
  var agendaVoce = document.getElementById('agenda-voce');
  var agendaStatus = document.getElementById('agenda-status');
  var nConf = document.getElementById('n-conf');
  var nRem = document.getElementById('n-rem');
  var nSem = document.getElementById('n-sem');
  var botoesResposta = document.querySelectorAll('[data-resposta]');

  var feitos = 1;
  var resposta = null;

  var PROXIMO = [
    '',
    'Passo 1 de 4 · próximo: confirmação 24 h antes',
    'Passo 2 de 4 · próximo: cuidados depois do procedimento',
    'Passo 3 de 4 · próximo: aviso da manutenção',
    'Passo 4 de 4 · tudo rodou sozinho'
  ];
  var DATAS = {
    original: { quando3: '2 h depois · qui, 5/11, 18h30', quando4: 'Dia 21 · qui, 26/11, 10h', msg4: 'Faz três semanas da sua extensão. A manutenção leva 1 h e custa R$ 130. A Marina tem sexta, 27/11, às 10h ou às 15h.', botao4: 'Marcar sexta, 10h' },
    remarcado: { quando3: '2 h depois · sex, 6/11, 14h', quando4: 'Dia 21 · sex, 27/11, 10h', msg4: 'Faz três semanas da sua extensão. A manutenção leva 1 h e custa R$ 130. A Marina tem sábado, 28/11, às 9h ou às 11h.', botao4: 'Marcar sábado, 9h' }
  };

  function textos(qual) {
    var d = DATAS[qual];
    document.querySelectorAll('[data-texto]').forEach(function (el) {
      if (d[el.dataset.texto]) el.textContent = d[el.dataset.texto];
    });
  }

  function desenhar(recente) {
    passos.forEach(function (p, i) {
      var n = i + 1;
      p.classList.toggle('passo--feito', n <= feitos);
      p.classList.toggle('passo--proximo', n === feitos + 1);
      p.classList.toggle('passo--recente', n === recente);
      var estado = p.querySelector('.passo__estado');
      estado.textContent = n <= feitos ? 'Feito' : n === feitos + 1 ? 'Próximo' : 'Agendado';
    });
    status.textContent = feitos === 2 && !resposta
      ? 'Passo 2 de 4 · responda como a cliente: Confirmo ou Preciso remarcar'
      : PROXIMO[feitos];
    rodar.disabled = feitos >= passos.length;
    var situacao = resposta === 'remarcar' ? null : feitos >= 3 ? 'atendida' : resposta === 'confirmo' ? 'confirmada' : 'marcada';
    if (situacao) {
      agendaVoce.classList.remove('liberado');
      agendaStatus.textContent = 'Extensão fio a fio · você · ' + situacao;
    }
  }

  function numeros() {
    var conf = 8, rem = 1, sem = 2;
    if (resposta === 'confirmo') { conf += 1; sem -= 1; }
    if (resposta === 'remarcar') { rem += 1; sem -= 1; }
    nConf.textContent = conf; nRem.textContent = rem; nSem.textContent = sem;
  }

  function falaEu(texto) {
    var d = document.createElement('div');
    d.className = 'fala-eu';
    d.innerHTML = '<span></span><small>14:41 ✓✓</small>';
    d.firstChild.textContent = texto;
    fala.appendChild(d);
  }
  function falaBot(texto, classe) {
    var d = document.createElement('div');
    d.className = classe || 'fala-bot';
    d.textContent = texto;
    fala.appendChild(d);
  }

  function responder(qual) {
    if (resposta) return;
    resposta = qual;
    botoesResposta.forEach(function (b) {
      b.disabled = true;
      b.classList.toggle('escolhido', b.dataset.resposta === qual);
    });
    if (qual === 'confirmo') {
      falaEu('Confirmo');
    } else {
      falaEu('Preciso remarcar');
      setTimeout(function () { falaBot('Sem problema. A Marina tem sexta, 6/11, às 10h ou às 15h.'); }, 500);
      setTimeout(function () { falaEu('Sexta, 10h'); }, 1300);
      setTimeout(function () {
        falaBot('O horário de quinta, 14h30, voltou para a agenda e a lista de espera foi avisada.', 'fala-nota');
        agendaVoce.classList.add('liberado');
        agendaStatus.textContent = 'livre · lista de espera avisada';
      }, 1900);
      textos('remarcado');
    }
    numeros();
    desenhar();
  }

  botoesResposta.forEach(function (b) {
    b.addEventListener('click', function () { if (feitos >= 2) responder(b.dataset.resposta); });
  });

  rodar.addEventListener('click', function () {
    if (feitos >= passos.length) return;
    if (feitos === 2 && !resposta) responder('confirmo');
    feitos += 1;
    desenhar(feitos);
  });

  recomecarBtn.addEventListener('click', function () {
    feitos = 1;
    resposta = null;
    fala.innerHTML = '';
    botoesResposta.forEach(function (b) { b.disabled = false; b.classList.remove('escolhido'); });
    textos('original');
    numeros();
    desenhar();
  });

  numeros();
  desenhar();
})();
