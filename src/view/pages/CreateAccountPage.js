const ICONS = {
  basson: "./assets/img/icons/basson.png",
  guitare: "./assets/img/icons/guitar.png",
  violon: "./assets/img/icons/violin.png",
  flute: "./assets/img/icons/recorder.png",
  batterie: "./assets/img/icons/drum.png",
  trompette: "./assets/img/icons/trumpet.png",
  corHarmonie: "./assets/img/icons/french-horn.png",
};

const INSTRUMENTS = [
  { id: "basson", lbl: "Basson", png: ICONS.basson },
  { id: "guitare", lbl: "Guitare", png: ICONS.guitare },
  { id: "violon", lbl: "Violon", png: ICONS.violon },
  { id: "flute", lbl: "Flûte", png: ICONS.flute },
  { id: "batterie", lbl: "Batterie", png: ICONS.batterie },
  { id: "trompette", lbl: "Trompette", png: ICONS.trompette },
  { id: "corHarmonie", lbl: "Cor d'Harmonie", png: ICONS.corHarmonie },
];

const STEP_ILLUS = {
  1: { png: ICONS.guitare, lbl: "Guitare" },
  2: { png: ICONS.flute, lbl: "Flûte" },
  3: { png: ICONS.violon, lbl: "Violon" },
  4: { png: ICONS.batterie, lbl: "Batterie" },
  5: { png: ICONS.corHarmonie, lbl: "Cor d'harmonie" },
  6: { png: ICONS.trompette, lbl: "Trompette" },
  7: { png: ICONS.flute, lbl: "Flûte traversière" },
};

const MASCOTTES = ["🦊", "🐱", "🐸", "🐶", "🦋", "🐺", "🦄", "🐼", "🐰"];
const JOURS = ["L", "Ma", "Me", "J", "V", "S", "D"];
const TOTAL = 7;

let _step = 1;
let _isLoginMode = true;
let _loginState = { email: "", password: "" };
let _state = {
  prenom: "",
  age: "",
  instrument: "",
  duree: "",
  ecole: "",
  mascotte: "",
  jours: [],
};

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function isStepValid() {
  if (_isLoginMode) {
    return _loginState.email.includes("@") && _loginState.password.length >= 4;
  }
  switch (_step) {
    case 1:
      return _state.prenom.trim().length >= 2;
    case 2: {
      const a = parseInt(_state.age);
      return !isNaN(a) && a >= 5 && a <= 99;
    }
    case 3:
      return _state.instrument !== "";
    case 4: {
      const d = parseInt(_state.duree);
      const a = parseInt(_state.age);
      return !isNaN(d) && d >= 0 && d <= a;
    }
    case 5:
      return _state.ecole.trim().length > 0;
    case 6:
      return _state.mascotte !== "";
    case 7:
      return _state.jours.length > 0;
    default:
      return false;
  }
}

function buildFormContent(step) {
  if (_isLoginMode) {
    return `
    <p class="ca-question">Content de te revoir !</p>
    <form id="ca-login-form" onsubmit="return false;">
      <input class="ca-input" type="email" autocomplete="username" id="log-email" 
        placeholder="Ton email" value="${esc(_loginState.email)}"
        oninput="window.__log_input('email', this.value)">
      <input class="ca-input" type="password" autocomplete="current-password" id="log-pass" 
        placeholder="Ton mot de passe" value="${esc(_loginState.password)}"
        oninput="window.__log_input('password', this.value)">
    </form>
    <a href="#" class="ca-forgot-pass">Mot de passe oublié ?</a>
  `;
  }
  switch (step) {
    case 1:
      return `<p class="ca-question">Quel est ton <em>prénom</em> ?</p>
              <input class="ca-input" type="text" placeholder="Prénom" value="${esc(_state.prenom)}"
                oninput="window.__ca_input('prenom', this.value)">`;
    case 2:
      return `<p class="ca-question">Quel est ton <em>âge</em> ?</p>
              <input class="ca-input" type="number" placeholder="Âge" min="5" max="99" value="${esc(_state.age)}"
                oninput="window.__ca_input('age', this.value)">`;
    case 3: {
      const cards = INSTRUMENTS.map(
        (ins) => `
        <div class="ca-instr-card${_state.instrument === ins.id ? " sel" : ""}"
          onclick="window.__ca_pick('instrument','${ins.id}', event)">
          <div class="ca-instr-icon"><img src="${ins.png}" alt="${ins.lbl}" /></div>
          <span class="ca-instr-lbl">${ins.lbl}</span>
        </div>`,
      ).join("");
      return `<p class="ca-question" style="margin-bottom:12px">Quel <em>instrument</em> ?</p>
              <div class="ca-instr-grid">${cards}</div>`;
    }
    case 4:
      return `<p class="ca-question">Depuis <em>combien d'années</em> pratiques-tu ?</p>
              <input class="ca-input" type="number" placeholder="Nombre d'années" value="${esc(_state.duree)}"
                oninput="window.__ca_input('duree', this.value)">`;
    case 5:
      return `<p class="ca-question">Ton <em>école</em> ou conservatoire ?</p>
              <input class="ca-input" type="text" placeholder="Nom de l'école" value="${esc(_state.ecole)}"
                oninput="window.__ca_input('ecole', this.value)">`;
    case 6: {
      const cells = MASCOTTES.map(
        (m) => `
        <div class="ca-mascot-cell${_state.mascotte === m ? " sel" : ""}"
          onclick="window.__ca_pick('mascotte','${m}', event)">${m}</div>`,
      ).join("");
      return `<p class="ca-question" style="margin-bottom:12px">Choisis une <em>mascotte</em> !</p>
              <div class="ca-mascot-grid">${cells}</div>`;
    }
    case 7: {
      const pills = JOURS.map(
        (j) => `
        <button class="ca-day-pill${_state.jours.includes(j) ? " sel" : ""}"
          onclick="window.__ca_toggleDay('${j}')">${j}</button>`,
      ).join("");
      return `<p class="ca-question" style="margin-bottom:14px">Quels jours vas-tu <em>travailler</em> ?</p>
              <div class="ca-days-row">${pills}</div>`;
    }
    default:
      return "";
  }
}

