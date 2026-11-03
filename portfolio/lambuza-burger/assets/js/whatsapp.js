// Conversa simulada da Lambuza Burger: cardápio → itens → endereço → pagamento → confirmação com tempo estimado.
// Nada é enviado: as respostas do "robô" são roteiro fixo.
(function () {
  "use strict";

  var IMG = "../assets/img/";
  var NUMERO = "#2318";
  var ENTREGA = 6;
  var COMBO = 16;
  var ENDERECO = "Rua Exemplo, 123 · Rebouças";

  var LANCHES = {
    lambuzao: { nome: "Lambuzão", preco: 38 },
    classico: { nome: "Clássico", preco: 29 },
    "bacon-mel": { nome: "Bacon & Mel", preco: 34 },
    verdinho: { nome: "Verdinho", preco: 31 }
  };
  var BEBIDAS = {
    cola: { nome: "Refri de cola", curto: "refri de cola", extra: 0 },
    guarana: { nome: "Guaraná", curto: "guaraná", extra: 0 },
    limonada: { nome: "Limonada da casa (+ R$ 4)", curto: "limonada", extra: 4 }
  };
  var PAGAMENTOS = { pix: "Pix", cartao: "Cartão na entrega", dinheiro: "Dinheiro" };

  var conversa = document.getElementById("conversa");
  var lenta = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var estado, fila, minutos;

  function novo() { return { itens: [], atual: null, pagamento: null, troco: null, confirmado: false, fritas: false }; }

  // ---------- relógio de mentirinha ----------
  function hora() { var h = Math.floor(minutos / 60), m = minutos % 60; return h + ":" + String(m).padStart(2, "0"); }
  function passaTempo() { minutos += 1; }

  // ---------- desenho ----------
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function rolar() { conversa.scrollTo({ top: conversa.scrollHeight, behavior: lenta ? "smooth" : "auto" }); }
  function adiciona(el) { conversa.appendChild(el); rolar(); return el; }
  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }

  function msgEu(texto) {
    adiciona(el('<div class="wa-msg wa-msg--eu"><span class="wa-msg__texto">' + esc(texto) + '</span><span class="wa-msg__hora">' + hora() + "</span></div>"));
  }
  function msgBot(texto) {
    return adiciona(el('<div class="wa-msg wa-msg--bot"><span class="wa-msg__texto">' + esc(texto) + '</span><span class="wa-msg__hora">' + hora() + "</span></div>"));
  }
  function msgFoto(src, texto) {
    adiciona(el('<div class="wa-msg wa-msg--bot wa-msg--foto"><img src="' + src + '" width="1000" height="1000" alt="Lambuzão, o lanche da casa"><span class="wa-msg__texto">' + esc(texto) + '</span><span class="wa-msg__hora">' + hora() + "</span></div>"));
  }
  function opcoes(lista, compactas) {
    var grupo = el('<div class="wa-opcoes' + (compactas ? " wa-opcoes--compactas" : "") + '" role="group" aria-label="Opções de resposta"></div>');
    lista.forEach(function (o) {
      var b = document.createElement(o.href ? "a" : "button");
      b.className = "wa-opcao";
      b.textContent = o.rotulo;
      if (o.href) { b.href = o.href; }
      else {
        b.type = "button";
        b.addEventListener("click", function () {
          if (b.disabled) return;
          Array.prototype.forEach.call(grupo.querySelectorAll("button"), function (x) { x.disabled = true; });
          b.classList.add("is-escolhida");
          passaTempo();
          msgEu(o.resposta || o.rotulo);
          o.acao();
        });
      }
      grupo.appendChild(b);
    });
    adiciona(grupo);
    var primeiro = grupo.querySelector("button, a");
    if (primeiro && document.activeElement && document.activeElement.classList.contains("wa-opcao")) primeiro.focus({ preventScroll: true });
  }

  // O robô "digita" antes de responder. Cada passo da fila espera o anterior.
  function robo(passos) {
    var id = fila;
    var i = 0;
    function proximo() {
      if (id !== fila || i >= passos.length) return;
      var passo = passos[i++];
      var digitando = adiciona(el('<div class="wa-digitando" aria-label="Lambuza está digitando"><span></span><span></span><span></span></div>'));
      setTimeout(function () {
        digitando.remove();
        if (id !== fila) return;
        passo();
        proximo();
      }, lenta ? 650 : 120);
    }
    proximo();
  }

  // ---------- etapas (chips do enquadramento) ----------
  function etapa(n) {
    document.querySelectorAll(".wa-passo").forEach(function (p) {
      var k = +p.dataset.passo;
      p.classList.toggle("is-atual", k === n);
      p.classList.toggle("is-feito", k < n);
    });
  }

  // ---------- roteiro ----------
  function saudacao() {
    etapa(0);
    robo([
      function () { msgBot("Oi! Aqui é a Lambuza. Bora pedir? A chapa tá ligada até as 23h."); },
      function () {
        opcoes([
          { rotulo: "Ver cardápio", acao: cardapio },
          { rotulo: "Status do pedido", acao: status },
          { rotulo: "Falar com atendente", acao: atendente }
        ]);
      }
    ]);
  }

  function cardapio() {
    etapa(1);
    robo([
      function () { msgFoto(IMG + "lambuzao.jpg", "Cardápio de hoje. Toque no lanche:"); },
      function () {
        opcoes(Object.keys(LANCHES).map(function (id) {
          var l = LANCHES[id];
          return { rotulo: l.nome + " · R$ " + l.preco, acao: function () { escolher(id); } };
        }), true);
      }
    ]);
  }

  function escolher(id) {
    etapa(2);
    estado.atual = { id: id, bebida: null };
    robo([
      function () { msgBot("Boa escolha. Vira combo com fritas da casa e refri por + R$ " + COMBO + "?"); },
      function () {
        opcoes([
          { rotulo: "Sim, quero combo", acao: escolherBebida },
          { rotulo: "Só o lanche", acao: function () { fechaItem(); } }
        ], true);
      }
    ]);
  }

  function escolherBebida() {
    robo([
      function () { msgBot("Fechado. Qual bebida vai no combo?"); },
      function () {
        opcoes(Object.keys(BEBIDAS).map(function (id) {
          return { rotulo: BEBIDAS[id].nome, resposta: BEBIDAS[id].nome.replace(" (+ R$ 4)", ""), acao: function () { estado.atual.bebida = id; fechaItem(); } };
        }), true);
      }
    ]);
  }

  function nomeItem(item) {
    if (item.avulso) return item.nome;
    return LANCHES[item.id].nome + (item.bebida ? " + combo" : "");
  }
  function precoItem(item) {
    if (item.avulso) return item.preco;
    return LANCHES[item.id].preco + (item.bebida ? COMBO + BEBIDAS[item.bebida].extra : 0);
  }
  function subtotal() { return estado.itens.reduce(function (s, i) { return s + precoItem(i); }, 0); }

  function fechaItem() {
    estado.itens.push(estado.atual);
    estado.atual = null;
    maisAlgo();
  }

  function maisAlgo() {
    var resumo = estado.itens.map(nomeItem).join(", ");
    var lista = [
      { rotulo: "Fechar pedido", acao: endereco },
      { rotulo: "Adicionar outro lanche", acao: cardapio }
    ];
    if (!estado.fritas) {
      lista.push({ rotulo: "Uma porção de fritas (+ R$ 14)", resposta: "Uma porção de fritas", acao: function () {
        estado.fritas = true;
        estado.itens.push({ avulso: true, nome: "Fritas da casa", preco: 14 });
        maisAlgo();
      } });
    }
    robo([
      function () { msgBot("Anotado: " + resumo + ". Subtotal R$ " + subtotal() + ". Mais alguma coisa?"); },
      function () { opcoes(lista, true); }
    ]);
  }

  function endereco() {
    etapa(3);
    robo([
      function () { msgBot("Pra onde vai? Entregamos no Rebouças e arredores."); },
      function () {
        opcoes([
          { rotulo: ENDERECO, acao: pagamento },
          { rotulo: "Outro endereço", acao: function () {
            robo([function () { msgBot("Na conversa de verdade, você escreveria o endereço aqui. Nesta demonstração, vamos usar a " + ENDERECO + "."); }, pagamento]);
          } }
        ], true);
      }
    ]);
  }

  function pagamento() {
    etapa(4);
    robo([
      function () { msgBot("Anotado. Como prefere pagar?"); },
      function () {
        opcoes([
          { rotulo: "Pix", acao: function () { estado.pagamento = "pix"; confirmar(); } },
          { rotulo: "Cartão na entrega", acao: function () { estado.pagamento = "cartao"; confirmar(); } },
          { rotulo: "Dinheiro", acao: function () { estado.pagamento = "dinheiro"; troco(); } }
        ], true);
      }
    ]);
  }

  function troco() {
    robo([
      function () { msgBot("Precisa de troco?"); },
      function () {
        opcoes([
          { rotulo: "Não precisa", acao: function () { confirmar(); } },
          { rotulo: "Troco pra R$ 100", acao: function () { estado.troco = 100; confirmar(); } }
        ], true);
      }
    ]);
  }

  function confirmar() {
    etapa(5);
    estado.confirmado = true;
    var total = subtotal() + ENTREGA;
    var rotuloTotal = estado.pagamento === "pix" ? "Total no Pix" : estado.pagamento === "cartao" ? "Total no cartão" : "Total em dinheiro";
    var linhas = estado.itens.map(function (i) {
      return '<div class="wa-conf__linha"><span>' + esc(nomeItem(i)) + "</span><strong>R$ " + precoItem(i) + "</strong></div>";
    }).join("");
    guardar(total);
    robo([
      function () {
        adiciona(el('<div class="wa-msg wa-msg--bot wa-conf">' +
          '<p class="wa-conf__titulo"><span class="wa-conf__check" aria-hidden="true">✓</span>Pedido ' + NUMERO + " confirmado</p>" +
          '<div class="wa-conf__itens">' + linhas +
            '<div class="wa-conf__linha"><span>Entrega</span><strong>R$ ' + ENTREGA + "</strong></div>" +
            '<div class="wa-conf__linha wa-conf__linha--total"><span>' + rotuloTotal + "</span><strong>R$ " + total + "</strong></div>" +
          "</div>" +
          '<p class="wa-conf__prazo">Chega em 35 a 45 min.</p>' +
          '<p class="wa-conf__nota">' + (estado.troco ? "O entregador leva troco pra R$ " + estado.troco + ". " : "") + "A gente avisa aqui quando sair pra entrega.</p>" +
          '<span class="wa-msg__hora">' + hora() + "</span></div>"));
      },
      function () {
        var lista = [];
        if (estado.pagamento === "pix") lista.push({ rotulo: "Copiar código Pix", acao: copiarPix });
        lista.push({ rotulo: "Ver os bastidores", href: "../bastidores/?origem=whatsapp" });
        lista.push({ rotulo: "Fazer outro pedido", acao: function () { setTimeout(iniciar, lenta ? 500 : 0); } });
        opcoes(lista, true);
      }
    ]);
  }

  function copiarPix() {
    robo([
      function () { msgBot("Código copiado. É de mentirinha: nenhum pagamento acontece nesta demonstração."); },
      function () {
        opcoes([
          { rotulo: "Ver os bastidores", href: "../bastidores/?origem=whatsapp" },
          { rotulo: "Fazer outro pedido", acao: function () { setTimeout(iniciar, lenta ? 500 : 0); } }
        ], true);
      }
    ]);
  }

  function status() {
    robo([
      function () {
        msgBot(estado.confirmado
          ? "Seu pedido " + NUMERO + " tá na chapa. Chega em 35 a 45 min."
          : "Você ainda não tem pedido em andamento. Quer ver o cardápio?");
      },
      function () { opcoes([{ rotulo: "Ver cardápio", acao: cardapio }]); }
    ]);
  }

  function atendente() {
    robo([
      function () { msgBot("Na Lambuza de verdade, alguém da equipe assumiria a conversa aqui. Nesta demonstração, o robô segue com você."); },
      function () { opcoes([{ rotulo: "Ver cardápio", acao: cardapio }]); }
    ]);
  }

  // Os bastidores leem o último pedido para contar a história com ele.
  function guardar(total) {
    try {
      localStorage.setItem("lambuza:ultimo-whatsapp", JSON.stringify({
        origem: "whatsapp", numero: NUMERO, total: total, pagamento: estado.pagamento,
        itens: estado.itens.map(function (i) {
          return i.avulso ? "1x " + i.nome : "1x " + LANCHES[i.id].nome + (i.bebida ? "\nCombo: fritas + " + BEBIDAS[i.bebida].curto : "");
        }),
        primeiro: estado.itens[0] && !estado.itens[0].avulso ? LANCHES[estado.itens[0].id].nome : null,
        quando: Date.now()
      }));
    } catch (e) { /* sem armazenamento, os bastidores usam o pedido de exemplo */ }
  }

  // ---------- início ----------
  function iniciar() {
    fila = (fila || 0) + 1;
    estado = novo();
    minutos = 19 * 60 + 42;
    conversa.innerHTML = "";
    adiciona(el('<p class="wa-dia">HOJE</p>'));

    var params = new URLSearchParams(location.search);
    var item = params.get("item");
    if (item && LANCHES[item] && !iniciar.usado) {
      iniciar.usado = true;
      msgEu("Oi! Quero pedir um " + LANCHES[item].nome);
      etapa(2);
      estado.atual = { id: item, bebida: null };
      robo([
        function () { msgBot("Oi! Aqui é a Lambuza. Boa escolha: " + LANCHES[item].nome + " sai por R$ " + LANCHES[item].preco + "."); },
        function () { msgBot("Vira combo com fritas da casa e refri por + R$ " + COMBO + "?"); },
        function () {
          opcoes([
            { rotulo: "Sim, quero combo", acao: escolherBebida },
            { rotulo: "Só o lanche", acao: function () { fechaItem(); } }
          ], true);
        }
      ]);
      return;
    }
    msgEu("Oi! Quero pedir");
    saudacao();
  }

  document.querySelectorAll('[data-acao="recomecar"]').forEach(function (b) { b.addEventListener("click", iniciar); });
  iniciar();
})();
