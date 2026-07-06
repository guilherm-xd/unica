function iniciar() {
  carregarEstatisticas();

  var preferencia = carregarPreferenciaPaleta();
  aplicarPaleta(preferencia.modo, preferencia.cor);

  var bloqueado = carregarBloqueio();
  if (bloqueado) {
    estado.palavraBloqueada = bloqueado.blockedWord || "?????";
    estado.dataBloqueio = bloqueado.blockedDate || "";
    estado.fase = "bloqueado";
    renderizar();
    return;
  }

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

  var progresso = carregarProgresso(chave);

  estado.palavraAlvo = palavra;
  estado.chaveData = chave;

  if (progresso && !progressoCompativelComPalavra(progresso, palavra)) {
    limparProgresso(chave);
    progresso = null;
  }

  if (progresso) {
    estado.palpites = progresso.palpites || [];
    estado.fase = progresso.status === "ganhou" ? "ganhou" : "jogando";
  } else {
    estado.fase = "jogando";
  }

  renderizar();
}

iniciar();
