var estado = {
  fase: "carregando",
  palavraAlvo: "",
  chaveData: "",
  palpites: [],
  letrasAtuais: ["", "", "", "", ""],
  posicaoCursor: 0,
  mensagem: "",
  treme: false,
  perigo: false,
  palavraBloqueada: "",
  dataBloqueio: "",
  paleta: 0,
  modoPaleta: "escuro",
  corPaleta: "azul",
  letrasAnteriores: ["", "", "", "", ""],
  acabouDeEnviar: false,
};

var temporizadorMensagem = null;
var temporizadorTreme = null;

function pegarStorage(chave) {
  try {
    return localStorage.getItem("unica_v1_" + chave);
  } catch (e) {
    return null;
  }
}

function guardarStorage(chave, valor) {
  try {
    localStorage.setItem("unica_v1_" + chave, valor);
  } catch (e) {}
}

function removerStorage(chave) {
  try {
    localStorage.removeItem("unica_v1_" + chave);
  } catch (e) {}
}

function carregarBloqueio() {
  var raw = pegarStorage("blocked");
  if (!raw) return null;
  try {
    var p = JSON.parse(raw);
    return p.blocked ? p : null;
  } catch (e) {
    return null;
  }
}

function guardarBloqueio(palavra, chave) {
  guardarStorage(
    "blocked",
    JSON.stringify({ blocked: true, blockedWord: palavra, blockedDate: chave }),
  );
}

