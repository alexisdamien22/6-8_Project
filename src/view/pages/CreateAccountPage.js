const ICONS = {
  basson: "./assets/img/icons/basson.png",
  guitare: "./assets/img/icons/guitar.png",
  violon: "./assets/img/icons/violin.png",
  flute: "./assets/img/icons/recorder.png",
  batterie: "./assets/img/icons/drum.png",
  trompette: "./assets/img/icons/trumpet.png",
  corHarmonie: "./assets/img/icons/french-horn.png",
  // basse: "./assets/img/icons/basse.png",
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
  2: { png: ICONS.flute, lbl: "Flute" },
  3: { png: ICONS.violon, lbl: "Violon" },
  4: { png: ICONS.batterie, lbl: "Batteriee" },
  5: { png: ICONS.corHarmonie, lbl: "Cor d'harmonie" },
  6: { png: ICONS.trompette, lbl: "Trompette" },
  7: { png: ICONS.flute, lbl: "Flûte traversière" },
};

const MASCOTTES = ["🦊", "🐸", "🐱", "🐶", "🦄", "🐼", "🐰", "🦋", "🐺"]; // Crop les images des mascottes
const JOURS = ["L", "Ma", "Me", "J", "V", "S", "D"];
const TOTAL = 8; // Derniere modification (7)

let _step = 1;
let _state = {
  prenom: "",
  age: "",
  instrument: "",
  duree: "",
  ecole: "",
  jourCours: "", // Dernier ajout
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

    case 6: { // Dernier ajout
        const pills = JOURS.map(
            (j) => `
            <button class="ca-day-pill${_state.jourCours === j ? " sel" : ""}"
            onclick="window.__ca_setCourseDay('${j}')">${j}</button>`,
        ).join("");

        return `
            <p class="ca-question" style="margin-bottom:14px">Quel jour as-tu ton <em>cours</em> de musique ?</p>
            <div class="ca-days-row">${pills}</div>`;
        }

    case 7: {
      const cells = MASCOTTES.map(
        (m) => `
        <div class="ca-mascot-cell${_state.mascotte === m ? " sel" : ""}"
          onclick="window.__ca_pick('mascotte','${m}')">${m}</div>`,
      ).join("");
      return `
        <p class="ca-question" style="margin-bottom:12px">Choisis une <em>mascotte</em> !</p>
        <div class="ca-mascot-grid">${cells}</div>`;
    }

    case 8: {
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
    case 6: // Nouveau, le reste est décalé
        return _state.jourCours !== ""; 
    case 7:
        return _state.mascotte !== "";
    case 8:
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
    if (_step === 9) { // Modifié, il y avait 8
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

      // Si on est à la dernière étape (8), on enregistre en BDD
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
            _step = 8; // Passage à l'écran de succès / À modifier ? / Déja modifié ?
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

    window.__ca_setCourseDay = (jour) => { // Dernier ajout 
        _state.jourCours = jour;
        render(); // Recharge la page pour que le bouton devienne bleu/sélectionné
        };
  },
};
