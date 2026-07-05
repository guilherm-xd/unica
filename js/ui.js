function htmlQuadrado(letra, classe, atraso, revelando) {
  var classes = classe;
  if (revelando && classe) classes += " revelar";
  var estiloAnim =
    revelando && classe ? ' style="animation-delay:' + atraso + 'ms"' : "";
  return (
    '<div class="quadrado ' +
    classes +
    '"' +
    estiloAnim +
    ">" +
    letra +
    "</div>"
  );
}

function htmlTabuleiro() {
  var linhas = "";

  for (var r = 0; r < 6; r++) {
    var feito = estado.palpites[r];
    var ativa = r === estado.palpites.length && estado.fase === "jogando";
    var celulas = "";

    if (feito) {
      var ultima = r === estado.palpites.length - 1;
      var revelando = ultima && estado.acabouDeEnviar;
      var palavraExibida = Yf[feito.palavra] || feito.palavra;
      for (var c = 0; c < 5; c++) {
        celulas += htmlQuadrado(
          palavraExibida[c],
          feito.feedback[c],
          c * 90,
          revelando,
        );
      }
    } else if (ativa) {
      for (var c = 0; c < 5; c++) {
        var ch = estado.letrasAtuais[c] || "";
        var cursor = c === estado.posicaoCursor;
        var classe = ch ? "preenchido" : "";
        if (cursor) classe = classe ? classe + " curso" : "curso";
        var vazioAntes = estado.letrasAnteriores[c] === "";
        var agoraPreenchido = ch !== "";
        if (agoraPreenchido && vazioAntes) {
          classe = classe ? classe + " entrando" : "entrando";
        }
        celulas +=
          '<div class="quadrado ' +
          classe +
          '" data-row="' +
          r +
          '" data-col="' +
          c +
          '">' +
          ch +
          "</div>";
      }
    } else {
      for (var c = 0; c < 5; c++) {
        celulas += htmlQuadrado("", "", 0, false);
      }
    }

    linhas += '<div class="linha">' + celulas + "</div>";
  }

  return '<div class="tabuleiro">' + linhas + "</div>";
}

function htmlTeclado() {
  var statuses = obterStatusTeclas();
  var desabilitado = estado.fase !== "jogando";

  function botao(k) {
    var rotulo = k === "ENTER" ? "↵" : k === "BACK" ? "⌫" : k;
    var larga = k === "ENTER" || k === "BACK" ? "larga" : "";
    var classe = statuses[k] || "";
    return (
      '<button type="button" class="tecla ' +
      larga +
      " " +
      classe +
      '" data-k="' +
      k +
      '" ' +
      (desabilitado ? "disabled" : "") +
      ">" +
      rotulo +
      "</button>"
    );
  }

  function linha(teclas) {
    return (
      '<div class="linha-teclado">' + teclas.map(botao).join("") + "</div>"
    );
  }

  var LINHA1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  var LINHA2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  var LINHA3 = ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"];

  return (
    '<div class="teclado">' +
    linha(LINHA1) +
    linha(LINHA2) +
    linha(LINHA3) +
    "</div>"
  );
}

function htmlPontos() {
  var pontos = "";
  for (var i = 0; i < 6; i++) {
    var usado = i < estado.palpites.length ? "usado" : "";
    pontos += '<div class="ponto ' + usado + '"></div>';
  }
  return '<div class="pontos">' + pontos + "</div>";
}

function htmlBotaoPaleta() {
  var nome = PALETAS[estado.paleta].nome;
  return (
    '<button class="btn-paleta" id="btnPaleta" title="Paleta: ' +
    nome +
    ' — clique para mudar">🎨 <span class="amostra-cor"></span></button>'
  );
}

function htmlBotaoAjuda() {
  return '<button class="btn-ajuda" id="btnAjuda" title="Como jogar">?</button>';
}

function htmlBotaoEstatisticas() {
  return '<button class="btn-estatisticas" id="btnStats">📊</button>';
}

function alternarAjuda() {
  var overlay = document.getElementById("modalAjuda");
  overlay.classList.toggle("aberto");
}

