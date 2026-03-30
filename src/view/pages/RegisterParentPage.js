import { STEP_ILLUS } from "../../constants/CreateAccountConstants.js";
import { esc, isStepValid } from "../../utils/FormHelpers.js";

const state = {
  isLoading: false,
  registerData: {
    email: "",
    password: "",
    confirmPassword: "",
  },
};

export const RegisterParentPage = {
  getHTML() {
    const illus = STEP_ILLUS[1];
    const isValid = isStepValid(
      1,
      false,
      state.isLoading,
      state.registerData,
      {},
    );

    return `
      <div class="ca-screen">
        <div class="ca-content">
          <h1 class="ca-title">Création de compte</h1>
          <p class="ca-step-label">Compte Parent</p>
          <div class="ca-illus-wrap">
            <img src="${illus.png}" alt="${illus.lbl}"/>
          </div>
          <div class="ca-form-block">
            <p class="ca-question">Tes identifiants</p>
            <form id="ca-register-form">
              <input class="ca-input reg-input" type="email" data-field="email" 
                autocomplete="email" placeholder="Ton email" value="${esc(state.registerData.email)}">
              <input class="ca-input reg-input" type="password" data-field="password" 
                autocomplete="new-password" placeholder="Mot de passe (8+ car.)" value="${esc(state.registerData.password)}">
              <input class="ca-input reg-input" type="password" data-field="confirmPassword" 
                autocomplete="new-password" placeholder="Confirmer le mot de passe" value="${esc(state.registerData.confirmPassword)}">
            </form>
          </div>
          <button class="ca-btn-next" id="ca-main-btn" ${isValid ? "" : "disabled"}>
            ${state.isLoading ? "Chargement..." : "Créer mon compte"}
          </button>
        </div>
        <div class="ca-footer">
          <p class="ca-login-hint">Déjà inscrit ? <a href="#" id="ca-switch-login">Connecte-toi !</a></p>
        </div>
      </div>`;
  },

  attachEventListeners() {
    document
      .getElementById("ca-register-form")
      ?.addEventListener("submit", (e) => e.preventDefault());

    document.querySelectorAll(".reg-input").forEach((input) => {
      input.addEventListener("input", (e) => {
        state.registerData[e.target.dataset.field] = e.target.value;
        this.refreshBtn();
      });
    });

    document
      .getElementById("ca-main-btn")
      ?.addEventListener("click", () => this.handleRegistration());

    document
      .getElementById("ca-switch-login")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        window.appController?.navigateToPage("login");
      });
  },

  async handleRegistration() {
    if (state.isLoading) return;

    state.isLoading = true;
    window.appController?.navigateToPage("registerParent");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.registerData.email,
          password: state.registerData.password,
        }),
      });

      const res = await response.json();

      if (res.success) {
        localStorage.setItem("jwt_token", res.token);
        window.appController?.model.login();
        window.appController?.navigateToPage("home");
      } else {
        alert(res.error || "Erreur lors de l'inscription");
        state.isLoading = false;
        window.appController?.navigateToPage("registerParent");
      }
    } catch (err) {
      alert("Erreur réseau");
      state.isLoading = false;
      window.appController?.navigateToPage("registerParent");
    }
  },

  refreshBtn() {
    const btn = document.getElementById("ca-main-btn");
    if (btn) {
      btn.disabled = !isStepValid(
        1,
        false,
        state.isLoading,
        state.registerData,
        {},
      );
    }
  },
};
