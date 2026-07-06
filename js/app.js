function obterDadosDoDiaAtual() {
  var agora = new Date();
  var y = agora.getFullYear();
  var m = agora.getMonth();
  var d = agora.getDate();

  var hoje = Math.floor(Date.UTC(y, m, d) / 86400000);
  var dn = hoje - EPOCA + 1;
  var listaRespostas = Pf;
  var idx =
    (((dn - 1) % listaRespostas.length) + listaRespostas.length) %
    listaRespostas.length;
  var palavra = listaRespostas[idx];
  var chave =
    y + "-" + String(m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");

  return { palavra: palavra, chave: chave };
}

function prepararEstadoDoDia() {
  var dadosDoDia = obterDadosDoDiaAtual();
  estado.palavraAlvo = dadosDoDia.palavra;
  estado.chaveData = dadosDoDia.chave;
  return dadosDoDia;
}

function iniciar() {
  carregarEstatisticas();

  var preferencia = carregarPreferenciaPaleta();
  aplicarPaleta(preferencia.modo, preferencia.cor);

  var dadosDoDia = prepararEstadoDoDia();

  var bloqueado = carregarBloqueio();
  if (bloqueado) {
    estado.palavraBloqueada = bloqueado.blockedWord || "?????";
    estado.dataBloqueio = bloqueado.blockedDate || "";
    estado.fase = "bloqueado";
    renderizar();
    return;
  }

  var jaVeioDaNuvem =
    dadosCarregadosDoCloud && estado.chaveData === dadosDoDia.chave;

  if (jaVeioDaNuvem) {
    renderizar();
    return;
  }

  var progresso = carregarProgresso(dadosDoDia.chave);

  if (progresso && !progressoCompativelComPalavra(progresso, dadosDoDia.palavra)) {
    limparProgresso(dadosDoDia.chave);
    progresso = null;
  }

  if (progresso) {
    aplicarProgressoAoEstado(progresso);
  } else {
    estado.palpites = [];
    estado.fase = "jogando";
    estado.letrasAtuais = ["", "", "", "", ""];
    estado.posicaoCursor = 0;
    estado.palavraBloqueada = "";
    estado.dataBloqueio = "";
  }

  renderizar();
}

iniciar();