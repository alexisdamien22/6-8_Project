import { ICONS } from "../../constants/CreateAccountConstants.js";
import { esc, isStepValid } from "../../utils/FormHelpers.js";

const state = {
  isLoading: false,
  loginData: { email: "", password: "" },
};

export const LoginPage = {
  getHTML() {
    const btnLabel = state.isLoading
      ? `<span class="ca-spinner"></span>`
      : "Se connecter";
    const isValid = isStepValid(1, true, state.isLoading, {}, state.loginData);

    return `
      <div class="ca-screen">
        <div class="ca-content">
          <h1 class="ca-title">Connexion</h1>
          <p class="ca-step-label">Connecte-toi pour continuer</p>
          <div class="ca-illus-wrap">
            <img src="${ICONS.guitare}" alt="Prêt ?"/>
            <span class="ca-illus-name">Prêt ?</span>
          </div>
          <div class="ca-form-block">
            <p class="ca-question">Content de te revoir !</p>
            <form id="ca-login-form">
              <input class="ca-input login-input" type="email" data-field="email" 
                placeholder="Ton email" value="${esc(state.loginData.email)}">
              <input class="ca-input login-input" type="password" data-field="password" 
                placeholder="Ton mot de passe" value="${esc(state.loginData.password)}">
            </form>
            <a href="#" class="ca-forgot-pass">Mot de passe oublié ?</a>
          </div>
          <button class="ca-btn-next" id="ca-main-btn" ${isValid ? "" : "disabled"}>${btnLabel}</button>
        </div>
        <div class="ca-footer">
          <p class="ca-login-hint">Nouveau ici ? <a href="#" id="ca-switch-register">Crée un compte !</a></p>
        </div>
      </div>`;
  },

  attachEventListeners() {
    document
      .getElementById("ca-login-form")
      ?.addEventListener("submit", (e) => e.preventDefault());

    document.querySelectorAll(".login-input").forEach((input) => {
      input.addEventListener("input", (e) => {
        state.loginData[e.target.dataset.field] = e.target.value;
        this.refreshBtn();
      });
    });

    document
      .getElementById("ca-main-btn")
      ?.addEventListener("click", () => this.handleLogin());

    document
      .getElementById("ca-switch-register")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        window.appController?.navigateToPage("registerParent");
      });
  },

  async handleLogin() {
    if (state.isLoading) return;

    state.isLoading = true;
    window.appController?.updateView();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.loginData),
      });

      const res = await response.json();

      if (res.success) {
        localStorage.setItem("jwt_token", res.token);
        window.appController?.model.login();
        window.appController?.navigateToPage("home");
      } else {
        alert(res.error || "Login failed");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      state.isLoading = false;
      window.appController?.updateView();
    }
  },

  refreshBtn() {
    const btn = document.getElementById("ca-main-btn");
    if (btn) {
      btn.disabled = !isStepValid(
        1,
        true,
        state.isLoading,
        {},
        state.loginData,
      );
    }
  },
};
