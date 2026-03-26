const SVGS = {
  piano: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="18" width="52" height="30" rx="4"/><rect x="6" y="18" width="52" height="18" rx="4" fill="white" fill-opacity=".15"/><rect x="11" y="22" width="6" height="11" rx="2" fill="white"/><rect x="20" y="22" width="6" height="11" rx="2" fill="white"/><rect x="35" y="22" width="6" height="11" rx="2" fill="white"/><rect x="44" y="22" width="6" height="11" rx="2" fill="white"/><rect x="16" y="22" width="4" height="8" rx="1.5"/><rect x="25" y="22" width="4" height="8" rx="1.5"/><rect x="40" y="22" width="4" height="8" rx="1.5"/><rect x="49" y="22" width="4" height="8" rx="1.5"/></svg>`,
  guitare: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M29 7h6v20q8 4 8 15a11 11 0 0 1-22 0q0-11 8-15Z"/><rect x="30" y="3" width="4" height="8" rx="2"/><circle cx="32" cy="41" r="4" fill="white" fill-opacity=".25"/></svg>`,
  violon: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 7c-7 0-11 5-11 11 0 4 2 7 2 11s-4 6-4 12c0 9 6 16 13 16s13-7 13-16c0-6-4-8-4-12s2-7 2-11c0-6-4-11-11-11z"/><path d="M21 23q-4 2-4 6t4 3" fill="white" fill-opacity=".2"/><path d="M43 23q4 2 4 6t-4 3" fill="white" fill-opacity=".2"/></svg>`,
  flute: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="7" y="27" width="50" height="10" rx="5" transform="rotate(-28 32 32)"/><circle cx="19" cy="40" r="2.8" fill="white" fill-opacity=".5"/><circle cx="27" cy="36" r="2.8" fill="white" fill-opacity=".5"/><circle cx="35" cy="31" r="2.8" fill="white" fill-opacity=".5"/><circle cx="43" cy="27" r="2.8" fill="white" fill-opacity=".5"/></svg>`,
  batterie: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="37" rx="20" ry="10"/><ellipse cx="32" cy="30" rx="20" ry="10" fill-opacity=".75"/><ellipse cx="32" cy="30" rx="20" ry="10" fill="none" stroke="white" stroke-opacity=".3" stroke-width="1.5"/><line x1="24" y1="13" x2="28" y2="30" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><line x1="40" y1="13" x2="36" y2="30" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>`,
  trompette: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M8 27h30q9 0 13 9a10 10 0 0 1 0 8l-5-1a6 6 0 0 0-2-7q-3-4-6-4H8z"/><rect x="6" y="27" width="4" height="5" rx="2"/><circle cx="22" cy="20" r="5" fill="none" stroke="currentColor" stroke-width="3"/><rect x="28" y="19" width="4" height="13" rx="2"/><rect x="34" y="19" width="4" height="13" rx="2"/></svg>`,
  saxophone: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M36 8h5v7q13 3 13 18 0 20-18 25-9 3-15-2l4-5q7 4 13-1 9-7 7-17-2-12-9-13h-5z"/><circle cx="39" cy="26" r="2.2" fill="white" fill-opacity=".5"/><circle cx="43" cy="33" r="2.2" fill="white" fill-opacity=".5"/><circle cx="42" cy="40" r="2.2" fill="white" fill-opacity=".5"/><rect x="30" y="6" width="9" height="6" rx="2.5"/></svg>`,
  basse: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M27 7h10v20q10 5 10 16a15 15 0 0 1-30 0q0-11 10-16z"/><rect x="29" y="2" width="5" height="9" rx="2.5"/><line x1="28" y1="9" x2="28" y2="28" stroke="white" stroke-width="1.3" stroke-opacity=".45"/><line x1="33" y1="9" x2="33" y2="28" stroke="white" stroke-width="1.3" stroke-opacity=".45"/><line x1="38" y1="9" x2="38" y2="28" stroke="white" stroke-width="1.3" stroke-opacity=".45"/></svg>`,
};

const INSTRUMENTS = [
  { id: "piano", lbl: "Piano", svg: SVGS.piano },
  { id: "guitare", lbl: "Guitare", svg: SVGS.guitare },
  { id: "violon", lbl: "Violon", svg: SVGS.violon },
  { id: "flute", lbl: "Flûte", svg: SVGS.flute },
  { id: "batterie", lbl: "Batterie", svg: SVGS.batterie },
  { id: "trompette", lbl: "Trompette", svg: SVGS.trompette },
  { id: "saxophone", lbl: "Saxophone", svg: SVGS.saxophone },
  { id: "basse", lbl: "Basse", svg: SVGS.basse },
];

