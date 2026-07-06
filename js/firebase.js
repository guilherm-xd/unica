const firebaseConfig = {
  apiKey: "AIzaSyA6LZzVfx096nky11CwLaHCtGXG7mwXDk4",
  authDomain: "unica-jogo-muito-legal.firebaseapp.com",
  projectId: "unica-jogo-muito-legal",
  storageBucket: "unica-jogo-muito-legal.firebasestorage.app",
  messagingSenderId: "573724081987",
  appId: "1:573724081987:web:f046383edbbf1135ba39f6",
};

firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var db = firebase.firestore();

var usuarioAtual = null;
var dadosCarregadosDoCloud = false;

async function carregarDadosDoFirestore(uid) {
  try {
    var docRef = db.collection("usuarios").doc(uid);
    var doc = await docRef.get();

    if (doc.exists) {
      var dados = doc.data();

      if (dados.estatisticas) {
        Object.assign(estatisticas, dados.estatisticas);
      }

      if (dados.preferencias) {
        var modo = dados.preferencias.modoPaleta;
        var cor = dados.preferencias.corPaleta;
        if (PALETAS_MODOS[modo] && PALETAS_CORES[cor]) {
          aplicarPaleta(modo, cor);
        }
      } else if (dados.estadoJogo) {
        if (PALETAS_MODOS[estado.modoPaleta] && PALETAS_CORES[estado.corPaleta]) {
          aplicarPaleta(estado.modoPaleta, estado.corPaleta);
        } else if (typeof estado.paleta === "number") {
          var pref = preferenciaPorIndiceLegado(estado.paleta);
          aplicarPaleta(pref.modo, pref.cor);
        }
      }

      if (dados.estadoJogo) {
        var cloudState = dados.estadoJogo;
        var dataAtual = estado.chaveData;
        if (cloudState.chaveData === dataAtual) {
          var cloudTime = cloudState._atualizadoEm || 0;
          var localTime = estado._atualizadoEm || 0;
          if (cloudTime > localTime) {
            Object.assign(estado, cloudState);
            estado._atualizadoEm = cloudTime;
          } else {
            await salvarDadosNoFirestore(uid);
          }
        } else {
          estado.palpites = [];
          estado.fase = "jogando";
          estado.letrasAtuais = ["", "", "", "", ""];
          estado.posicaoCursor = 0;
          await salvarDadosNoFirestore(uid);
        }
      }

      dadosCarregadosDoCloud = true;
      console.log("✅ Dados carregados do Firestore");
    } else {
      console.log("🆕 Primeiro login, enviando dados locais...");
      await salvarDadosNoFirestore(uid);
    }

    renderizar();
    atualizarInterfaceUsuario();
  } catch (error) {
    console.error("❌ Erro ao carregar dados:", error);
  }
}

async function salvarDadosNoFirestore(uid) {
  if (!uid) return;
  try {
    estado._atualizadoEm = Date.now();

    var dados = {
      estatisticas: estatisticas,
      estadoJogo: { ...estado },
      preferencias: {
        modoPaleta: estado.modoPaleta,
        corPaleta: estado.corPaleta,
      },
      ultimaAtualizacao: firebase.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("usuarios").doc(uid).set(dados, { merge: true });
    console.log("💾 Dados salvos no Firestore");
  } catch (error) {
    console.error("❌ Erro ao salvar dados:", error);
  }
}

async function loginGoogle() {
  try {
    var provider = new firebase.auth.GoogleAuthProvider();
    var result = await auth.signInWithPopup(provider);
    var user = result.user;
    usuarioAtual = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split("@")[0],
    };

    await carregarDadosDoFirestore(user.uid);
    mostrarMensagem("Logado como " + usuarioAtual.displayName, false);
    renderizar();
  } catch (error) {
    console.error("❌ Erro no login:", error);
    var msg = "Erro ao fazer login.";
    if (
      error.code === "auth/popup-blocked" ||
      error.code === "auth/popup-closed-by-user"
    ) {
      msg =
        "Pop-up bloqueado! Clique novamente ou permita pop-ups para este site.";
    } else if (error.code === "auth/unauthorized-domain") {
      msg =
        "Domínio não autorizado. Verifique as configurações do Firebase (Authentication → Domínios autorizados).";
    } else {
      msg = error.message;
    }
    mostrarMensagem(msg, true);
  }
}

async function logout() {
  try {
    await auth.signOut();
    usuarioAtual = null;
    dadosCarregadosDoCloud = false;

    carregarEstatisticas();

    var chave = estado.chaveData || "";
    if (chave) {
      var progresso = carregarProgresso(chave);
      if (progresso) {
        estado.palpites = progresso.palpites || [];
        estado.fase = progresso.status === "ganhou" ? "ganhou" : "jogando";
      }
    }

    atualizarInterfaceUsuario();
    renderizar();
    mostrarMensagem("Desconectado", false);
  } catch (error) {
    console.error("❌ Erro no logout:", error);
  }
}

auth.onAuthStateChanged(async function (user) {
  if (user) {
    usuarioAtual = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split("@")[0],
    };
    await carregarDadosDoFirestore(user.uid);
  } else {
    usuarioAtual = null;
    dadosCarregadosDoCloud = false;
  }
  atualizarInterfaceUsuario();
  renderizar();
});

function atualizarInterfaceUsuario() {
  var authArea = document.getElementById("auth-area");
  if (!authArea) return;

  if (usuarioAtual) {
    authArea.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
        <span style="font-size: 0.9rem; color: var(--text-muted);">👤 ${usuarioAtual.displayName}</span>
        <button id="btnLogoutModal" class="btn-auth-modal" style="display: inline-flex;">🚪 Sair</button>
      </div>
    `;
    document.getElementById("btnLogoutModal").addEventListener("click", logout);
  } else {
    authArea.innerHTML = `
      <button id="btnLoginModal" class="btn-google">
        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
        Continuar com Google
      </button>
    `;
    document
      .getElementById("btnLoginModal")
      .addEventListener("click", loginGoogle);
  }
}