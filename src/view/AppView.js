import { HomePage } from "./pages/HomePage.js";
import { PodiumPage } from "./pages/PodiumPage.js";
import { MusicPage } from "./pages/MusicPage.js";
import { ProfilPage } from "./pages/ProfilPage.js";
import { SettingsPage } from "./pages/SettingsPage.js";
import { RegisterParentPage } from "./pages/RegisterParentPage.js";
import { RegisterChildPage } from "./pages/RegisterChildPage.js";
import { LoginPage } from "./pages/LoginPage.js";
import { AppViewTheme } from "./AppViewTheme.js";
import { AppViewNavigation } from "./AppViewNavigation.js";
import { initAppEvents } from "./AppViewEvents.js";
import { AccountSwitcher } from "./AccountSwitcher.js";

import { ParentHomePage } from "./pages/ParentHomePage.js";
import { AppFireChange } from "./AppFireChange.js";
import { setSecureHTML } from "../utils/SecurityHelpers.js";

export class AppView {
  constructor(model) {
    this.app = document.getElementById("app");
    this.model = model;
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
  toggleAccountSwitcher(show) {
    let switcher = document.getElementById("account-switcher-container");

    if (!switcher && show) {
      const children = this.model?.getChildren ? this.model.getChildren() : [];
      AccountSwitcher.create(this, children);
      // On récupère l'élément juste après la création
      switcher = document.getElementById("account-switcher-container");
    }

    if (switcher) {
      if (show) {
        switcher.classList.add("show");
        document.body.style.overflow = "hidden";
      } else {
        switcher.classList.remove("show");
        document.body.style.overflow = "";
      }
    }
  }

  renderHome(data) {
    const footer = document.querySelector(".main-footer");
    if (footer) footer.style.display = "";

    const header = document.querySelector("header, .main-header");
    if (header) header.style.display = "";

    this.updateHeaderStreak();
    setSecureHTML(this.app, HomePage.getHTML(data));
    HomePage.afterRender();
  }

  renderParentHome(data) {
    const footer = document.querySelector(".main-footer");
    if (footer) footer.style.display = "none";

    const header = document.querySelector("header, .main-header");
    if (header) header.style.display = "";

    setSecureHTML(this.app, ParentHomePage.getHTML(data));
    ParentHomePage.afterRender();
  }

  updateHeaderStreak(value = null) {
    const streakText = document.querySelector(".strik-text");
    const streakIcon = document.querySelector(".strik-icon");
    const streakValue =
      value !== null ? value : localStorage.getItem("streak") || "0";

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
    setSecureHTML(this.app, `<h1>${titleText}</h1>`);
  }

  renderPodium() {
    this.renderPageTitle("Podium");
  }

  renderMusic() {
    this.renderPageTitle("Musique");
  }

  renderSettings() {
    setSecureHTML(this.app, SettingsPage.getHTML());
  }

  renderProfil(data) {
    setSecureHTML(this.app, ProfilPage.getHTML(data));
  }
  renderRegisterParent() {
    const footer = document.querySelector(".main-footer");
    if (footer) footer.style.display = "none";

    const header = document.querySelector("header, .main-header");
    if (header) header.style.display = "none";
    setSecureHTML(this.app, RegisterParentPage.getHTML());
    RegisterParentPage.attachEventListeners();
  }
  renderRegisterChild() {
    const footer = document.querySelector(".main-footer");
    if (footer) footer.style.display = "none";

    const header = document.querySelector("header, .main-header");
    if (header) header.style.display = "none";

    setSecureHTML(this.app, RegisterChildPage.getHTML());
    RegisterChildPage.attachEventListeners();
  }
  renderLogin() {
    const footer = document.querySelector(".main-footer");
    if (footer) footer.style.display = "none";

    const header = document.querySelector("header, .main-header");
    if (header) header.style.display = "none";
    setSecureHTML(this.app, LoginPage.getHTML());
    LoginPage.attachEventListeners();
  }
}
