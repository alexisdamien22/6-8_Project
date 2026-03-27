import { HomePage } from "./pages/HomePage.js";
import { PodiumPage } from "./pages/PodiumPage.js";
import { MusicPage } from "./pages/MusicPage.js";
import { ProfilPage } from "./pages/ProfilPage.js";
import { SettingsPage } from "./pages/SettingsPage.js";
import { AppViewTheme } from "./AppViewTheme.js";
import { AppViewNavigation } from "./AppViewNavigation.js";
import { initAppEvents } from "./AppViewEvents.js";
import { CreateAccountPage } from "./pages/CreateAccountPage.js";
import { AppFireChange } from "./AppFireChange.js";

export class AppView {
  constructor() {
    this.app = document.getElementById("app");
    AppViewTheme.init();
    initAppEvents(this);
    this.setupFooterNavigation();
    this.updateHeaderStreak();
  }

  setupFooterNavigation() {
    const icons = document.querySelectorAll(".icon-footer");
    const pages = ["home", "podium", "music", "menu"];
    if (icons.length === 0) return;

    const hash = window.location.hash.substring(1);
    let activeIndex = pages.indexOf(
      hash === "settings" || hash === "profil" ? "menu" : hash || "home",
    );
    if (activeIndex === -1) activeIndex = 0;

    this.syncFooter(activeIndex);
    window.addEventListener("resize", () =>
      this.syncFooter(
        pages.indexOf(
          document.querySelector(".icon-footer.active")?.dataset?.page ||
            "home",
        ),
      ),
    );

    icons.forEach((icon, index) => {
      icon.onclick = () => {
        if (pages[index] === "menu") {
          this.toggleBottomMenu();
        } else {
          this.toggleBottomMenu(false, true);
          this.syncFooter(index);
          window.appController?.navigateToPage(pages[index]);
        }
      };
    });
  }

  syncFooter(index) {
    const icons = document.querySelectorAll(".icon-footer");
    icons.forEach((i) => i.classList.remove("active"));
    if (icons[index]) {
      icons[index].classList.add("active");
      AppViewNavigation.updateSlider(index, true);
    }
  }

  updateFooterSlider(index, anim) {
    AppViewNavigation.updateSlider(index, anim);
  }

  toggleBottomMenu(force, skipReset = false) {
    AppViewNavigation.createBottomMenu(this);
    const container = document.getElementById("bottom-menu-container");
    const show =
      force !== undefined ? force : !container.classList.contains("show");
    container.classList.toggle("show", show);
    if (!show && !skipReset) {
      const pages = ["home", "podium", "music", "menu"];
      const hash = window.location.hash.substring(1) || "home";
      this.syncFooter(
        pages.indexOf(hash === "settings" || hash === "profil" ? "menu" : hash),
      );
    }
  }

  renderHome(data) {
    const footer = document.querySelector(".main-footer");
    if (footer) footer.style.display = "";

    const header = document.querySelector("header, .main-header");
    if (header) {
      header.style.display = "";
    }

    this.updateHeaderStreak();

    this.app.innerHTML = HomePage.getHTML(data);
    HomePage.afterRender();
  }