const STEP_ILLUS = {
  1: { svg: SVGS.guitare, lbl: "Guitare basse" },
  2: { svg: SVGS.flute, lbl: "Basson" },
  3: { svg: SVGS.violon, lbl: "Violon" },
  4: { svg: SVGS.batterie, lbl: "Caisse claire" },
  5: { svg: SVGS.trompette, lbl: "Cor d'harmonie" },
  6: { svg: SVGS.trompette, lbl: "Trompette" },
  7: { svg: SVGS.flute, lbl: "Flûte traversière" },
};

const MASCOTTES = ["🦊", "🐸", "🐱", "🐶", "🦄", "🐼", "🐰", "🦋", "🐺"];
const JOURS = ["L", "Ma", "Me", "J", "V", "S", "D"];
const TOTAL = 7;

let _step = 1;
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

function svgWithFill(svgStr) {
  return svgStr.replace("<svg", `<svg fill="var(--ca-purple)"`);
}

function buildFormContent(step) {
  switch (step) {
    case 1:
      return `
        <p class="ca-question">Quel est ton <em>prénom</em> ?</p>
        <input class="ca-input" type="text" id="ca-f1"
          placeholder="Prénom" value="${esc(_state.prenom)}"
          oninput="window.__ca_input('prenom', this.value)">`;

    case 2:
      return `
        <p class="ca-question">Quel est ton <em>âge</em> ?</p>
        <input class="ca-input" type="number" id="ca-f2"
          placeholder="Âge" min="5" max="99" value="${esc(_state.age)}"
          oninput="window.__ca_input('age', this.value)">`;

    case 3: {
      const cards = INSTRUMENTS.map(
        (ins) => `
        <div class="ca-instr-card${_state.instrument === ins.id ? " sel" : ""}"
          onclick="window.__ca_pick('instrument','${ins.id}')">
          <div class="ca-instr-icon">${ins.svg}</div>
          <span class="ca-instr-lbl">${ins.lbl}</span>
        </div>`,
      ).join("");
      return `
        <p class="ca-question" style="margin-bottom:12px">Quel <em>instrument</em> pratiques-tu ?</p>
        <div class="ca-instr-grid">${cards}</div>`;
    }

    case 4:
      return `
        <p class="ca-question">
          Depuis <em>combien de temps</em> tu pratiques cet instrument ?
          <small class="ca-hint">(N'oublies pas de préciser si c'est en mois ou en années)</small>
        </p>
        <input class="ca-input" type="text" id="ca-f4"
          placeholder="Durée" value="${esc(_state.duree)}"
          oninput="window.__ca_input('duree', this.value)">`;

    case 5:
      return `
        <p class="ca-question">Tu es dans quelle <em>école</em> ou <em>conservatoire</em> ?</p>
        <input class="ca-input" type="text" id="ca-f5"
          placeholder="École" value="${esc(_state.ecole)}"
          oninput="window.__ca_input('ecole', this.value)">`;

    case 6: {
      const cells = MASCOTTES.map(
        (m) => `
        <div class="ca-mascot-cell${_state.mascotte === m ? " sel" : ""}"
          onclick="window.__ca_pick('mascotte','${m}')">${m}</div>`,
      ).join("");
      return `
        <p class="ca-question" style="margin-bottom:12px">Choisis une <em>mascotte</em> !</p>
        <div class="ca-mascot-grid">${cells}</div>`;
    }

    case 7: {
      const pills = JOURS.map(
        (j) => `
        <button class="ca-day-pill${_state.jours.includes(j) ? " sel" : ""}"
          onclick="window.__ca_toggleDay('${j}')">${j}</button>`,
      ).join("");
      return `
        <p class="ca-question" style="margin-bottom:14px">Quels jours veux-tu <em>travailler</em> ?</p>
        <div class="ca-days-row">${pills}</div>`;
    }

    default:
      return "";
  }
}

function isStepValid(step) {
  switch (step) {
    case 1:
      return _state.prenom.trim() !== "";
    case 2:
      return _state.age !== "";
    case 3:
      return _state.instrument !== "";
    case 4:
      return _state.duree.trim() !== "";
    case 5:
      return _state.ecole.trim() !== "";
    case 6:
      return _state.mascotte !== "";
    case 7:
      return _state.jours.length > 0;
    default:
      return false;
  }
}