function gerarModalEstatisticas() {
  var totalLetras = estatisticas.totalLetrasTentadas || 1;
  var precisao = Math.round(
    ((estatisticas.totalLetrasCertas + estatisticas.totalLetrasPresentes) /
      totalLetras) *
      100,
  );

  var html = `
    <div id="modalStats" class="modal-overlay">
      <div class="modal-conteudo">
        <button class="fechar-modal" id="fecharStats">&times;</button>
        <h2>Estatísticas</h2>
        <div class="stats-grid">
          <div><span class="numero">${estatisticas.partidas}</span><br>jogos</div>
          <div><span class="numero">${precisao}%</span><br>precisão</div>
          <div><span class="numero">${estatisticas.sequenciaAtual}</span><br>sequência atual</div>
          <div><span class="numero">${estatisticas.melhorSequencia}</span><br>melhor sequência</div>
        </div>

        <h3>Detalhes</h3>
        <div class="stats-grid detalhes">
          <div><span class="numero">${estatisticas.totalTentativas}</span><br>tentativas</div>
          <div><span class="numero">${estatisticas.partidas > 0 ? (estatisticas.totalTentativas / estatisticas.partidas).toFixed(1) : "0"}</span><br>média de tentativas</div>
          <div><span class="numero">${estatisticas.totalLetrasTentadas}</span><br>letras tentadas</div>
          <div><span class="numero">${estatisticas.totalLetrasCertas}</span><br>✅ certas</div>
          <div><span class="numero">${estatisticas.totalLetrasPresentes}</span><br>🟨 deslocadas</div>
          <div><span class="numero">${estatisticas.totalLetrasErradas}</span><br>❌ erradas</div>
        </div>

        <div id="auth-area" style="margin-top: 1.5rem; text-align: center;"></div>
      </div>
    </div>
  `;
  return html;
}

function mostrarModalEstatisticas() {
  var existente = document.getElementById("modalStats");
  if (existente) existente.remove();
  document.body.insertAdjacentHTML("beforeend", gerarModalEstatisticas());
  var modal = document.getElementById("modalStats");
  modal.classList.add("aberto");

  function fechar() {
    modal.classList.remove("aberto");
    setTimeout(function () {
      if (modal.parentNode) modal.parentNode.removeChild(modal);
    }, 350);
  }

  modal.querySelector("#fecharStats").addEventListener("click", fechar);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) fechar();
  });

  atualizarInterfaceUsuario();
}

