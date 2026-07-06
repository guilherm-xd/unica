var MODO_PALETA_PADRAO = "escuro";
var COR_PALETA_PADRAO = "abismo";

var PALETAS_MODOS = {
  escuro: {
    nome: "Escuro",
    "--bg": "#0d1117",
    "--tile-bg": "#161b22",
    "--text": "#e6edf3",
    "--text-muted": "#8b949e",
    "--border": "#30363d",
    "--absent-bg": "#21262d",
    "--absent-text": "#8b949e",
    "--absent-border": "#21262d",
    "--key-bg": "#21262d",
    "--key-text": "#e6edf3",
    "--key-absent-bg": "#0d1117",
    "--key-absent-text": "#6e7681",
    "--toast-bg": "#21262d",
    "--toast-border": "#30363d",
    "--dot": "#21262d",
    "--debug-text": "#30363d",
    "--debug-border": "#21262d",
    "--palette-btn-bg": "rgba(255, 255, 255, 0.06)",
    "--palette-btn-border": "rgba(255, 255, 255, 0.12)",
    "--palette-btn-hover": "rgba(255, 255, 255, 0.12)",
  },
  claro: {
    nome: "Claro",
    "--bg": "#f5f0e8",
    "--tile-bg": "#ede5d5",
    "--text": "#2c2010",
    "--text-muted": "#6a5a48",
    "--border": "#c8b89a",
    "--absent-bg": "#ddd5c8",
    "--absent-text": "#8a7a68",
    "--absent-border": "#ddd5c8",
    "--key-bg": "#e0d8cc",
    "--key-text": "#2c2010",
    "--key-absent-bg": "#d0c8bc",
    "--key-absent-text": "#9a8a78",
    "--toast-bg": "#ede5d5",
    "--toast-border": "#c8b89a",
    "--dot": "#c8b89a",
    "--debug-text": "#c8b89a",
    "--debug-border": "#d8d0c8",
    "--palette-btn-bg": "rgba(44, 32, 16, 0.06)",
    "--palette-btn-border": "rgba(44, 32, 16, 0.14)",
    "--palette-btn-hover": "rgba(44, 32, 16, 0.1)",
  },
};

