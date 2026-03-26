import { HomePage } from "./pages/HomePage.js";
import { PodiumPage } from "./pages/PodiumPage.js";
import { MusicPage } from "./pages/MusicPage.js";
import { ProfilPage } from "./pages/ProfilPage.js";
import { SettingsPage } from "./pages/SettingsPage.js";

export class AppView {
  constructor() {
    this.app = document.getElementById("app");
    this.initEventListeners();
    this.initTheme();
  }

  initEventListeners() {
    document.addEventListener("change", (e) => {
      if (e.target.id === "theme-checkbox") {
        if (e.target.checked) {
          document.body.classList.add("light-mode");
          localStorage.setItem("theme", "light");
        } else {
          document.body.classList.remove("light-mode");
          localStorage.setItem("theme", "dark");
        }
      }
    });

    document.addEventListener("click", (e) => {
      const bottomMenu = document.getElementById("bottom-menu-container");
      if (bottomMenu && bottomMenu.classList.contains("show")) {
        const clickedFooterIcon = e.target.closest(".icon-footer");
        const footerIcons = Array.from(
          document.querySelectorAll(".icon-footer"),
        );
        const isMenuIcon =
          clickedFooterIcon && footerIcons.indexOf(clickedFooterIcon) === 3;

        if (!e.target.closest(".bottom-menu-sheet") && !isMenuIcon) {
          this.toggleBottomMenu(false);
        }
      }

      const parametreButton = e.target.closest(".parametre");
      if (parametreButton) {
        let currentRotation = parseInt(
          parametreButton.dataset.rotation || "0",
          10,
        );
        currentRotation += 360;
        parametreButton.dataset.rotation = currentRotation;
        parametreButton.style.transform = `rotate(${currentRotation}deg)`;

        if (window.appController) {
          window.appController.navigateToPage("settings");
          const footerIcons = document.querySelectorAll(".icon-footer");
          if (footerIcons.length > 3) {
            footerIcons.forEach((i) => i.classList.remove("active"));
            footerIcons[3].classList.add("active");
            this.updateFooterSlider(3, true);
          }
        }
      }
    });

    this.app.addEventListener("click", (e) => {
      const popupClicked = e.target.closest(".duo-popup");
      if (popupClicked) {
        e.stopImmediatePropagation();
        if (e.target.classList.contains("start-btn")) {
          console.log("Démarrage de la leçon !");
        }
        return;
      }

      if (e.target.classList.contains("path-dot")) {
        const step = e.target.closest(".path-step");
        const popup = step.querySelector(".duo-popup");
        document
          .querySelectorAll(".path-step")
          .forEach((s) => (s.style.zIndex = "1"));
        document.querySelectorAll(".duo-popup").forEach((p) => {
          if (p !== popup) p.classList.remove("show");
        });
        const isOpening = !popup.classList.contains("show");
        popup.classList.toggle("show");
        step.style.zIndex = isOpening ? "999" : "1";
      } else {
        document.querySelectorAll(".duo-popup.show").forEach((p) => {
          p.classList.remove("show");
          p.closest(".path-step").style.zIndex = "1";
        });
      }
    });

    this.app.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".duo-popup")) return;
      const button = e.target.closest(".path-button-container");
      if (button) {
        button.classList.add("pressed");
        try {
          button.setPointerCapture(e.pointerId);
        } catch (err) { }
      }
    });

    const releaseButton = (e) => {
      document
        .querySelectorAll(".path-button-container.pressed")
        .forEach((btn) => {
          btn.classList.remove("pressed");
          if (e && e.pointerId) {
            try {
              btn.releasePointerCapture(e.pointerId);
            } catch (err) { }
          }
        });
    };

    this.app.addEventListener("pointerup", releaseButton);
    this.app.addEventListener("pointercancel", releaseButton);
    this.app.addEventListener("pointerleave", releaseButton);
  }

  setupFooterNavigation() {
    const footerIcons = document.querySelectorAll(".icon-footer");
    const footer = document.querySelector(".main-footer");
    const pages = ["home", "podium", "music", "menu"];

    if (!footer || footerIcons.length === 0) return;

    let slider = footer.querySelector(".footer-slider");
    if (!slider) {
      slider = document.createElement("div");
      slider.className = "footer-slider";
      footer.appendChild(slider);
    }

    const hash = window.location.hash.substring(1);
    let targetPage = hash === "settings" || hash === "profil" ? "menu" : hash;
    let activeIndex = pages.indexOf(targetPage);
    if (activeIndex === -1) activeIndex = 0;

    footerIcons.forEach((i) => i.classList.remove("active"));
    footerIcons[activeIndex].classList.add("active");

    const updateSliderPosition = () => {
      const activeIdx = Array.from(footerIcons).findIndex((i) =>
        i.classList.contains("active"),
      );
      if (activeIdx !== -1) this.updateFooterSlider(activeIdx, false);
    };

    setTimeout(updateSliderPosition, 50);
    window.addEventListener("load", updateSliderPosition);
    window.addEventListener("resize", updateSliderPosition);

    footerIcons.forEach((icon, index) => {
      icon.addEventListener("click", () => {
        footerIcons.forEach((i) => i.classList.remove("active"));
        icon.classList.add("active");
        this.updateFooterSlider(index, true);
        const currentPage = pages[index];

        if (currentPage === "menu") {
          const container = document.getElementById("bottom-menu-container");
          const isShowing = container && container.classList.contains("show");
          this.toggleBottomMenu(!isShowing);
        } else {
          this.toggleBottomMenu(false, true);
          if (window.appController)
            window.appController.navigateToPage(currentPage);
        }
      });
    });
  }

  updateFooterSlider(index, animated = true) {
    const footerIcons = document.querySelectorAll(".icon-footer");
    const slider = document.querySelector(".footer-slider");
    if (!slider || !footerIcons[index]) return;

    const icon = footerIcons[index];
    requestAnimationFrame(() => {
      slider.style.transition = animated
        ? "left 0.3s cubic-bezier(0.25, 1, 0.5, 1), width 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease"
        : "none";
      slider.style.width = `${icon.offsetWidth}px`;
      slider.style.left = `${icon.offsetLeft}px`;
      if (icon.offsetWidth > 0) slider.style.opacity = "1";
    });
  }

  createBottomMenu() {
    if (document.getElementById("bottom-menu-container")) return;
    const menuHTML = `
        <div id="bottom-menu-container" class="bottom-menu-container">
            <div class="bottom-menu-overlay"></div>
            <div class="bottom-menu-sheet">
                <div class="bottom-menu-item" id="btn-compte"><span>Compte</span></div>
                <div class="bottom-menu-item" id="btn-parametre-menu"><span>Paramètres</span></div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML("beforeend", menuHTML);

    const container = document.getElementById("bottom-menu-container");
    container.querySelector(".bottom-menu-overlay").onclick = () =>
      this.toggleBottomMenu(false);

    container.querySelector("#btn-parametre-menu").onclick = () => {
      this.toggleBottomMenu(false, true);
      if (window.appController) window.appController.navigateToPage("settings");
    };

    container.querySelector("#btn-compte").onclick = () => {
      this.toggleBottomMenu(false, true);
      if (window.appController) window.appController.navigateToPage("profil");
    };
  }

  toggleBottomMenu(forceShow, skipSliderReset = false) {
    this.createBottomMenu();
    const container = document.getElementById("bottom-menu-container");
    const shouldShow =
      forceShow !== undefined
        ? forceShow
        : !container.classList.contains("show");

    if (shouldShow) {
      setTimeout(() => container.classList.add("show"), 0);
    } else {
      container.classList.remove("show");
      if (!skipSliderReset) {
        const hash = window.location.hash.substring(1) || "home";
        let targetPage =
          hash === "settings" || hash === "profil" ? "menu" : hash;
        const pages = ["home", "podium", "music", "menu"];
        let activeIndex = pages.indexOf(targetPage);
        if (activeIndex !== -1) {
          const footerIcons = document.querySelectorAll(".icon-footer");
          footerIcons.forEach((i) => i.classList.remove("active"));
          if (footerIcons[activeIndex]) {
            footerIcons[activeIndex].classList.add("active");
            this.updateFooterSlider(activeIndex, true);
          }
        }
      }
    }
  }

  renderHome(childData) {
    this.app.innerHTML = HomePage.getHTML(childData);
    HomePage.afterRender();
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

  initTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "light" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: light)").matches)
    ) {
      document.body.classList.add("light-mode");
    }
  }
}
