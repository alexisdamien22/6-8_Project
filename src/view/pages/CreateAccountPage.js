import {
  INSTRUMENTS,
  STEP_ILLUS,
  MASCOTTES,
  JOURS,
  TOTAL_STEPS,
  ICONS,
} from "../../constants/CreateAccountConstants.js";
import { esc, isStepValid } from "../../utils/FormHelpers.js";

let _step = 1;
let _isLoginMode = true;
let _isLoading = false;
let _loginState = { email: "", password: "" };
let _state = {
  name: "",
  age: "",
  instrument: "",
  duree: "",
  ecole: "",
  mascotte: "",
  jours: [],
  email: "",
  password: "",
};

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
    <a href="#" class="ca-forgot-pass">Mot de passe oublié ?</a>`;
  }
  switch (step) {
    case 1:
      return `
        <p class="ca-question">Infos du <em>parent</em> (pour le compte)</p>
        <input class="ca-input" type="email" placeholder="Email du parent" value="${esc(_state.email)}" oninput="window.__ca_input('email', this.value)">
        <input class="ca-input" type="password" placeholder="Mot de passe (8+ car.)" value="${esc(_state.password)}" oninput="window.__ca_input('password', this.value)">
        <p class="ca-question" style="margin-top: 24px;">Quel est ton <em>prénom</em> ?</p>
        <input class="ca-input" type="text" placeholder="Prénom de l'enfant" value="${esc(_state.name)}" oninput="window.__ca_input('name', this.value)">`;
    case 2:
      return `<p class="ca-question">Quel est ton <em>âge</em> ?</p>
              <input class="ca-input" type="number" placeholder="Âge" value="${esc(_state.age)}" oninput="window.__ca_input('age', this.value)">`;
    case 3:
      const cards = INSTRUMENTS.map(
        (ins) => `
        <div class="ca-instr-card${_state.instrument === ins.id ? " sel" : ""}" onclick="window.__ca_pick('instrument','${ins.id}', event)">
          <div class="ca-instr-icon"><img src="${ins.png}" /></div>
          <span class="ca-instr-lbl">${ins.lbl}</span>
        </div>`,
      ).join("");
      return `<p class="ca-question">Quel <em>instrument</em> ?</p><div class="ca-instr-grid">${cards}</div>`;
    case 4:
      return `<p class="ca-question">Depuis <em>combien d'années</em> pratiques-tu ?</p>
              <input class="ca-input" type="number" value="${esc(_state.duree)}" oninput="window.__ca_input('duree', this.value)">`;
    case 5:
      return `<p class="ca-question">Ton <em>école</em> ou conservatoire ?</p>
              <input class="ca-input" type="text" value="${esc(_state.ecole)}" oninput="window.__ca_input('ecole', this.value)">`;
    case 6:
      const cells = MASCOTTES.map(
        (m) => `
        <div class="ca-mascot-cell${_state.mascotte === m ? " sel" : ""}" onclick="window.__ca_pick('mascotte','${m}', event)">${m}</div>`,
      ).join("");
      return `<p class="ca-question">Choisis une <em>mascotte</em> !</p><div class="ca-mascot-grid">${cells}</div>`;
    case 7:
      const pills = JOURS.map(
        (j) => `
        <button class="ca-day-pill${_state.jours.includes(j) ? " sel" : ""}" onclick="window.__ca_toggleDay('${j}')">${j}</button>`,
      ).join("");
      return `<p class="ca-question">Quels jours vas-tu <em>travailler</em> ?</p><div class="ca-days-row">${pills}</div>`;
    default:
      return "";
  }
}

export const CreateAccountPage = {
  getHTML() {
    if (!_isLoginMode && _step === 8) {
      return `<div class="ca-screen ca-success">
          <div class="ca-success-body">
            <div class="ca-success-mascot">${_state.mascotte || "🎵"}</div>
            <h2 class="ca-success-title">Bienvenue, ${esc(_state.name)} !</h2>
          </div>
          <div class="ca-footer"><button class="ca-btn-next" id="ca-btn-start">Commencer l'aventure 🚀</button></div>
        </div>`;
    }

    const title = _isLoginMode ? "Connexion" : "Création de compte";
    const subTitle = _isLoginMode
      ? "Connecte-toi pour continuer"
      : `${_step}/${TOTAL_STEPS}`;
    let btnLabel = _isLoginMode
      ? "Se connecter"
      : _step === TOTAL_STEPS
        ? "Terminé !"
        : "Suivant";
    if (_isLoading) btnLabel = `<span class="ca-spinner"></span>`;

    const illus = _isLoginMode
      ? { png: ICONS.guitare, lbl: "Prêt ?" }
      : STEP_ILLUS[_step];
    const valid = isStepValid(
      _step,
      _isLoginMode,
      _isLoading,
      _state,
      _loginState,
    );

    return `
      <div class="ca-screen">
        <div class="ca-content">
          <h1 class="ca-title">${title}</h1>
          <p class="ca-step-label">${subTitle}</p>
          <div class="ca-illus-wrap"><img src="${illus.png}" /> <span class="ca-illus-name">${illus.lbl}</span></div>
          <div class="ca-form-block">${buildFormContent(_step)}</div>
          <button class="ca-btn-next" id="ca-main-btn" ${valid ? "" : "disabled"}>${btnLabel}</button>
        </div>
        <div class="ca-footer">
          <p class="ca-login-hint">${_isLoginMode ? 'Nouveau ici ? <a href="#" id="ca-switch-mode">Crée un compte !</a>' : 'Déjà inscrit ? <a href="#" id="ca-switch-mode">Connecte-toi !</a>'}</p>
        </div>
      </div>`;
  },

  afterRender() {
    document
      .getElementById("ca-switch-mode")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        if (_isLoading) return;
        _isLoginMode = !_isLoginMode;
        _step = 1;
        window.appController?.navigateToPage("createAccount");
      });

    document
      .getElementById("ca-main-btn")
      ?.addEventListener("click", async () => {
        if (
          !isStepValid(_step, _isLoginMode, _isLoading, _state, _loginState) ||
          _isLoading
        )
          return;

        if (_isLoginMode || _step === TOTAL_STEPS) {
          _isLoading = true;
          this.updateBtnLoading(true);

          try {
            const url = _isLoginMode ? "/api/auth/login" : "/api/auth/register";
            const body = _isLoginMode ? _loginState : _state;
            const response = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });
            const res = await response.json();

            if (res.success) {
              localStorage.setItem("jwt_token", res.token);
              localStorage.setItem("activeChildId", res.childId);
              window.appController?.model.login();
              if (!_isLoginMode) {
                _step = 8;
                _isLoading = false;
                window.appController?.navigateToPage("createAccount");
              } else {
                _isLoading = false;
                window.appController?.navigateToPage("home");
              }
            } else {
              _isLoading = false;
              alert(res.error || "Erreur");
              window.appController?.navigateToPage("createAccount");
            }
          } catch (err) {
            _isLoading = false;
            alert("Erreur réseau");
          }
        } else {
          _step++;
          window.appController?.navigateToPage("createAccount");
        }
      });

    // Global listeners for inputs
    window.__log_input = (k, v) => {
      _loginState[k] = v;
      this.refreshBtn();
    };
    window.__ca_input = (k, v) => {
      _state[k] = v;
      this.refreshBtn();
    };
    window.__ca_pick = (k, v, e) => {
      _state[k] = v;
      document
        .querySelectorAll(
          k === "instrument" ? ".ca-instr-card" : ".ca-mascot-cell",
        )
        .forEach((c) => c.classList.remove("sel"));
      e.currentTarget.classList.add("sel");
      this.refreshBtn();
    };
    window.__ca_toggleDay = (j) => {
      const idx = _state.jours.indexOf(j);
      if (idx === -1) _state.jours.push(j);
      else _state.jours.splice(idx, 1);
      document.querySelector(".ca-form-block").innerHTML =
        buildFormContent(_step);
      this.refreshBtn();
    };
  },

  refreshBtn() {
    const btn = document.getElementById("ca-main-btn");
    if (btn)
      btn.disabled = !isStepValid(
        _step,
        _isLoginMode,
        _isLoading,
        _state,
        _loginState,
      );
  },

  updateBtnLoading(loading) {
    const btn = document.getElementById("ca-main-btn");
    if (btn && loading)
      btn.innerHTML = `<span class="ca-loading-dots">Chargement<span>.</span><span>.</span><span>.</span></span>`;
  },
};
