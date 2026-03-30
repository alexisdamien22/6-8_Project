import {
  INSTRUMENTS,
  MASCOTTES,
  JOURS,
  STEP_ILLUS,
  TOTAL_STEPS,
} from "../../constants/CreateAccountConstants.js";
import { esc, isStepValid } from "../../utils/FormHelpers.js";

const state = {
  step: 1,
  isLoading: false,
  isSuccess: false,
  registerData: {
    name: "",
    age: "",
    instrument: "",
    duree: "",
    ecole: "",
    mascotte: "",
    jours: [],
  },
};

export const RegisterChildPage = {
  getHTML() {
    if (state.isSuccess) return this.getSuccessHTML();

    const illus = STEP_ILLUS[state.step] || { png: "", lbl: "" };
    const isValid = isStepValid(
      state.step,
      false,
      state.isLoading,
      state.registerData,
      {},
    );

    return `
      <div class="ca-screen">
        <div class="ca-content">
          <h1 class="ca-title">Profil Enfant</h1>
          <p class="ca-step-label">Étape ${state.step}/${TOTAL_STEPS}</p>
          <div class="ca-illus-wrap">
            <img src="${illus.png}" alt="${illus.lbl}"/>
          </div>
          <div class="ca-form-block">${this.buildStepContent()}</div>
          <button class="ca-btn-next" id="ca-next-step" ${isValid ? "" : "disabled"}>
            ${state.isLoading ? "Chargement..." : state.step === TOTAL_STEPS ? "Terminer" : "Suivant"}
          </button>
        </div>
      </div>`;
  },

  buildStepContent() {
    switch (state.step) {
      case 1:
        return `<p class="ca-question">Quel est ton <em>prénom</em> ?</p>
                <input class="ca-input reg-input" type="text" data-field="name" placeholder="Ton prénom" value="${esc(state.registerData.name)}">`;
      case 2:
        return `<p class="ca-question">Quel est ton <em>âge</em> ?</p>
                <input class="ca-input reg-input" type="number" data-field="age" value="${esc(state.registerData.age)}">`;
      case 3:
        return `<p class="ca-question">Quel <em>instrument</em> ?</p>
                <div class="ca-instr-grid">${INSTRUMENTS.map(
                  (ins) => `
                  <div class="ca-instr-card ${state.registerData.instrument === ins.id ? "sel" : ""}" data-id="${ins.id}">
                    <img src="${ins.png}" alt="${ins.lbl}"/><span>${ins.lbl}</span>
                  </div>`,
                ).join("")}</div>`;
      case 4:
        return `<p class="ca-question">Depuis <em>combien d'années</em> ?</p>
                <input class="ca-input reg-input" type="number" data-field="duree" value="${esc(state.registerData.duree)}">`;
      case 5:
        return `<p class="ca-question">Ton <em>école</em> ou conservatoire ?</p>
                <input class="ca-input reg-input" type="text" data-field="ecole" value="${esc(state.registerData.ecole)}">`;
      case 6:
        return `<p class="ca-question">Choisis une <em>mascotte</em> !</p>
                <div class="ca-mascot-grid">${MASCOTTES.map(
                  (m) => `
                  <div class="ca-mascot-cell ${state.registerData.mascotte === m ? "sel" : ""}" data-mascot="${m}">${m}</div>`,
                ).join("")}</div>`;
      case 7:
        return `<p class="ca-question">Quels jours vas-tu <em>travailler</em> ?</p>
                <div class="ca-days-row">${JOURS.map(
                  (j) => `
                  <button class="ca-day-pill ${state.registerData.jours.includes(j) ? "sel" : ""}" data-day="${j}">${j}</button>
                `,
                ).join("")}</div>`;
      default:
        return "";
    }
  },

  getSuccessHTML() {
    return `
      <div class="ca-screen ca-success">
        <div class="ca-success-body">
          <div class="ca-success-mascot">${state.registerData.mascotte || "🎵"}</div>
          <h2 class="ca-success-title">Bienvenue, ${esc(state.registerData.name)} !</h2>
        </div>
        <div class="ca-footer">
          <button class="ca-btn-next" id="ca-btn-start">C'est parti ! 🚀</button>
        </div>
      </div>`;
  },

  attachEventListeners() {
    if (state.isSuccess) {
      document
        .getElementById("ca-btn-start")
        ?.addEventListener("click", () =>
          window.appController?.navigateToPage("home"),
        );
      return;
    }

    document.querySelectorAll(".reg-input").forEach((input) => {
      input.addEventListener("input", (e) => {
        state.registerData[e.target.dataset.field] = e.target.value;
        this.refreshBtn();
      });
    });

    document.querySelectorAll(".ca-instr-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        state.registerData.instrument = e.currentTarget.dataset.id;
        window.appController?.navigateToPage("registerChild");
      });
    });

    document.querySelectorAll(".ca-mascot-cell").forEach((cell) => {
      cell.addEventListener("click", (e) => {
        state.registerData.mascotte = e.currentTarget.dataset.mascot;
        window.appController?.navigateToPage("registerChild");
      });
    });

    document.querySelectorAll(".ca-day-pill").forEach((pill) => {
      pill.addEventListener("click", (e) => {
        const day = e.currentTarget.dataset.day;
        const idx = state.registerData.jours.indexOf(day);
        if (idx === -1) state.registerData.jours.push(day);
        else state.registerData.jours.splice(idx, 1);
        window.appController?.navigateToPage("registerChild");
      });
    });

    document
      .getElementById("ca-next-step")
      ?.addEventListener("click", () => this.handleNext());
  },

  async handleNext() {
    if (state.step < TOTAL_STEPS) {
      state.step++;
      window.appController?.navigateToPage("registerChild");
    } else {
      await this.submitChildData();
    }
  },

  async submitChildData() {
    state.isLoading = true;
    window.appController?.navigateToPage("registerChild");

    try {
      const response = await fetch("/api/auth/register-child", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify(state.registerData),
      });
      const res = await response.json();

      if (res.success) {
        state.isSuccess = true;
        window.appController?.navigateToPage("registerChild");
      } else {
        alert(res.error || "Erreur lors de la création du profil");
        state.isLoading = false;
        window.appController?.navigateToPage("registerChild");
      }
    } catch (err) {
      alert("Erreur réseau");
      state.isLoading = false;
      window.appController?.navigateToPage("registerChild");
    }
  },

  refreshBtn() {
    const btn = document.getElementById("ca-next-step");
    if (btn) {
      btn.disabled = !isStepValid(
        state.step,
        false,
        state.isLoading,
        state.registerData,
        {},
      );
    }
  },
};
