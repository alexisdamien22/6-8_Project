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

  renderProfil() {
    this.app.textContent = "";

    const page = document.createElement("div");
    page.className = "profile-page";

    const img = document.createElement("img");
    img.className = "profil-img";
    img.src = "/assets/img/other/base-profil.jpg";
    img.alt = "Profil";

    const name = document.createElement("p");
    name.className = "profil-name";
    name.textContent = "Shrek Fée";

    const statsRow = document.createElement("div");
    statsRow.className = "stats-row";

    const card1 = document.createElement("div");
    card1.className = "card";
    const h1 = document.createElement("h3");
    h1.textContent = "Récap";
    card1.appendChild(h1);

    const card2 = document.createElement("div");
    card2.className = "card";
    const h2 = document.createElement("h3");
    h2.textContent = "Meilleurs Amis";
    card2.appendChild(h2);

    statsRow.appendChild(card1);
    statsRow.appendChild(card2);

    const history = document.createElement("div");
    history.className = "history-section";

    const h3 = document.createElement("h3");
    h3.textContent = "Historique des séances";

    history.appendChild(h3);

    page.appendChild(img);
    page.appendChild(name);
    page.appendChild(statsRow);
    page.appendChild(history);

    this.app.appendChild(page);
  }
}