function renderizar() {
  var root = document.getElementById("root");
  if (!root) return;

  if (estado.fase === "carregando") {
    root.innerHTML = '<div class="loadingScreen">carregando…</div>';
    return;
  }

  if (estado.fase === "bloqueado") {
    root.innerHTML = `
      <div class="tela-bloqueada">
        <div class="titulo-bloqueio">adeus.</div>
        <div class="palavra-bloqueada">${estado.palavraBloqueada}</div>
        <div class="texto-bloqueio">você usou sua única chance e errou. essa palavra continuará única para sempre, e ÚNICA não vai mais ser jogável neste dispositivo.</div>
        <div class="rodape-bloqueio">perdido em ${estado.dataBloqueio}</div>
      </div>`;
    return;
  }

  var toast = estado.mensagem
    ? '<div class="mensagem ' +
      (estado.treme ? "tremida" : "") +
      (estado.perigo ? " perigo" : "") +
      '">' +
      estado.mensagem +
      "</div>"
    : "";

  var bannerVitoria =
    estado.fase === "ganhou"
      ? '<div class="banner-vitoria">encontrada em ' +
        estado.palpites.length +
        " " +
        (estado.palpites.length === 1 ? "tentativa" : "tentativas") +
        ": <b>" +
        estado.palavraAlvo +
        "</b><br>volte amanhã para a próxima palavra.</div>"
      : "";

  root.innerHTML = `
    <div class="jogo">
      <div class="cabecalho">
        ${htmlBotaoAjuda()}
        ${htmlBotaoEstatisticas()}
        ${htmlBotaoPaleta()}
        <div class="titulo">ÚNICA</div>
        <div class="subtitulo">uma palavra por dia, apenas uma chance.</div>
        ${htmlPontos()}
      </div>
      ${toast}
      ${htmlTabuleiro()}
      ${bannerVitoria}
      ${htmlTeclado()}
    </div>
    <div id="modalAjuda" class="modal-ajuda">
      <div class="caixa-modal">
        <button class="fechar" id="fecharAjuda">&times;</button>
        <h2>Como jogar</h2>
        <p>Descubra a palavra certa em até 6 tentativas. Depois de cada tentativa, as peças mostram o quão perto você está da solução.
        <br>
        <br>
        Caso você não consiga adivinhar a palavra, você perderá o jogo e nunca mais conseguirá jogá-lo neste dispositivo.</p>
        <p>Exemplos:</p>
        <div class="exemplo">
          <span class="letra-exemplo certo">U</span>
          <span class="letra-exemplo">N</span>
          <span class="letra-exemplo">I</span>
          <span class="letra-exemplo">C</span>
          <span class="letra-exemplo">A</span>
        </div>
        <p>A letra <strong>U</strong> está na posição correta.</p>
        <div class="exemplo">
          <span class="letra-exemplo">C</span>
          <span class="letra-exemplo presente">A</span>
          <span class="letra-exemplo">M</span>
          <span class="letra-exemplo">A</span>
          <span class="letra-exemplo">S</span>
        </div>
        <p>A letra <strong>A</strong> faz parte da palavra, mas em outra posição.</p>
        <div class="exemplo">
          <span class="letra-exemplo">C</span>
          <span class="letra-exemplo">A</span>
          <span class="letra-exemplo">R</span>
          <span class="letra-exemplo ausente">G</span>
          <span class="letra-exemplo">O</span>
        </div>
        <p>A letra <strong>G</strong> não faz parte da palavra.</p>
        <p>Os acentos são ignorados nas dicas. Você tem apenas <strong>uma chance</strong>, use-a com sabedoria!</p>
        <div class="creditos">
          <span>Inspirado no <a href="https://term.ooo" target="_blank">Termo</a> e no <a href="https://www.nytimes.com/games/wordle" target="_blank">Wordle</a>.</span>
          <span class="autor">Feito com ❤️ por mim, <a href="https://github.com/guilherm-xd" target="_blank">Guilherme</a>.</span>
          
        </div>
        <button class="fechar-ajuda" id="fecharAjuda2">Fechar</button>
      </div>
    </div>
  `;

  estado.letrasAnteriores = estado.letrasAtuais.slice();
  estado.acabouDeEnviar = false;

  document.getElementById("btnStats").addEventListener("click", function (e) {
    e.stopPropagation();
    mostrarModalEstatisticas();
  });
}

document.addEventListener("click", function (e) {
  if (e.target.closest("#btnPaleta")) {
    estado.paleta = (estado.paleta + 1) % PALETAS.length;
    aplicarPaleta(estado.paleta);
    renderizar();
    return;
  }

  if (
    e.target.closest("#btnAjuda") ||
    e.target.closest("#fecharAjuda") ||
    e.target.closest("#fecharAjuda2")
  ) {
    alternarAjuda();
    return;
  }

  var quadrado = e.target.closest(".quadrado[data-row]");
  if (quadrado && estado.fase === "jogando") {
    estado.posicaoCursor = parseInt(quadrado.dataset.col, 10);
    renderizar();
    return;
  }

  var tecla = e.target.closest(".tecla");
  if (tecla && !tecla.disabled) pressionarTecla(tecla.dataset.k);
});

window.addEventListener("keydown", function (e) {
  if (estado.fase !== "jogando") return;

  if (e.key === "Enter") {
    enviarPalpite();
    return;
  }

  if (e.key === "Backspace") {
    lidarComBackspace();
    renderizar();
    return;
  }

  if (e.key === "ArrowLeft") {
    e.preventDefault();
    estado.posicaoCursor = Math.max(0, estado.posicaoCursor - 1);
    renderizar();
    return;
  }

  if (e.key === "ArrowRight") {
    e.preventDefault();
    estado.posicaoCursor = Math.min(4, estado.posicaoCursor + 1);
    renderizar();
    return;
  }

  if (/^[a-zA-Z]$/.test(e.key)) {
    lidarComLetra(e.key.toUpperCase());
    renderizar();
  }
});

document.addEventListener("click", function (e) {
  var overlay = document.getElementById("modalAjuda");
  if (e.target === overlay) alternarAjuda();
});