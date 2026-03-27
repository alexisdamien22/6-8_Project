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

    window.addEventListener("resize", () => {
      const activePage =
        document.querySelector(".icon-footer.active")?.dataset?.page || "home";
      this.syncFooter(pages.indexOf(activePage));
    });

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
    if (header) header.style.display = "";

    this.updateHeaderStreak();
    this.app.innerHTML = HomePage.getHTML(data);
    HomePage.afterRender();
  }

  updateHeaderStreak(value = null) {
    const streakText = document.querySelector(".strik-text");
    const streakIcon = document.querySelector(".strik-icon");
    const streakValue =
      value !== null
        ? value
        : localStorage.getItem("streak") ||
          localStorage.getItem("strik") ||
          "0";

    if (streakText) {
      streakText.textContent = streakValue;
    }

    if (streakIcon) {
      const flamePath = AppFireChange.FireTextur(parseInt(streakValue));
      if (streakIcon.tagName.toLowerCase() === "img") {
        streakIcon.src = flamePath;
      } else {
        streakIcon.style.backgroundImage = `url('${flamePath}')`;
      }
    }
  }

  renderPageTitle(titleText) {
    this.app.innerHTML = `<h1>${titleText}</h1>`;
  }

  renderPodium() {
    this.renderPageTitle("Podium");
  }

  renderMusic() {
    this.renderPageTitle("Musique");
  }

  renderSettings() {
    const isLightMode = document.body.classList.contains("light-mode");

    this.app.innerHTML = `
      <div style="padding-top: 12dvh; text-align: center; color: var(--color-text-main);">
        <h1>Paramètres</h1>
        <p>Gérez vos options ici.</p>
        <div class="theme-switch-wrapper">
          <span>Sombre</span>
          <label class="theme-switch" for="theme-checkbox">
            <input type="checkbox" id="theme-checkbox" ${isLightMode ? "checked" : ""}>
            <div class="slider"></div>
          </label>
          <span>Clair</span>
        </div>
      </div>
    `;
  }

  renderProfil(data) {
    const mascot = data?.mascotte || "👤";
    const name = data?.name || "Profil";
    const currentStreak =
      data?.streakData?.current_streak ||
      localStorage.getItem("streak") ||
      localStorage.getItem("strik") ||
      "0";
    const instrument = data?.instrument
      ? data.instrument.charAt(0).toUpperCase() + data.instrument.slice(1)
      : "-";

    this.app.innerHTML = `
      <div class="profile-page">
        <div class="profil-img" style="display: flex; align-items: center; justify-content: center; font-size: 4rem;">
          ${mascot}
        </div>
        <p class="profil-name">${name}</p>
        
        <div class="stats-row">
          <div class="card">
            <h3>Série actuelle</h3>
            <div class="strik" style="margin-top: 10px; justify-content: center;">
              <img class="strik-icon" src="${AppFireChange.FireTextur(parseInt(currentStreak))}" alt="flame">
              <span class="strik-text">${currentStreak}</span>
            </div>
          </div>
          <div class="card">
            <h3>Instrument</h3>
            <p style="font-size: 1.2rem; margin-top: 10px;">${instrument}</p>
          </div>
        </div>

        <div class="history-section">
          <h3>Historique des séances</h3>
        </div>
      </div>
    `;
  }

  renderCreateAccount() {
    const footer = document.querySelector(".main-footer");
    if (footer) footer.style.display = "none";

    const header = document.querySelector("header, .main-header");
    if (header) header.style.display = "none";

    this.app.innerHTML = CreateAccountPage.getHTML();
    CreateAccountPage.afterRender();
  }
}
