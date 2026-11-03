// Totem simulado da Lambuza Burger: descanso → cardápio → monte o lanche → combo → revisão → pagamento → senha.
(function () {
  "use strict";

  var IMG = "../assets/img/";
  var PRECO_COMBO = 16;

  var LANCHES = [
    { id: "lambuzao", nome: "Lambuzão", preco: 38, foto: "lambuzao.jpg", selo: "Da casa", ponto: true,
      desc: "Dois blends, cheddar duplo e cebola na chapa",
      descLonga: "Dois blends de 150 g, cheddar duplo, cebola na chapa e molho da casa.",
      retirar: ["Sem cebola", "Sem molho", "Sem cheddar"] },
    { id: "classico", nome: "Clássico", preco: 29, foto: "classico.jpg", ponto: true,
      desc: "Queijo prato, salada, picles e maionese da casa",
      descLonga: "Blend de 150 g, queijo prato, alface, tomate, picles e maionese da casa.",
      retirar: ["Sem alface", "Sem tomate", "Sem picles"] },
    { id: "bacon-mel", nome: "Bacon & Mel", preco: 34, foto: "bacon-mel.jpg", ponto: true,
      desc: "Bacon crocante e maionese de mostarda e mel",
      descLonga: "Blend de 150 g, cheddar, bacon crocante, cebola caramelizada e maionese de mostarda e mel.",
      retirar: ["Sem cebola", "Sem maionese", "Sem cheddar"] },
    { id: "verdinho", nome: "Verdinho", preco: 31, foto: "verdinho.jpg", selo: "Vegetariano", veg: true, ponto: false,
      desc: "Grão-de-bico, coalho na chapa e rúcula",
      descLonga: "Burger de grão-de-bico, queijo coalho na chapa, rúcula, picles e maionese de ervas.",
      retirar: ["Sem rúcula", "Sem picles", "Sem maionese"] }
  ];
  var PONTOS = ["Mal passada", "Ao ponto", "Bem passada"];
  var ADICIONAIS = [
    { id: "bacon", nome: "Bacon crocante", curto: "bacon", preco: 6 },
    { id: "cheddar", nome: "Cheddar extra", curto: "cheddar extra", preco: 5 },
    { id: "ovo", nome: "Ovo na chapa", curto: "ovo", preco: 4 },
    { id: "cebola", nome: "Cebola caramelizada", curto: "cebola caramelizada", preco: 4 }
  ];
  var BEBIDAS = [
    { id: "cola", nome: "Refri de cola", curto: "refri de cola", extra: 0 },
    { id: "guarana", nome: "Guaraná", curto: "guaraná", extra: 0 },
    { id: "limonada", nome: "Limonada da casa", curto: "limonada", extra: 4 },
    { id: "agua", nome: "Água com gás", curto: "água com gás", extra: 0 }
  ];
  var CATEGORIAS = [
    { id: "lanches", nome: "Lanches", titulo: "Lanches", sub: "Toque no lanche para montar do seu jeito." },
    { id: "combos", nome: "Combos", titulo: "Combos", sub: "Escolha o lanche. Fritas e bebida vêm no passo seguinte, por + R$ 16." },
    { id: "acompanhamentos", nome: "Acompa&shy;nhamentos", longa: true, titulo: "Acompanhamentos", sub: "Toque para colocar no pedido." },
    { id: "bebidas", nome: "Bebidas", titulo: "Bebidas", sub: "Toque para colocar no pedido." },
    { id: "milkshakes", nome: "Milkshakes", titulo: "Milkshakes", sub: "Toque para colocar no pedido." }
  ];
  var AVULSOS = {
    acompanhamentos: [
      { id: "fritas", nome: "Fritas da casa", preco: 14, foto: "fritas.jpg", desc: "Porção crocante com sal" },
      { id: "onion", nome: "Onion rings", preco: 18, desc: "Anéis de cebola empanados" }
    ],
    bebidas: [
      { id: "refri", nome: "Refri lata", preco: 7, desc: "Cola ou guaraná, 350 ml" },
      { id: "limonada", nome: "Limonada da casa", preco: 11, desc: "Limão espremido na hora" },
      { id: "agua", nome: "Água com gás", preco: 6, desc: "Garrafa de 500 ml" }
    ],
    milkshakes: [
      { id: "milkshake", nome: "Milkshake de doce de leite", preco: 19, desc: "Sorvete de creme batido com doce de leite" }
    ]
  };
  var MILKSHAKE = AVULSOS.milkshakes[0];

  var kiosk = document.getElementById("kiosk");
  var moldura = document.getElementById("moldura");
  var estado;
  var senhaAtual = 46;
  var timers = { contagem: null, toast: null, pagamento: null, expira: null };

  function novoEstado() {
    return { tela: "descanso", modo: "aqui", categoria: "lanches", carrinho: [], rascunho: null, editando: -1, forma: "pix" };
  }

  // ---------- utilidades ----------
  function $(sel, raiz) { return (raiz || kiosk).querySelector(sel); }
  function $$(sel, raiz) { return Array.prototype.slice.call((raiz || kiosk).querySelectorAll(sel)); }
  function texto(chave, valor) { $$('[data-texto="' + chave + '"]').forEach(function (el) { el.textContent = valor; }); }
  function reais(v) { return "R$ " + v; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function lanche(id) { return LANCHES.filter(function (l) { return l.id === id; })[0]; }
  function bebida(id) { return BEBIDAS.filter(function (b) { return b.id === id; })[0]; }

  function precoLanche(item) {
    var l = lanche(item.lanche);
    var total = l.preco;
    ADICIONAIS.forEach(function (a) { total += (item.adicionais[a.id] || 0) * a.preco; });
    return total;
  }
  function precoCombo(item) {
    if (!item.combo) return 0;
    var b = bebida(item.combo);
    return PRECO_COMBO + (b ? b.extra : 0);
  }
  function precoItem(item) { return item.tipo === "lanche" ? precoLanche(item) + precoCombo(item) : item.preco * item.qtd; }
  function totalPedido() { return estado.carrinho.reduce(function (s, i) { return s + precoItem(i); }, 0); }
  function qtdItens() { return estado.carrinho.reduce(function (s, i) { return s + (i.tipo === "lanche" ? 1 + (i.combo ? 1 : 0) : i.qtd); }, 0); }

  function descricaoLanche(item, comPonto) {
    var partes = [];
    var l = lanche(item.lanche);
    if (l.ponto && comPonto !== false) partes.push(item.ponto.toLowerCase());
    var adds = ADICIONAIS.filter(function (a) { return item.adicionais[a.id]; }).map(function (a) {
      var q = item.adicionais[a.id];
      return "+ " + (q > 1 ? q + "x " : "") + a.curto;
    });
    var tirar = item.retirar.map(function (r) { return r.toLowerCase(); });
    return partes.concat(adds, tirar).join(" · ");
  }

  function toast(msg) {
    var el = $('[data-bloco="toast"]');
    el.textContent = msg;
    el.classList.add("is-visivel");
    clearTimeout(timers.toast);
    timers.toast = setTimeout(function () { el.classList.remove("is-visivel"); }, 1800);
  }

  // ---------- navegação ----------
  function ir(tela) {
    estado.tela = tela;
    kiosk.dataset.tela = tela;
    $$(".tela").forEach(function (t) { t.classList.toggle("is-ativa", t.dataset.tela === tela); });
    var corpo = $('.tela[data-tela="' + tela + '"] .k-corpo');
    if (corpo) corpo.scrollTop = 0;
    if (window.matchMedia("(max-width: 760px)").matches) window.scrollTo(0, 0);
    clearInterval(timers.expira);
    render();
  }

  function reiniciar() {
    clearInterval(timers.contagem);
    clearTimeout(timers.pagamento);
    estado = novoEstado();
    ir("descanso");
  }

  // ---------- render ----------
  function render() {
    texto("modo", estado.modo === "aqui" ? "Comer aqui" : "Levar");
    var fn = { cardapio: renderCardapio, monte: renderMonte, combo: renderCombo, revisao: renderRevisao, pagamento: renderPagamento, senha: renderSenha }[estado.tela];
    if (fn) fn();
    renderBarra();
  }

  function renderBarra() {
    var rotulo = $('[data-texto="barra-rotulo"]');
    var valor = $('[data-texto="barra-valor"]');
    var btn = $('[data-texto="barra-btn"]');
    rotulo.classList.remove("is-descricao");
    valor.classList.remove("is-total");
    btn.classList.remove("is-processando");
    var t = estado.tela;

    if (t === "cardapio") {
      rotulo.textContent = "Seu pedido";
      var n = qtdItens();
      valor.textContent = n ? n + (n > 1 ? " itens · " : " item · ") + reais(totalPedido()) : "Nenhum item ainda";
      btn.textContent = "Ver pedido";
      btn.disabled = !n;
    } else if (t === "monte") {
      var r = estado.rascunho;
      rotulo.classList.add("is-descricao");
      var d = descricaoLanche(r);
      rotulo.textContent = lanche(r.lanche).nome + (d ? " · " + d : "");
      valor.textContent = reais(precoLanche(r));
      btn.textContent = estado.editando >= 0 ? "Continuar" : "Adicionar ao pedido";
      btn.disabled = false;
    } else if (t === "combo") {
      var c = estado.rascunho;
      rotulo.classList.add("is-descricao");
      var nome = lanche(c.lanche).nome;
      if (c.combo === undefined) rotulo.textContent = nome + " · escolha uma opção";
      else if (c.combo === null) rotulo.textContent = nome + " · só o lanche";
      else if (c.combo === "") rotulo.textContent = nome + " + combo · escolha a bebida";
      else rotulo.textContent = nome + " + combo com " + bebida(c.combo).curto;
      valor.textContent = reais(precoLanche(c) + (c.combo ? precoCombo(c) : c.combo === "" ? PRECO_COMBO : 0));
      btn.textContent = "Continuar";
      btn.disabled = c.combo === undefined || c.combo === "";
    } else if (t === "revisao" || t === "pagamento") {
      rotulo.textContent = "Total";
      valor.textContent = reais(totalPedido());
      valor.classList.add("is-total");
      btn.textContent = t === "revisao" ? "Ir para o pagamento" : "Simular pagamento";
      btn.disabled = !estado.carrinho.length;
    }
  }

  function renderCardapio() {
    var cat = CATEGORIAS.filter(function (c) { return c.id === estado.categoria; })[0];
    $('[data-lista="categorias"]').innerHTML = CATEGORIAS.map(function (c) {
      return '<button type="button" class="k-categoria' + (c.longa ? " k-categoria--longa" : "") + (c.id === cat.id ? " is-ativa" : "") +
        '" data-acao="categoria" data-valor="' + c.id + '"' + (c.id === cat.id ? ' aria-current="true"' : "") + ">" + c.nome + "</button>";
    }).join("");
    texto("categoria-titulo", cat.titulo);
    texto("categoria-sub", cat.sub);

    var html;
    if (cat.id === "lanches" || cat.id === "combos") {
      html = LANCHES.map(function (l) {
        var selo = l.selo ? '<span class="k-card__selo' + (l.veg ? " k-card__selo--veg" : "") + '">' + l.selo + "</span>" : "";
        return '<button type="button" class="k-card" data-acao="lanche" data-valor="' + l.id + '" data-combo="' + (cat.id === "combos" ? "1" : "") + '">' +
          '<span class="k-card__foto"><img src="' + IMG + l.foto + '" width="1000" height="1000" alt="">' + selo + "</span>" +
          '<span class="k-card__nome">' + esc(l.nome) + "</span>" +
          '<span class="k-card__desc">' + esc(cat.id === "combos" ? "Com fritas da casa e bebida" : l.desc) + "</span>" +
          '<span class="k-card__linha"><span class="k-card__preco">' + reais(l.preco + (cat.id === "combos" ? PRECO_COMBO : 0)) + '</span><span class="k-mais-redondo" aria-hidden="true">+</span></span>' +
          "</button>";
      }).join("");
    } else {
      html = AVULSOS[cat.id].map(function (p, i) {
        var visual = p.foto
          ? '<img src="' + IMG + p.foto + '" width="1000" height="753" alt="">'
          : '<span class="k-card__tile' + (i % 2 ? " k-card__tile--tomate" : "") + '">' + esc(p.nome) + "</span>";
        return '<button type="button" class="k-card" data-acao="avulso" data-categoria="' + cat.id + '" data-valor="' + p.id + '">' +
          '<span class="k-card__foto">' + visual + "</span>" +
          '<span class="k-card__nome">' + esc(p.nome) + "</span>" +
          '<span class="k-card__desc">' + esc(p.desc) + "</span>" +
          '<span class="k-card__linha"><span class="k-card__preco">' + reais(p.preco) + '</span><span class="k-mais-redondo" aria-hidden="true">+</span></span>' +
          "</button>";
      }).join("");
    }
    $('[data-lista="produtos"]').innerHTML = html;
  }

  function renderMonte() {
    var r = estado.rascunho;
    var l = lanche(r.lanche);
    var img = $('[data-img="produto"]');
    img.src = IMG + l.foto;
    texto("produto-nome", l.nome);
    texto("produto-desc", l.descLonga);
    texto("produto-preco", reais(l.preco));

    var blocoPonto = $('[data-bloco="ponto"]');
    blocoPonto.hidden = !l.ponto;
    $('[data-lista="pontos"]').innerHTML = PONTOS.map(function (p) {
      var ativo = p === r.ponto;
      return '<button type="button" class="k-opcao' + (ativo ? " is-ativa" : "") + '" data-acao="ponto" data-valor="' + p + '" aria-pressed="' + ativo + '">' +
        '<span class="k-opcao__check" aria-hidden="true">✓</span>' + p + "</button>";
    }).join("");

    $('[data-lista="adicionais"]').innerHTML = ADICIONAIS.map(function (a) {
      var q = r.adicionais[a.id] || 0;
      return '<div class="k-adicional' + (q ? " is-ativa" : "") + '">' +
        '<div class="k-adicional__info"><span class="k-adicional__nome">' + a.nome + '</span><span class="k-adicional__preco">+ ' + reais(a.preco) + "</span></div>" +
        '<div class="k-passo">' +
          '<button type="button" class="k-passo__btn" data-acao="menos" data-valor="' + a.id + '" aria-label="Tirar ' + a.nome + '"' + (q ? "" : " disabled") + ">−</button>" +
          '<span class="k-passo__qtd' + (q ? "" : " is-zero") + '" aria-live="polite">' + q + "</span>" +
          '<button type="button" class="k-passo__btn k-passo__btn--mais" data-acao="mais" data-valor="' + a.id + '" aria-label="Adicionar ' + a.nome + '"' + (q >= 3 ? " disabled" : "") + ">+</button>" +
        "</div></div>";
    }).join("");

    $('[data-lista="retirar"]').innerHTML = l.retirar.map(function (t) {
      var ativo = r.retirar.indexOf(t) >= 0;
      return '<button type="button" class="k-chip' + (ativo ? " is-ativa" : "") + '" data-acao="retirar" data-valor="' + t + '" aria-pressed="' + ativo + '">' + t + "</button>";
    }).join("");
  }

  function renderCombo() {
    var r = estado.rascunho;
    texto("voltar-combo", "← " + lanche(r.lanche).nome);
    var sim = $(".k-combo__sim"), nao = $(".k-combo__nao");
    var querCombo = r.combo !== undefined && r.combo !== null;
    sim.classList.toggle("is-ativa", querCombo);
    sim.setAttribute("aria-pressed", querCombo);
    nao.classList.toggle("is-ativa", r.combo === null);
    nao.setAttribute("aria-pressed", r.combo === null);
    $('[data-bloco="bebidas"]').hidden = !querCombo;
    $('[data-lista="bebidas"]').innerHTML = BEBIDAS.map(function (b) {
      var ativo = r.combo === b.id;
      return '<button type="button" class="k-opcao' + (ativo ? " is-ativa" : "") + '" data-acao="bebida" data-valor="' + b.id + '" aria-pressed="' + ativo + '">' +
        '<span class="k-opcao__check" aria-hidden="true">✓</span>' + b.nome +
        (b.extra ? ' <span class="k-opcao__extra">+ ' + reais(b.extra) + "</span>" : "") + "</button>";
    }).join("");
  }

  function renderRevisao() {
    var lista = $('[data-lista="itens"]');
    if (!estado.carrinho.length) {
      lista.innerHTML = '<p class="k-vazio">Seu pedido está vazio. Toque em "Adicionar mais itens" para escolher.</p>';
    } else {
      var linhas = [];
      estado.carrinho.forEach(function (item, i) {
        if (item.tipo === "lanche") {
          var l = lanche(item.lanche);
          var d = descricaoLanche(item);
          linhas.push(linhaItem(IMG + l.foto, l.nome, d || "Do jeito da casa", precoLanche(item), i, true));
          if (item.combo) linhas.push(linhaItem(IMG + "fritas.jpg", "Combo", "Fritas da casa · " + bebida(item.combo).curto, precoCombo(item), i, false, true));
        } else {
          linhas.push(linhaItem(item.foto ? IMG + item.foto : "", item.nome, item.qtd > 1 ? item.qtd + " unidades" : "1 unidade", item.preco * item.qtd, i, false));
        }
      });
      lista.innerHTML = linhas.join("");
    }
    var temShake = estado.carrinho.some(function (i) { return i.id === "milkshake"; });
    $('[data-bloco="sugestao"]').hidden = temShake || !estado.carrinho.length;
    texto("resumo-modo", estado.modo === "aqui" ? "Comer aqui" : "Levar");
    texto("resumo-itens", String(qtdItens()));
  }

  function linhaItem(foto, nome, desc, preco, indice, editavel, ehCombo) {
    var visual = foto
      ? '<img class="k-item__foto" src="' + foto + '" width="1000" height="1000" alt="">'
      : '<span class="k-item__foto k-item__tile">' + esc(nome) + "</span>";
    var links = editavel
      ? '<button type="button" class="k-item__link" data-acao="editar" data-valor="' + indice + '">Editar</button>' +
        '<button type="button" class="k-item__link k-item__link--remover" data-acao="remover" data-valor="' + indice + '">Remover</button>'
      : ehCombo
        ? '<button type="button" class="k-item__link" data-acao="editar-combo" data-valor="' + indice + '">Editar</button>'
        : '<button type="button" class="k-item__link k-item__link--remover" data-acao="remover" data-valor="' + indice + '">Remover</button>';
    return '<div class="k-item">' + visual +
      '<div class="k-item__info"><p class="k-item__nome">' + esc(nome) + '</p><p class="k-item__desc">' + esc(desc) + '</p><div class="k-item__links">' + links + "</div></div>" +
      '<p class="k-item__preco">' + reais(preco) + "</p></div>";
  }

  function renderPagamento() {
    var formas = [{ id: "pix", nome: "Pix" }, { id: "credito", nome: "Crédito" }, { id: "debito", nome: "Débito" }];
    $('[data-lista="formas"]').innerHTML = formas.map(function (f) {
      var ativo = f.id === estado.forma;
      return '<button type="button" class="k-opcao' + (ativo ? " is-ativa" : "") + '" data-acao="forma" data-valor="' + f.id + '" aria-pressed="' + ativo + '">' +
        '<span class="k-opcao__check" aria-hidden="true">✓</span>' + f.nome + "</button>";
    }).join("");
    $('[data-bloco="pix"]').hidden = estado.forma !== "pix";
    $('[data-bloco="cartao"]').hidden = estado.forma === "pix";
    if (estado.forma === "pix") {
      var resta = 299;
      texto("expira", "4:59");
      timers.expira = setInterval(function () {
        resta = Math.max(0, resta - 1);
        texto("expira", Math.floor(resta / 60) + ":" + String(resta % 60).padStart(2, "0"));
      }, 1000);
    }
  }

  function renderSenha() {
    var linhas = [];
    estado.carrinho.forEach(function (item) {
      if (item.tipo === "lanche") {
        var l = lanche(item.lanche);
        var d = descricaoLanche(item);
        linhas.push([l.nome + (d ? " " + d.replace(/ · /g, " ") : ""), precoLanche(item)]);
        if (item.combo) linhas.push(["Combo · fritas da casa e " + bebida(item.combo).curto, precoCombo(item)]);
      } else {
        linhas.push([(item.qtd > 1 ? item.qtd + "x " : "") + item.nome, item.preco * item.qtd]);
      }
    });
    var forma = { pix: "Pix", credito: "Crédito", debito: "Débito" }[estado.forma];
    $('[data-lista="recibo"]').innerHTML = linhas.map(function (l) {
      return '<div class="k-recibo__linha"><span>' + esc(l[0]) + "</span><strong>" + reais(l[1]) + "</strong></div>";
    }).join("") + '<div class="k-recibo__linha k-recibo__linha--total"><span>' + forma + " · " + (estado.modo === "aqui" ? "comer aqui" : "levar") + "</span><strong>" + reais(totalPedido()) + "</strong></div>";
  }

  // ---------- ações ----------
  function novoRascunho(id, viaCombo) {
    var l = lanche(id);
    return { tipo: "lanche", lanche: id, ponto: l.ponto ? "Ao ponto" : "", adicionais: {}, retirar: [], combo: viaCombo ? "" : undefined };
  }
  function copiar(item) { return JSON.parse(JSON.stringify(item)); }

  function avancar() {
    var t = estado.tela;
    if (t === "cardapio" && estado.carrinho.length) ir("revisao");
    else if (t === "monte") ir("combo");
    else if (t === "combo") {
      var r = estado.rascunho;
      if (r.combo === undefined || r.combo === "") return;
      if (estado.editando >= 0) estado.carrinho[estado.editando] = r;
      else estado.carrinho.push(r);
      estado.rascunho = null;
      estado.editando = -1;
      ir("revisao");
    } else if (t === "revisao" && estado.carrinho.length) ir("pagamento");
    else if (t === "pagamento") pagar();
  }

  function pagar() {
    var btn = $('[data-texto="barra-btn"]');
    if (btn.classList.contains("is-processando")) return;
    btn.classList.add("is-processando");
    btn.textContent = "Processando…";
    clearInterval(timers.expira);
    timers.pagamento = setTimeout(function () {
      senhaAtual += 1;
      var senha = String(senhaAtual).padStart(3, "0");
      texto("senha", senha);
      guardarPedido(senha);
      ir("senha");
      var n = 15;
      texto("contagem", String(n));
      clearInterval(timers.contagem);
      timers.contagem = setInterval(function () {
        n -= 1;
        texto("contagem", String(n));
        if (n <= 0) reiniciar();
      }, 1000);
    }, 1200);
  }

  // Os bastidores leem o último pedido para contar a história com ele.
  function guardarPedido(senha) {
    try {
      var itens = [];
      estado.carrinho.forEach(function (item) {
        if (item.tipo === "lanche") {
          var d = descricaoLanche(item);
          itens.push("1x " + lanche(item.lanche).nome + (d ? " " + d.split(" · ").join(", ") : ""));
          if (item.combo) itens.push("Combo: fritas + " + bebida(item.combo).curto);
        } else itens.push(item.qtd + "x " + item.nome);
      });
      localStorage.setItem("lambuza:ultimo-totem", JSON.stringify({
        origem: "totem", numero: senha, itens: itens, total: totalPedido(), modo: estado.modo,
        primeiro: estado.carrinho[0] && estado.carrinho[0].tipo === "lanche" ? lanche(estado.carrinho[0].lanche).nome : null, quando: Date.now()
      }));
    } catch (e) { /* sem armazenamento, os bastidores usam o pedido de exemplo */ }
  }

  kiosk.addEventListener("click", function (e) {
    var alvo = e.target.closest("[data-acao]");
    if (!alvo || alvo.disabled) return;
    var acao = alvo.dataset.acao, valor = alvo.dataset.valor;
    var r = estado.rascunho;

    switch (acao) {
      case "comecar": estado.modo = alvo.dataset.modo; ir("cardapio"); break;
      case "reiniciar": reiniciar(); break;
      case "trocar-modo":
        estado.modo = estado.modo === "aqui" ? "levar" : "aqui";
        render();
        toast(estado.modo === "aqui" ? "Pedido pra comer aqui" : "Pedido pra levar");
        break;
      case "ir":
        if (alvo.dataset.destino === "cardapio" && estado.tela === "monte" && estado.editando < 0) estado.rascunho = null;
        ir(alvo.dataset.destino);
        break;
      case "categoria": estado.categoria = valor; render(); break;
      case "lanche":
        estado.rascunho = novoRascunho(valor, alvo.dataset.combo === "1");
        estado.editando = -1;
        ir("monte");
        break;
      case "avulso":
        var p = AVULSOS[alvo.dataset.categoria].filter(function (x) { return x.id === valor; })[0];
        var existente = estado.carrinho.filter(function (i) { return i.tipo === "avulso" && i.id === p.id; })[0];
        if (existente) existente.qtd += 1;
        else estado.carrinho.push({ tipo: "avulso", id: p.id, nome: p.nome, preco: p.preco, foto: p.foto, qtd: 1 });
        render();
        toast(p.nome + " no pedido");
        break;
      case "ponto": r.ponto = valor; render(); break;
      case "mais": r.adicionais[valor] = Math.min(3, (r.adicionais[valor] || 0) + 1); render(); break;
      case "menos": r.adicionais[valor] = Math.max(0, (r.adicionais[valor] || 0) - 1); if (!r.adicionais[valor]) delete r.adicionais[valor]; render(); break;
      case "retirar":
        var i = r.retirar.indexOf(valor);
        if (i >= 0) r.retirar.splice(i, 1); else r.retirar.push(valor);
        render();
        break;
      case "combo":
        r.combo = valor === "sim" ? (r.combo && r.combo !== null ? r.combo : "") : null;
        render();
        break;
      case "bebida": r.combo = valor; render(); break;
      case "editar":
        estado.editando = +valor;
        estado.rascunho = copiar(estado.carrinho[+valor]);
        ir("monte");
        break;
      case "editar-combo":
        estado.editando = +valor;
        estado.rascunho = copiar(estado.carrinho[+valor]);
        ir("combo");
        break;
      case "remover": estado.carrinho.splice(+valor, 1); render(); break;
      case "milkshake":
        estado.carrinho.push({ tipo: "avulso", id: MILKSHAKE.id, nome: MILKSHAKE.nome, preco: MILKSHAKE.preco, qtd: 1 });
        render();
        toast("Milkshake no pedido");
        break;
      case "forma": estado.forma = valor; clearInterval(timers.expira); render(); break;
      case "avancar": avancar(); break;
    }
  });

  document.querySelectorAll('.palco [data-acao="reiniciar"]').forEach(function (b) { b.addEventListener("click", reiniciar); });

  // ---------- escala da moldura no desktop ----------
  function escalar() {
    if (window.matchMedia("(max-width: 760px)").matches) return;
    var legenda = document.querySelector(".palco__legenda");
    var larguraLegenda = legenda && getComputedStyle(legenda).display !== "none" ? legenda.offsetWidth + 72 : 0;    var altura = window.innerHeight - 40 - 48;
    var largura = window.innerWidth - 48 - larguraLegenda;
    var s = Math.min(altura / 2060, largura / 1136, 1);
    moldura.style.setProperty("--s", Math.max(0.2, s).toFixed(4));
  }
  window.addEventListener("resize", escalar);

  estado = novoEstado();
  escalar();
  ir("descanso");
})();