  async updateHeaderStreak() {
    const streakText = document.querySelector(".strik-text");
    const streakIcon = document.querySelector(".strik-icon");

    let streakValue = localStorage.getItem("strik") || "0";

    this.updateStreakDisplay(streakText, streakIcon, streakValue);

    const activeChildId = localStorage.getItem("activeChildId");
    if (activeChildId) {
      try {
        const response = await fetch(`/api/child/${activeChildId}/streak`);

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(
            "Le serveur n'a pas renvoyé de JSON, ancienne mise en cache probable.",
          );
        }

        const res = await response.json();
        if (res.success) {
          const realStreak = res.streak.toString();

          if (realStreak !== streakValue) {
            localStorage.setItem("strik", realStreak);
            this.updateStreakDisplay(streakText, streakIcon, realStreak);
          }
        }
      } catch (e) {
        console.error("Erreur de synchronisation du streak :", e);
      }
    }
  }

  updateStreakDisplay(textElement, iconElement, streakValue) {
    if (textElement) {
      textElement.textContent = streakValue;
    }
    if (iconElement) {
      const flamePath = AppFireChange.FireTextur(parseInt(streakValue));
      if (iconElement.tagName.toLowerCase() === "img") {
        iconElement.src = flamePath;
      } else {
        iconElement.style.backgroundImage = `url('${flamePath}')`;
      }
    }
  }

  renderPageTitle(titleText) {
    this.app.textContent = "";
    const title = document.createElement("h1");
    title.textContent = titleText;
    this.app.appendChild(title);
  }

  renderPodium() {
    this.renderPageTitle("Podium");
  }

  renderMusic() {
    this.renderPageTitle("Musique");
  }

  renderSettings() {
    const isLightMode = document.body.classList.contains("light-mode");

    this.app.textContent = "";

    const container = document.createElement("div");
    container.style.paddingTop = "12dvh";
    container.style.textAlign = "center";
    container.style.color = "var(--color-text-main)";

    const title = document.createElement("h1");
    title.textContent = "Paramètres";

    const subtitle = document.createElement("p");
    subtitle.textContent = "Gérez vos options ici.";

    const switchWrapper = document.createElement("div");
    switchWrapper.className = "theme-switch-wrapper";

    const darkLabel = document.createElement("span");
    darkLabel.textContent = "Sombre";

    const lightLabel = document.createElement("span");
    lightLabel.textContent = "Clair";

    const label = document.createElement("label");
    label.className = "theme-switch";
    label.setAttribute("for", "theme-checkbox");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "theme-checkbox";
    checkbox.checked = isLightMode;

    const slider = document.createElement("div");
    slider.className = "slider";

    label.appendChild(checkbox);
    label.appendChild(slider);

    switchWrapper.appendChild(darkLabel);
    switchWrapper.appendChild(label);
    switchWrapper.appendChild(lightLabel);

    container.appendChild(title);
    container.appendChild(subtitle);
    container.appendChild(switchWrapper);

    this.app.appendChild(container);
  }

  renderProfil(data) {
    this.app.textContent = "";

    const page = document.createElement("div");
    page.className = "profile-page";

    const mascotWrap = document.createElement("div");
    mascotWrap.className = "profil-img";
    mascotWrap.style.display = "flex";
    mascotWrap.style.alignItems = "center";
    mascotWrap.style.justifyContent = "center";
    mascotWrap.style.fontSize = "4rem";
    mascotWrap.textContent = data?.mascotte || "👤";

    const name = document.createElement("p");
    name.className = "profil-name";
    name.textContent = data?.name || "Profil";

    const statsRow = document.createElement("div");
    statsRow.className = "stats-row";

    const card1 = document.createElement("div");
    card1.className = "card";
    const h1 = document.createElement("h3");
    h1.textContent = "Série actuelle";

    const streakWrap = document.createElement("div");
    streakWrap.className = "strik";
    streakWrap.style.marginTop = "10px";
    streakWrap.style.justifyContent = "center";

    const streakIcon = document.createElement("img");
    streakIcon.className = "strik-icon";
    const streakText = document.createElement("span");
    streakText.className = "strik-text";

    streakWrap.append(streakIcon, streakText);
    const currentStreak =
      data?.streakData?.current_streak || localStorage.getItem("strik") || "0";
    this.updateStreakDisplay(streakText, streakIcon, currentStreak);

    card1.appendChild(h1);
    card1.appendChild(streakWrap);

    const card2 = document.createElement("div");
    card2.className = "card";
    const h2 = document.createElement("h3");
    h2.textContent = "Instrument";
    const p2 = document.createElement("p");
    p2.textContent = data?.instrument
      ? data.instrument.charAt(0).toUpperCase() + data.instrument.slice(1)
      : "-";
    p2.style.fontSize = "1.2rem";
    p2.style.marginTop = "10px";
    card2.appendChild(h2);
    card2.appendChild(p2);

    statsRow.appendChild(card1);
    statsRow.appendChild(card2);

    const history = document.createElement("div");
    history.className = "history-section";

    const h3 = document.createElement("h3");
    h3.textContent = "Historique des séances";

    history.appendChild(h3);

    page.appendChild(mascotWrap);
    page.appendChild(name);
    page.appendChild(statsRow);
    page.appendChild(history);

    this.app.appendChild(page);
  }

  renderCreateAccount() {
    const footer = document.querySelector(".main-footer");
    if (footer) footer.style.display = "none";

    const header = document.querySelector("header, .main-header");
    if (header) header.style.display = "none";

    this.app.innerHTML = CreateAccountPage.getHTML();
    CreateAccountPage.afterRender();
  }
  async saveStreakToServer(newStreak) {
    const activeChildId = localStorage.getItem("activeChildId");
    if (!activeChildId) return;

    const today = new Date().toISOString().split("T")[0];

    try {
      const response = await fetch(`/api/child/${activeChildId}/streak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          streak: parseInt(newStreak),
          lastDate: today,
        }),
      });

      const res = await response.json();
      if (!res.success) {
        console.error("Erreur serveur lors de la sauvegarde du streak");
      }
    } catch (e) {
      console.error("Erreur réseau lors de la sauvegarde du streak :", e);
    }
  }
}
