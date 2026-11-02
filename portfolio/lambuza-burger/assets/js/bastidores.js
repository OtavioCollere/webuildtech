// Bastidores simulados: o pedido cai na cozinha → "pronto" → aviso automático → cupom no dia seguinte.
// Se o visitante acabou de pedir no totem ou no WhatsApp desta demo, a história usa o pedido dele.
(function () {
  "use strict";

  function lerPedido(chave) {
    try { return JSON.parse(localStorage.getItem(chave) || "null"); } catch (e) { return null; }
  }
  var doWhats = lerPedido("lambuza:ultimo-whatsapp");
  var doTotem = lerPedido("lambuza:ultimo-totem");

  var PEDIDOS = {
    whatsapp: {
      numero: "#2318", origem: "WhatsApp · entrega", classe: "whats",
      itens: doWhats && doWhats.itens && doWhats.itens.length ? doWhats.itens.join("\n") : "1x Lambuzão ao ponto\nCombo: fritas + guaraná",
      primeiro: (doWhats && doWhats.primeiro) || "Lambuzão",
      descricao: "Siga o pedido #2318 do WhatsApp: ele cai na tela da cozinha, o cliente recebe o aviso de entrega e, no dia seguinte, um cupom pra voltar. Ninguém precisa digitar nada.",
      passos: [
        { hora: "19:44", titulo: "Pedido cai na cozinha", desc: "O #2318 aparece na tela da chapa. Ninguém redigita." },
        { hora: "20:06", titulo: "Cozinha marca pronto", desc: "Quem está na chapa toca em Pronto quando o lanche sai." },
        { hora: "20:08", titulo: "Cliente recebe o aviso", desc: "O WhatsApp avisa sozinho que saiu pra entrega." },
        { hora: "Amanhã, 12:00", titulo: "Cupom pra voltar", desc: "Uma mensagem com 10% de volta, válida até domingo." }
      ],
      aviso: { rotulo: "Passo 3 · ao tocar em Pronto", texto: "Seu pedido #2318 saiu! Chega em uns 15 min." },
      pronto: "aviso enviado 20:08"
    },
    totem: {
      numero: (doTotem && doTotem.numero) || "047", origem: "Totem · " + (doTotem && doTotem.modo === "levar" ? "levar" : "comer aqui"), classe: "totem",
      itens: doTotem && doTotem.itens && doTotem.itens.length ? doTotem.itens.join("\n") : "1x Lambuzão ao ponto + bacon\nCombo: fritas + guaraná",
      primeiro: (doTotem && doTotem.primeiro) || "Lambuzão"
    }
  };
  var senha = PEDIDOS.totem.numero;
  PEDIDOS.totem.descricao = "Siga a senha " + senha + " do totem: ela cai na tela da cozinha, aparece no painel do balcão quando fica pronta e, no dia seguinte, o cliente recebe um cupom pra voltar. Ninguém precisa digitar nada.";
  PEDIDOS.totem.passos = [
    { hora: "19:44", titulo: "Pedido cai na cozinha", desc: "A senha " + senha + " aparece na tela da chapa assim que o pagamento passa." },
    { hora: "20:06", titulo: "Cozinha marca pronto", desc: "Quem está na chapa toca em Pronto quando o lanche sai." },
    { hora: "20:08", titulo: "Painel chama a senha", desc: "A senha " + senha + " aparece no painel do balcão, sem ninguém gritar." },
    { hora: "Amanhã, 12:00", titulo: "Cupom pra voltar", desc: "Se deixou o WhatsApp no totem, o cliente recebe 10% de volta." }
  ];
  PEDIDOS.totem.aviso = { rotulo: "Passo 3 · painel do balcão", texto: "Senha " + senha + ": pode retirar no balcão." };
  PEDIDOS.totem.pronto = "senha chamada 20:08";

  var FIXOS = {
    novo: { numero: "#2321", origem: "WhatsApp", classe: "whats", itens: "1x Clássico ao ponto\n1x Fritas da casa", tempo: "há 1 min" },
    pronto: { numero: "#2316", origem: "Entregador a caminho", classe: "whats", itens: "2x Bacon & Mel\n1x Onion rings", tempo: "aviso enviado 20:01" }
  };
  var HORAS = ["19:44", "20:06", "20:08", "20:08"];
  var TEMPOS = ["acabou de chegar", "22 min", "pronto em 22 min", "entregue"];

  var params = new URLSearchParams(location.search);
  var estado = { origem: params.get("origem") === "totem" ? "totem" : "whatsapp", passo: 1, rodando: null };

  function $(sel) { return document.querySelector(sel); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function cartao(p, extra) {
    return '<article class="b-pedido' + (extra.classe || "") + '">' +
      '<div class="b-pedido__topo"><p class="b-pedido__numero">' + esc(p.numero) + '</p><p class="b-pedido__origem b-pedido__origem--' + p.classe + '">' + esc(p.origem) + "</p></div>" +
      '<p class="b-pedido__itens">' + esc(p.itens) + "</p>" +
      '<p class="b-pedido__tempo">' + esc(extra.tempo || p.tempo) + "</p>" +
      (extra.botao ? '<button class="b-pronto" type="button" data-acao="pronto">Pronto</button>' : "") +
      "</article>";
  }

  function render() {
    var foco = PEDIDOS[estado.origem];
    var outro = PEDIDOS[estado.origem === "whatsapp" ? "totem" : "whatsapp"];
    var n = estado.passo;

    $('[data-texto="descricao"]').textContent = foco.descricao;
    document.querySelectorAll(".b-origem__opcao").forEach(function (b) {
      var ativa = b.dataset.valor === estado.origem;
      b.classList.toggle("is-ativa", ativa);
      b.setAttribute("aria-pressed", ativa);
    });
    document.querySelector('.b-origem__opcao[data-valor="totem"]').textContent = "Totem · senha " + senha;

    // linha do tempo (desktop)
    $('[data-lista="passos"]').innerHTML = foco.passos.map(function (p, i) {
      var k = i + 1;
      var cls = k < n ? "is-feito" : k === n ? "is-atual" : "is-proximo";
      var sufixo = k < n ? " · feito" : k === n ? " · agora" : k === n + 1 && k < 4 ? " · próximo" : "";
      return '<li class="b-passo ' + cls + '"' + (k === n ? ' aria-current="step"' : "") + ">" +
        '<span class="b-passo__marca" aria-hidden="true">' + (k < n ? "✓" : k) + "</span>" +
        '<button type="button" class="b-passo__conteudo" data-acao="passo" data-valor="' + k + '">' +
          '<span class="b-passo__hora">' + p.hora + sufixo + "</span>" +
          '<span class="b-passo__titulo">' + esc(p.titulo) + "</span>" +
          '<span class="b-passo__desc">' + esc(p.desc) + "</span>" +
        "</button></li>";
    }).join("");

    // progresso + passo atual (celular)
    $('[data-lista="progresso"]').innerHTML = [1, 2, 3, 4].map(function (k) {
      return '<span class="' + (k < n ? "is-feito" : k === n ? "is-atual" : "") + '"></span>';
    }).join("");
    var atual = foco.passos[n - 1];
    $('[data-bloco="atual"]').innerHTML =
      '<p class="b-atual__hora">Passo ' + n + " de 4 · " + atual.hora + "</p>" +
      '<p class="b-atual__titulo">' + esc(atual.titulo) + "</p>" +
      '<p class="b-atual__desc">' + esc(atual.desc) + "</p>";

    // tela da cozinha: o pedido em foco anda de coluna conforme o passo
    var colunaFoco = n === 1 ? "novos" : n === 2 ? "chapa" : "prontos";
    var cartaoFoco = cartao(foco, { classe: " is-foco" + (n === 4 ? " is-apagado" : ""), tempo: n === 3 ? foco.pronto : TEMPOS[n - 1], botao: n === 2 });
    var cols = {
      novos: [cartao(FIXOS.novo, {})],
      chapa: [cartao(outro, { tempo: "6 min" })],
      prontos: [cartao(FIXOS.pronto, {})]
    };
    if (colunaFoco === "prontos") cols.prontos.unshift(cartaoFoco); else cols[colunaFoco].unshift(cartaoFoco);
    var nomes = { novos: "Novos", chapa: "Na chapa", prontos: "Prontos" };
    $('[data-lista="colunas"]').innerHTML = ["novos", "chapa", "prontos"].map(function (c) {
      return '<div class="b-coluna b-coluna--' + c + (c === colunaFoco ? " is-foco" : "") + '">' +
        '<div class="b-coluna__topo"><span>' + nomes[c] + "</span><span>" + cols[c].length + "</span></div>" +
        cols[c].join("") + "</div>";
    }).join("");
    $('[data-lista="abas"]').innerHTML = ["novos", "chapa", "prontos"].map(function (c) {
      return '<span class="b-aba b-aba--' + c + (c === colunaFoco ? " is-ativa" : "") + '">' + nomes[c] + " " + cols[c].length + "</span>";
    }).join("");
    $('[data-texto="hora"]').textContent = n === 4 ? "12:00" : HORAS[n - 1];

    // mensagens automáticas
    var msgs = [
      { passo: 3, rotulo: foco.aviso.rotulo, texto: foco.aviso.texto },
      { passo: 4, rotulo: "Passo 4 · amanhã, 12:00", texto: "Ontem foi " + foco.primeiro + ". Hoje tem 10% de volta com o cupom VOLTA10, até domingo." }
    ];
    $('[data-lista="mensagens"]').innerHTML = msgs.map(function (m) {
      var enviada = n >= m.passo;
      var cls = enviada ? (n === m.passo ? " is-agora" : "") : " is-espera";
      return '<div class="b-msg' + cls + '"><p class="b-msg__rotulo">' + esc(m.rotulo) + '</p><p class="b-msg__texto">' + esc(m.texto) + "</p>" +
        '<p class="b-msg__status' + (enviada ? " is-enviada" : "") + '">' + (enviada ? "enviada ✓✓" : "aguardando") + "</p></div>";
    }).join("");

    var avancar = $('[data-acao="avancar"]');
    avancar.innerHTML = n >= 4 ? "Recomeçar ↺" : 'Avançar passo <span aria-hidden="true">→</span>';
  }

  function irPara(k) { estado.passo = Math.max(1, Math.min(4, k)); render(); }
  function parar() {
    clearInterval(estado.rodando);
    estado.rodando = null;
    var b = $('[data-acao="rodar"]');
    b.setAttribute("aria-pressed", "false");
    b.textContent = "Rodar sozinho";
  }
  function rodar() {
    if (estado.rodando) { parar(); return; }
    if (estado.passo >= 4) irPara(1);
    var b = $('[data-acao="rodar"]');
    b.setAttribute("aria-pressed", "true");
    b.textContent = "Pausar";
    estado.rodando = setInterval(function () {
      if (estado.passo >= 4) { parar(); return; }
      irPara(estado.passo + 1);
    }, 2600);
  }

  document.addEventListener("click", function (e) {
    var alvo = e.target.closest("[data-acao]");
    if (!alvo) return;
    switch (alvo.dataset.acao) {
      case "avancar": parar(); irPara(estado.passo >= 4 ? 1 : estado.passo + 1); break;
      case "rodar": rodar(); break;
      case "pronto": parar(); irPara(3); break;
      case "passo": parar(); irPara(+alvo.dataset.valor); break;
      case "origem": parar(); estado.origem = alvo.dataset.valor; irPara(1); break;
    }
  });

  irPara(params.get("passo") ? +params.get("passo") : 2);
})();