function carregarProgresso(chave) {
  var raw = pegarStorage("progress_" + chave);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function guardarProgresso(chave, dados) {
  guardarStorage("progress_" + chave, JSON.stringify(dados));
}

function limparProgresso(chave) {
  removerStorage("progress_" + chave);
}

function statusProgressoAtual() {
  if (estado.fase === "ganhou") return "ganhou";
  if (estado.fase === "travando" || estado.fase === "bloqueado") return "perdeu";
  return "jogando";
}

function snapshotProgressoAtual() {
  return {
    palpites: estado.palpites.slice(),
    status: statusProgressoAtual(),
    palavraAlvo: estado.palavraAlvo,
    letrasAtuais: estado.letrasAtuais.slice(),
    posicaoCursor: estado.posicaoCursor,
    palavraBloqueada: estado.palavraBloqueada,
    dataBloqueio: estado.dataBloqueio,
  };
}

function aplicarProgressoAoEstado(progresso) {
  var status = progresso.status || progresso.fase || "jogando";
  estado.palpites = Array.isArray(progresso.palpites) ? progresso.palpites : [];
  estado.letrasAtuais =
    Array.isArray(progresso.letrasAtuais) && progresso.letrasAtuais.length === 5
      ? progresso.letrasAtuais.slice()
      : ["", "", "", "", ""];
  estado.posicaoCursor =
    typeof progresso.posicaoCursor === "number" ? progresso.posicaoCursor : 0;
  estado.palavraBloqueada = progresso.palavraBloqueada || "";
  estado.dataBloqueio = progresso.dataBloqueio || "";

  if (progresso.palavraAlvo) {
    estado.palavraAlvo = progresso.palavraAlvo;
  }

  if (status === "ganhou") {
    estado.fase = "ganhou";
  } else if (status === "perdeu" || status === "travando") {
    estado.fase = estado.palavraBloqueada ? "bloqueado" : "travando";
  } else if (status === "bloqueado") {
    estado.fase = "bloqueado";
  } else {
    estado.fase = "jogando";
  }
}

function persistirEstadoLocalAtual() {
  if (!estado.chaveData) return;

  guardarProgresso(estado.chaveData, snapshotProgressoAtual());

  if (estado.fase === "bloqueado" && estado.palavraBloqueada) {
    guardarBloqueio(estado.palavraBloqueada, estado.dataBloqueio || estado.chaveData);
  } else {
    removerStorage("blocked");
  }
}

var STATS_KEY = "unica_stats";

var estatisticas = {
  partidas: 0,
  vitorias: 0,
  sequenciaAtual: 0,
  melhorSequencia: 0,
  distribuicao: [0, 0, 0, 0, 0, 0],
  totalTentativas: 0,
  totalLetrasTentadas: 0,
  totalLetrasCertas: 0,
  totalLetrasPresentes: 0,
  totalLetrasErradas: 0,
};

function carregarEstatisticas() {
  var raw = pegarStorage(STATS_KEY);
  if (!raw) return;
  try {
    var data = JSON.parse(raw);
    for (var k in data) {
      if (data.hasOwnProperty(k) && estatisticas.hasOwnProperty(k)) {
        estatisticas[k] = data[k];
      }
    }
  } catch (e) {}
}

function salvarEstatisticas() {
  guardarStorage(STATS_KEY, JSON.stringify(estatisticas));
}

function atualizarEstatisticas(venceu, tentativas, feedbacks) {
  estatisticas.partidas++;
  estatisticas.totalTentativas += tentativas;
  estatisticas.totalLetrasTentadas += tentativas * 5;
  var certas = 0,
    presentes = 0,
    erradas = 0;
  if (feedbacks) {
    for (var i = 0; i < feedbacks.length; i++) {
      for (var j = 0; j < feedbacks[i].length; j++) {
        var status = feedbacks[i][j];
        if (status === "certo") certas++;
        else if (status === "presente") presentes++;
        else if (status === "ausente") erradas++;
      }
    }
  }
  estatisticas.totalLetrasCertas += certas;
  estatisticas.totalLetrasPresentes += presentes;
  estatisticas.totalLetrasErradas += erradas;

  if (venceu) {
    estatisticas.vitorias++;
    estatisticas.sequenciaAtual++;
    if (estatisticas.sequenciaAtual > estatisticas.melhorSequencia) {
      estatisticas.melhorSequencia = estatisticas.sequenciaAtual;
    }
    if (tentativas >= 1 && tentativas <= 6) {
      estatisticas.distribuicao[tentativas - 1]++;
    }
  } else {
    estatisticas.sequenciaAtual = 0;
  }

  salvarEstatisticas();
  if (usuarioAtual) {
    salvarDadosNoFirestore(usuarioAtual.uid);
  }
}

function calcularFeedback(palpite, resposta) {
  var g = normalizar(palpite);
  var a = normalizar(resposta);
  var resultado = Array(5).fill("ausente");
  var usado = Array(5).fill(false);

  for (var i = 0; i < 5; i++) {
    if (g[i] === a[i]) {
      resultado[i] = "certo";
      usado[i] = true;
    }
  }

  for (var i = 0; i < 5; i++) {
    if (resultado[i] === "certo") continue;
    var idx = a.split("").findIndex(function (ch, j) {
      return ch === g[i] && !usado[j];
    });
    if (idx !== -1) {
      resultado[i] = "presente";
      usado[idx] = true;
    }
  }

  return resultado;
}

function arraysIguais(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length)
    return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function progressoCompativelComPalavra(progresso, palavraAtual) {
  if (!progresso || !Array.isArray(progresso.palpites)) return false;

  if (
    progresso.palavraAlvo &&
    normalizar(progresso.palavraAlvo) !== normalizar(palavraAtual)
  ) {
    return false;
  }

  for (var i = 0; i < progresso.palpites.length; i++) {
    var palpite = progresso.palpites[i];
    if (!palpite || typeof palpite.palavra !== "string") return false;

    var feedbackEsperado = calcularFeedback(palpite.palavra, palavraAtual);
    if (!arraysIguais(palpite.feedback, feedbackEsperado)) return false;
  }

  return true;
}

function obterStatusTeclas() {
  var ordem = { certo: 3, presente: 2, ausente: 1 };
  var mapa = {};

  estado.palpites.forEach(function (p) {
    var letras = p.palavra.split("");
    for (var i = 0; i < letras.length; i++) {
      var ch = letras[i];
      var chNorm = normalizar(ch);
      var s = p.feedback[i];
      if (!mapa[chNorm] || ordem[s] > ordem[mapa[chNorm]]) {
        mapa[chNorm] = s;
      }
    }
  });

  return mapa;
}

function mostrarMensagem(msg, perigo) {
  estado.mensagem = msg;
  estado.perigo = !!perigo;
  clearTimeout(temporizadorMensagem);
  temporizadorMensagem = setTimeout(function () {
    estado.mensagem = "";
    renderizar();
  }, 1800);
}

function tremer(msg) {
  mostrarMensagem(msg, false);
  estado.treme = true;
  clearTimeout(temporizadorTreme);
  temporizadorTreme = setTimeout(function () {
    estado.treme = false;
    renderizar();
  }, 500);
  renderizar();
}

function lidarComLetra(letra) {
  estado.letrasAtuais[estado.posicaoCursor] = letra;
  for (var i = estado.posicaoCursor + 1; i < 5; i++) {
    if (!estado.letrasAtuais[i]) {
      estado.posicaoCursor = i;
      return;
    }
  }
}

function lidarComBackspace() {
  if (estado.letrasAtuais[estado.posicaoCursor]) {
    estado.letrasAtuais[estado.posicaoCursor] = "";
  } else if (estado.posicaoCursor > 0) {
    estado.posicaoCursor--;
    estado.letrasAtuais[estado.posicaoCursor] = "";
  }
}

function enviarPalpite() {
  if (estado.fase !== "jogando") return;

  if (
    estado.letrasAtuais.some(function (t) {
      return !t;
    })
  ) {
    tremer("faltam letras.");
    return;
  }

  var palpite = estado.letrasAtuais.join("");
  var palpiteNorm = normalizar(palpite);
  if (!CONJUNTO_VALIDO.has(palpiteNorm)) {
    tremer("essa palavra não está na lista.");
    return;
  }

  var palavraExibida = Yf[palpiteNorm.toLowerCase()] || palpite;

  var feedback = calcularFeedback(palpite, estado.palavraAlvo);
  var novosPalpites = estado.palpites.concat([
    { palavra: palavraExibida, feedback: feedback },
  ]);
  var venceu = palpiteNorm === normalizar(estado.palavraAlvo);

  estado.palpites = novosPalpites;
  estado.acabouDeEnviar = true;
  estado.letrasAtuais = ["", "", "", "", ""];
  estado.posicaoCursor = 0;
  estado.letrasAnteriores = ["", "", "", "", ""];

  if (venceu) {
    estado.fase = "ganhou";
    mostrarMensagem("encontrada.", false);
    persistirEstadoLocalAtual();
    atualizarEstatisticas(
      true,
      novosPalpites.length,
      novosPalpites.map(function (p) {
        return p.feedback;
      }),
    );
    setTimeout(mostrarModalEstatisticas, 800);
  } else if (novosPalpites.length >= 6) {
    estado.fase = "travando";
    mostrarMensagem("essa era a sua única tentativa.", true);
    persistirEstadoLocalAtual();
    atualizarEstatisticas(
      false,
      novosPalpites.length,
      novosPalpites.map(function (p) {
        return p.feedback;
      }),
    );
    setTimeout(mostrarModalEstatisticas, 800);
    setTimeout(function () {
      estado.palavraBloqueada = estado.palavraAlvo;
      estado.dataBloqueio = estado.chaveData;
      estado.fase = "bloqueado";
      persistirEstadoLocalAtual();
      if (usuarioAtual) {
        salvarDadosNoFirestore(usuarioAtual.uid);
      }
      renderizar();
    }, 1700);
  } else {
    persistirEstadoLocalAtual();
  }

  renderizar();

  if (usuarioAtual) {
    salvarDadosNoFirestore(usuarioAtual.uid);
  }
}

function pressionarTecla(k) {
  if (estado.fase !== "jogando") return;
  if (k === "ENTER") return enviarPalpite();
  if (k === "BACK") {
    lidarComBackspace();
    persistirEstadoLocalAtual();
    renderizar();
    return;
  }
  lidarComLetra(k);
  persistirEstadoLocalAtual();
  renderizar();
}