export const CreateAccountPage = {
  getHTML() {
    if (!_isLoginMode && _step === 8) {
      return `
        <div class="ca-screen ca-success">
          <div class="ca-success-body">
            <div class="ca-success-mascot">${_state.mascotte || "🎵"}</div>
            <h2 class="ca-success-title">Bienvenue, ${esc(_state.prenom)} !</h2>
            <p class="ca-success-msg">Ton compte est prêt. Pratique chaque jour !</p>
          </div>
          <div class="ca-footer">
            <button class="ca-btn-next" id="ca-btn-start">Commencer l'aventure 🚀</button>
          </div>
        </div>`;
    }
    const title = _isLoginMode ? "Connexion" : "Création de compte";
    const subTitle = _isLoginMode
      ? "Connecte-toi pour continuer"
      : `${_step}/${TOTAL}`;
    const btnLabel = _isLoginMode
      ? "Se connecter"
      : _step === TOTAL
        ? "Terminé !"
        : "Suivant";
    const illus = _isLoginMode
      ? { png: ICONS.guitare, lbl: "Prêt ?" }
      : STEP_ILLUS[_step];
    const valid = isStepValid();

    return `
      <div class="ca-screen">
        <div class="ca-content">
          <h1 class="ca-title">${title}</h1>
          <p class="ca-step-label">${subTitle}</p>
          <div class="ca-illus-wrap">
            <img src="${illus.png}" alt="${illus.lbl}" />
            <span class="ca-illus-name">${illus.lbl}</span>
          </div>
          <div class="ca-form-block">${buildFormContent(_step)}</div>
          <button class="ca-btn-next" id="ca-main-btn" ${valid ? "" : "disabled"}>${btnLabel}</button>
        </div>
        <div class="ca-footer">
          ${
            _isLoginMode
              ? `<p class="ca-login-hint">Nouveau ici ? <a href="#" id="ca-switch-mode">Crée un compte !</a></p>`
              : `<p class="ca-login-hint">Déjà inscrit ? <a href="#" id="ca-switch-mode">Connecte-toi !</a></p>`
          }
        </div>
      </div>`;
  },

  afterRender() {
    document
      .getElementById("ca-switch-mode")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        _isLoginMode = !_isLoginMode;
        _step = 1;
        window.appController?.navigateToPage("createAccount");
      });

    // Dans afterRender du CreateAccountPage.js
    document
      .getElementById("ca-main-btn")
      ?.addEventListener("click", async () => {
        if (!isStepValid()) return;

        if (_isLoginMode) {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(_loginState),
          });
          const res = await response.json();
          if (res.success) {
            localStorage.setItem("activeChildId", res.user.id);
            window.appController?.navigateToPage("home");
          } else {
            alert("Identifiants incorrects");
          }
        } else {
          if (_step === TOTAL) {
            // --- ENVOI AU SERVEUR ---
            const response = await fetch("/api/signup/child", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(_state), // Envoie tout le formulaire
            });

            const result = await response.json();
            if (result.success) {
              _step = 8; // Affiche l'écran succès
              localStorage.setItem("activeChildId", result.childId); // Sauvegarde la session
              window.appController?.navigateToPage("createAccount");
            } else {
              alert("Erreur lors de la création : " + result.error);
            }
          } else {
            _step++;
            window.appController?.navigateToPage("createAccount");
          }
        }
      });

    document.getElementById("ca-btn-start")?.addEventListener("click", () => {
      window.appController?.navigateToPage("home");
    });

    window.__log_input = (key, val) => {
      _loginState[key] = val;
      const btn = document.getElementById("ca-main-btn");
      if (btn) btn.disabled = !isStepValid();
    };

    window.__ca_input = (key, val) => {
      _state[key] = val;
      const btn = document.getElementById("ca-main-btn");
      if (btn) btn.disabled = !isStepValid();
    };

    window.__ca_pick = (key, value, event) => {
      _state[key] = value;
      const selector =
        key === "instrument" ? ".ca-instr-card" : ".ca-mascot-cell";
      document
        .querySelectorAll(selector)
        .forEach((card) => card.classList.remove("sel"));
      if (event && event.currentTarget)
        event.currentTarget.classList.add("sel");
      const btn = document.getElementById("ca-main-btn");
      if (btn) btn.disabled = !isStepValid();
    };

    window.__ca_toggleDay = (jour) => {
      const idx = _state.jours.indexOf(jour);
      if (idx === -1) _state.jours.push(jour);
      else _state.jours.splice(idx, 1);
      const formBlock = document.querySelector(".ca-form-block");
      if (formBlock) {
        formBlock.innerHTML = buildFormContent(_step);
        const btn = document.getElementById("ca-main-btn");
        if (btn) btn.disabled = !isStepValid();
      }
    };
  },
};
