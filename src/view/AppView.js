import { HomePage } from "./pages/HomePage.js";
import { PodiumPage } from "./pages/PodiumPage.js";
import { MusicPage } from "./pages/MusicPage.js";
import { ProfilPage } from "./pages/ProfilPage.js";
import { SettingsPage } from "./pages/SettingsPage.js";
import { AppViewTheme } from "./AppViewTheme.js";
import { AppViewNavigation } from "./AppViewNavigation.js";
import { initAppEvents } from "./AppViewEvents.js";

export class AppView {
  constructor() {
    this.app = document.getElementById("app");
    AppViewTheme.init();
    initAppEvents(this);
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
    this.app.innerHTML = HomePage.getHTML(data);
    HomePage.afterRender();
  }
  renderPodium() {
    this.app.innerHTML = PodiumPage.getHTML();
  }
  renderMusic() {
    this.app.innerHTML = MusicPage.getHTML();
  }
  renderProfil() {
    this.app.innerHTML = ProfilPage.getHTML();
  }
  renderSettings() {
    this.app.innerHTML = SettingsPage.getHTML();
  }
}