var PALETAS_CORES = {
  azul: {
    nome: "Azul",
    "--accent": "#33aaff",
    "--accent-text": "#cceaff",
    "--border-filled": "#33aaff",
    "--correct": "#39b36f",
    "--correct-text": "#071021",
    "--present": "#d4a229",
    "--present-text": "#071021",
    "--dot-used": "#33aaff",
    "--win-text": "#8ce8b6",
    "--blocked-word": "#d4a229",
    "--cursor-border": "#85ccff",
    "--focus-ring": "#85ccff",
  },
  abismo: {
    nome: "Abismo",
    "--accent": "#3377ff",
    "--accent-text": "#ccddff",
    "--border-filled": "#3377ff",
    "--correct": "#2ea043",
    "--correct-text": "#0d1117",
    "--present": "#d29922",
    "--present-text": "#0d1117",
    "--dot-used": "#3377ff",
    "--win-text": "#56d364",
    "--blocked-word": "#d29922",
    "--cursor-border": "#85adff",
    "--focus-ring": "#85adff",
  },
  verde: {
    nome: "Verde",
    "--accent": "#32b85f",
    "--accent-text": "#d5f7df",
    "--border-filled": "#32b85f",
    "--correct": "#32b85f",
    "--correct-text": "#0b1a12",
    "--present": "#d9a52e",
    "--present-text": "#0b1a12",
    "--dot-used": "#32b85f",
    "--win-text": "#99efb6",
    "--blocked-word": "#d9a52e",
    "--cursor-border": "#62d985",
    "--focus-ring": "#62d985",
  },
  ferrugem: {
    nome: "Ferrugem",
    "--accent": "#d36b2d",
    "--accent-text": "#ffe0c8",
    "--border-filled": "#6b5c4e",
    "--correct": "#6b8e4e",
    "--correct-text": "#15110f",
    "--present": "#c99a3e",
    "--present-text": "#15110f",
    "--dot-used": "#d36b2d",
    "--win-text": "#c9d9b0",
    "--blocked-word": "#c99a3e",
    "--cursor-border": "#ff9a5c",
    "--focus-ring": "#ff9a5c",
  },
  vermelho: {
    nome: "Vermelho",
    "--accent": "#e53935",
    "--accent-text": "#ffe3e1",
    "--border-filled": "#e53935",
    "--correct": "#4caf50",
    "--correct-text": "#1b0808",
    "--present": "#e5a62a",
    "--present-text": "#1b0808",
    "--dot-used": "#e53935",
    "--win-text": "#9ee8a3",
    "--blocked-word": "#e5a62a",
    "--cursor-border": "#ff6b66",
    "--focus-ring": "#ff6b66",
  },
  laranja: {
    nome: "Laranja",
    "--accent": "#f27622",
    "--accent-text": "#ffe2cc",
    "--border-filled": "#f27622",
    "--correct": "#62b85c",
    "--correct-text": "#1c0d04",
    "--present": "#d4a52d",
    "--present-text": "#1c0d04",
    "--dot-used": "#f27622",
    "--win-text": "#b8e8a8",
    "--blocked-word": "#d4a52d",
    "--cursor-border": "#ff9b57",
    "--focus-ring": "#ff9b57",
  },
  cobalto: {
    nome: "Indigo",
    "--accent": "#3344ff",
    "--accent-text": "#ccd0ff",
    "--border-filled": "#3344ff",
    "--correct": "#39c184",
    "--correct-text": "#0b0d24",
    "--present": "#d6a43a",
    "--present-text": "#0b0d24",
    "--dot-used": "#3344ff",
    "--win-text": "#95edc5",
    "--blocked-word": "#d6a43a",
    "--cursor-border": "#858fff",
    "--focus-ring": "#858fff",
  },
  violeta: {
    nome: "Violeta",
    "--accent": "#8833ff",
    "--accent-text": "#e1ccff",
    "--border-filled": "#8833ff",
    "--correct": "#5bcf97",
    "--correct-text": "#130f1d",
    "--present": "#d7a33b",
    "--present-text": "#130f1d",
    "--dot-used": "#8833ff",
    "--win-text": "#b9f0d0",
    "--blocked-word": "#d7a33b",
    "--cursor-border": "#b885ff",
    "--focus-ring": "#b885ff",
  },
  cinza: {
    nome: "Cinza",
    "--accent": "#a8b0bb",
    "--accent-text": "#f0f3f6",
    "--border-filled": "#a8b0bb",
    "--correct": "#52b788",
    "--correct-text": "#101214",
    "--present": "#d6a23c",
    "--present-text": "#101214",
    "--dot-used": "#a8b0bb",
    "--win-text": "#a8e6c2",
    "--blocked-word": "#d6a23c",
    "--cursor-border": "#c4ccd6",
    "--focus-ring": "#c4ccd6",
  },
  rosa: {
    nome: "Rosa",
    "--accent": "#ff6fae",
    "--accent-text": "#ffe3f0",
    "--border-filled": "#ff6fae",
    "--correct": "#55c98b",
    "--correct-text": "#1a0d14",
    "--present": "#d8a33c",
    "--present-text": "#1a0d14",
    "--dot-used": "#ff6fae",
    "--win-text": "#a9efd0",
    "--blocked-word": "#d8a33c",
    "--cursor-border": "#ff96c5",
    "--focus-ring": "#ff96c5",
  },
  agua: {
    nome: "Ciano",
    "--accent": "#18b9d2",
    "--accent-text": "#d7faff",
    "--border-filled": "#18b9d2",
    "--correct": "#35c98a",
    "--correct-text": "#06171b",
    "--present": "#d8a23c",
    "--present-text": "#06171b",
    "--dot-used": "#18b9d2",
    "--win-text": "#9df0df",
    "--blocked-word": "#d8a23c",
    "--cursor-border": "#55d7eb",
    "--focus-ring": "#55d7eb",
  },
  verdeagua: {
    nome: "Verde agua",
    "--accent": "#24d6ad",
    "--accent-text": "#d8fff5",
    "--border-filled": "#24d6ad",
    "--correct": "#24d6ad",
    "--correct-text": "#061814",
    "--present": "#d7a63a",
    "--present-text": "#061814",
    "--dot-used": "#24d6ad",
    "--win-text": "#9effe5",
    "--blocked-word": "#d7a63a",
    "--cursor-border": "#61edce",
    "--focus-ring": "#61edce",
  },
  amarelo: {
    nome: "Amarelo",
    "--accent": "#f0c94a",
    "--accent-text": "#fff2bd",
    "--border-filled": "#f0c94a",
    "--correct": "#57bd70",
    "--correct-text": "#171308",
    "--present": "#d99424",
    "--present-text": "#171308",
    "--dot-used": "#f0c94a",
    "--win-text": "#bde8b8",
    "--blocked-word": "#d99424",
    "--cursor-border": "#ffe07a",
    "--focus-ring": "#ffe07a",
  },
};

var ORDEM_CORES_PALETA = [
  "vermelho",
  "laranja",
  "amarelo",
  "verde",
  "verdeagua",
  "agua",
  "azul",
  "abismo",
  "cobalto",
  "violeta",
  "rosa",
  "cinza",
];

var PALETAS_LEGADO = [
  ["escuro", "ferrugem"],
  ["escuro", "abismo"],
  ["escuro", "verde"],
  ["claro", "vermelho"],
  ["escuro", "cobalto"],
  ["escuro", "violeta"],
];