export const CreateAccountPage = {
  reset() {
    _step = 1;
    _state = {
      prenom: "",
      age: "",
      instrument: "",
      duree: "",
      ecole: "",
      mascotte: "",
      jours: [],
    };
  },

  getHTML() {
    if (_step === 8) {
      const instrLbl =
        INSTRUMENTS.find((i) => i.id === _state.instrument)?.lbl ??
        "ton instrument";
      return `
        <div class="ca-screen ca-success">
          <div class="ca-success-body">
            <div class="ca-success-mascot">${_state.mascotte || "🎵"}</div>
            <h2 class="ca-success-title">Bienvenue, ${esc(_state.prenom)} !</h2>
            <p class="ca-success-msg">
              Ton compte est prêt.<br>
              Lance-toi et pratique <strong>${esc(instrLbl)}</strong> chaque jour !
            </p>
          </div>
          <div class="ca-footer">
            <button class="ca-btn-next" id="ca-btn-start">Commencer l'aventure 🚀</button>
          </div>
        </div>`;
    }

    const illus = STEP_ILLUS[_step];
    const valid = isStepValid(_step);
    const backBtn =
      _step > 1
        ? `<button class="ca-back-btn" id="ca-back">&#8592;</button>`
        : "";

    return `
      <div class="ca-screen">

        <!-- Barre du haut -->
        <div class="ca-top-bar">${backBtn}</div>

        <!-- Contenu scrollable -->
        <div class="ca-content">
          <h1 class="ca-title">Création de compte</h1>
          <p class="ca-step-label">${_step}/${TOTAL}</p>

          <!-- Illustration décorative -->
          <div class="ca-illus-wrap">
            ${svgWithFill(illus.svg)}
            <span class="ca-illus-name">${illus.lbl}</span>
          </div>

          <!-- Champ / sélecteur propre à l'étape -->
          <div class="ca-form-block">
            ${buildFormContent(_step)}
          </div>
        </div>

        <!-- Pied de page fixe -->
        <div class="ca-footer">
          <button class="ca-btn-next" id="ca-btn-next" ${valid ? "" : "disabled"}>
            ${_step === TOTAL ? "Terminé !" : "Suivant"}
          </button>
          <span class="ca-note-deco">♩</span>
          ${
            _step === 1
              ? `<p class="ca-login-hint">
                Tu as déjà un compte ? <a href="#login" class="ca-login-link">Connecte-toi !</a>
               </p>`
              : ""
          }
        </div>

      </div>`;
  },

  afterRender() {
    const btnNext = document.getElementById("ca-btn-next");
    const btnBack = document.getElementById("ca-back");
    const btnStart = document.getElementById("ca-btn-start");

    // --- BOUTON SUIVANT / TERMINÉ ---
    btnNext?.addEventListener("click", async () => {
      if (!isStepValid(_step)) return;

      // Si on est à la dernière étape (7), on enregistre en BDD
      if (_step === TOTAL) {
        btnNext.disabled = true;
        btnNext.textContent = "Chargement...";

        try {
          const response = await fetch("/api/signup/child", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(_state),
          });

          const result = await response.json();

          if (result.success) {
            // On sauvegarde l'ID de l'enfant pour créer le compte adulte après
            localStorage.setItem("currentChildId", result.childId);
            _step = 8; // Passage à l'écran de succès
            window.appController?.navigateToPage("createAccount");
          } else {
            alert("Erreur: " + result.error);
            btnNext.disabled = false;
            btnNext.textContent = "Terminé !";
          }
        } catch (err) {
          console.error("Erreur réseau:", err);
          alert("Impossible de joindre le serveur.");
          btnNext.disabled = false;
        }
      } else {
        // Sinon, on avance simplement d'une étape
        _step++;
        window.appController?.navigateToPage("createAccount");
      }
    });

    // --- BOUTON RETOUR ---
    btnBack?.addEventListener("click", () => {
      if (_step > 1) {
        _step--;
        window.appController?.navigateToPage("createAccount");
      }
    });

    document.getElementById("ca-btn-start")?.addEventListener("click", () => {
      window.appController?.model.login(); // Enregistre la connexion
      window.appController?.navigateToPage("home");
    });

    btnStart?.addEventListener("click", () => {
      // C'est ici qu'on redirige vers la création du compte ADULTE
      window.appController?.navigateToPage("createAdultAccount");
    });
    // --- FONCTIONS GLOBALES (Window) ---
    // On les définit une seule fois proprement
    window.__ca_input = (key, value) => {
      _state[key] = value;
      if (btnNext) btnNext.disabled = !isStepValid(_step);
    };

    window.__ca_pick = (key, value) => {
      _state[key] = value;
      // Pour les sélections (instruments/mascottes), on rafraîchit la page pour montrer le "sel" (sélectionné)
      window.appController?.navigateToPage("createAccount");
    };

    window.__ca_toggleDay = (jour) => {
      const idx = _state.jours.indexOf(jour);
      if (idx === -1) _state.jours.push(jour);
      else _state.jours.splice(idx, 1);
      window.appController?.navigateToPage("createAccount");
    };
  },
};