var PALETAS_FUNDOS = {
  escuro: {
    azul: ["#071021", "#0d1830", "#213d73", "#12213f"],
    abismo: ["#0d1117", "#161b22", "#30363d", "#21262d"],
    verde: ["#07180d", "#0d2515", "#1f512f", "#12321e"],
    ferrugem: ["#15110f", "#1c1612", "#43372f", "#241d19"],
    vermelho: ["#1b0808", "#270e0d", "#5a2421", "#321312"],
    laranja: ["#1c0d04", "#2a1408", "#5c2c13", "#371b0c"],
    cobalto: ["#0b0d24", "#11143a", "#303687", "#181d4f"],
    violeta: ["#130f1d", "#1b1528", "#302448", "#1d172b"],
    cinza: ["#101214", "#1a1d20", "#424851", "#24282d"],
    rosa: ["#1a0d14", "#25131d", "#4a2638", "#2a1722"],
    agua: ["#06171b", "#0b242a", "#1b5561", "#102f37"],
    verdeagua: ["#061814", "#0b251f", "#1b5b4c", "#10362d"],
    amarelo: ["#171308", "#211b0e", "#4a3d1d", "#292211"],
  },
  claro: {
    azul: ["#eaf2ff", "#d8e7ff", "#8fb0e8", "#c9dbf5"],
    abismo: ["#f5f0e8", "#ede5d5", "#c8b89a", "#ddd5c8"],
    verde: ["#eaf8ee", "#d7eddc", "#8ec69d", "#c8e0cf"],
    ferrugem: ["#f7efe8", "#eadfd4", "#c9aa93", "#e0d2c6"],
    vermelho: ["#fff0ef", "#f3d7d4", "#d98d87", "#e8c6c2"],
    laranja: ["#fff2e8", "#f1dccb", "#d49c70", "#e8cdbb"],
    cobalto: ["#eeeeff", "#ddddfb", "#a1a7e4", "#d0d3f0"],
    violeta: ["#f4effb", "#e8def2", "#baa9d2", "#ded1eb"],
    cinza: ["#eef0f2", "#dfe3e7", "#9da7b1", "#d0d5da"],
    rosa: ["#fff0f6", "#f2dde7", "#d6a9bd", "#ead1dc"],
    agua: ["#e9faff", "#d2edf3", "#86c6d3", "#c3e1e8"],
    verdeagua: ["#e8fff8", "#cff2e8", "#7bd2bd", "#bde7db"],
    amarelo: ["#fbf7e8", "#eee6cf", "#cabc8e", "#e4dac0"],
  },
};

function aplicarVars(vars) {
  var root = document.documentElement;
  for (var prop in vars) {
    if (prop.indexOf("--") === 0) root.style.setProperty(prop, vars[prop]);
  }
}

function aplicarFundoPaleta(modo, cor) {
  var fundo = PALETAS_FUNDOS[modo] && PALETAS_FUNDOS[modo][cor];
  if (!fundo) return;
  aplicarVars({
    "--bg": fundo[0],
    "--tile-bg": fundo[1],
    "--border": fundo[2],
    "--toast-border": fundo[2],
    "--dot": fundo[2],
    "--absent-bg": fundo[3],
    "--absent-border": fundo[3],
    "--key-bg": fundo[3],
    "--toast-bg": fundo[3],
  });
}

function aplicarPaleta(modo, cor) {
  if (!PALETAS_MODOS[modo]) modo = MODO_PALETA_PADRAO;
  if (!PALETAS_CORES[cor]) cor = COR_PALETA_PADRAO;
  aplicarVars(PALETAS_MODOS[modo]);
  aplicarFundoPaleta(modo, cor);
  aplicarVars(PALETAS_CORES[cor]);
  estado.modoPaleta = modo;
  estado.corPaleta = cor;
  estado.paleta = ORDEM_CORES_PALETA.indexOf(cor);
  guardarStorage("palette_mode", modo);
  guardarStorage("palette_color", cor);
  guardarStorage("palette", String(estado.paleta));
  if (typeof usuarioAtual !== "undefined" && usuarioAtual) {
    salvarDadosNoFirestore(usuarioAtual.uid);
  }
}

function preferenciaPorIndiceLegado(indice) {
  var pref = PALETAS_LEGADO[indice] || PALETAS_LEGADO[1];
  return { modo: pref[0], cor: pref[1] };
}

function carregarPreferenciaPaleta() {
  var modo = pegarStorage("palette_mode");
  var cor = pegarStorage("palette_color");
  if (PALETAS_MODOS[modo] && PALETAS_CORES[cor]) {
    return { modo: modo, cor: cor };
  }
  var indice = parseInt(pegarStorage("palette") || "1", 10);
  if (isNaN(indice)) indice = 1;
  return preferenciaPorIndiceLegado(indice);
}