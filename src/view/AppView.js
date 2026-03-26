class AppView {
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
      if (e.target.closest(".duo-popup")) {
        return;
      }

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

  renderHome(childData) {
    this.app.textContent = "";

    const joursFr = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const dayActuel = joursFr[new Date().getDay()];
    const pattern = [0, 45, 25, -25, -45];

    const homeScreen = document.createElement("div");
    homeScreen.className = "home-screen";

    const pathContainer = document.createElement("div");
    pathContainer.className = "path-container";

    childData.sessions.forEach((session, i) => {
      const offset = pattern[i % pattern.length];

      const step = document.createElement("div");
      step.className = `path-step ${session.status}`;
      step.style.transform = `translateX(${offset}px)`;
      step.style.zIndex = "1";

      if (session.status !== "done" && session.day !== dayActuel) {
        step.classList.add("is-locked");
      }

      const btnContainer = document.createElement("div");
      btnContainer.className = "path-button-container";

      if (session.day === dayActuel) {
        const halo = document.createElement("div");
        halo.className = "today-halo";
        btnContainer.appendChild(halo);

        const mascotte = document.createElement("img");
        mascotte.src = "/assets/img/mascottes/camelion.png";
        mascotte.className = "mascotte-path";
        mascotte.alt = "Mascotte";
        btnContainer.appendChild(mascotte);
      }

      const shadow = document.createElement("div");
      shadow.className = "path-dot-shadow";

      const dot = document.createElement("div");
      dot.className = "path-dot";

      btnContainer.appendChild(shadow);
      btnContainer.appendChild(dot);

      const popup = document.createElement("div");
      popup.className = "duo-popup";

      const arrow = document.createElement("div");
      arrow.className = "popup-arrow";
      popup.appendChild(arrow);

      const title = document.createElement("h3");
      title.textContent = `Leçon ${i + 1}`;
      popup.appendChild(title);

      const text = document.createElement("p");

      if (session.day === dayActuel) {
        text.textContent = "Prêt pour un défi ?";
        popup.appendChild(text);

        const btn = document.createElement("button");
        btn.className = "start-btn";
        btn.textContent = "COMMENCER";
        popup.appendChild(btn);

      } else if (session.status === "done") {
        text.textContent = "Bravo ! Tu as validé cette séance.";
        popup.appendChild(text);

      } else {
        text.textContent = "Patience... cette leçon n'est pas encore disponible.";
        popup.appendChild(text);

        const btn = document.createElement("button");
        btn.className = "start-btn disabled";
        btn.disabled = true;

        const lock = document.createElement("span");
        lock.className = "icon-lock";
        lock.textContent = "🔒";

        btn.appendChild(lock);
        btn.append(" BLOQUÉ");
        popup.appendChild(btn);
      }

      btnContainer.appendChild(popup);

      const label = document.createElement("span");
      label.className = "path-label";
      label.textContent = session.day;

      step.appendChild(btnContainer);
      step.appendChild(label);
      pathContainer.appendChild(step);
    });

    homeScreen.appendChild(pathContainer);
    this.app.appendChild(homeScreen);

    this.scrollToCurrentDay();
  }

  scrollToCurrentDay() {
    const currentElement = this.app.querySelector(".mascotte-path");
    if (currentElement) {
      currentElement.scrollIntoView({
        behavior: "auto",
        block: "center",
      });
    }
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
    footerIcons.forEach((icon) =>
      icon.addEventListener("load", updateSliderPosition),
    );
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
          return;
        } else {
          this.toggleBottomMenu(false, true);
        }

        if (window.appController) {
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

      if (icon.offsetWidth > 0) {
        slider.style.opacity = "1";
      }
    });
  }

  createBottomMenu() {
    if (document.getElementById("bottom-menu-container")) return;

    const container = document.createElement("div");
    container.id = "bottom-menu-container";
    container.className = "bottom-menu-container";

    const overlay = document.createElement("div");
    overlay.className = "bottom-menu-overlay";

    const sheet = document.createElement("div");
    sheet.className = "bottom-menu-sheet";

    const itemCompte = document.createElement("div");
    itemCompte.className = "bottom-menu-item";
    itemCompte.id = "btn-compte";

    const spanCompte = document.createElement("span");
    spanCompte.textContent = "Compte";
    itemCompte.appendChild(spanCompte);

    const itemParam = document.createElement("div");
    itemParam.className = "bottom-menu-item";
    itemParam.id = "btn-parametre-menu";

    const spanParam = document.createElement("span");
    spanParam.textContent = "Paramètres";
    itemParam.appendChild(spanParam);

    sheet.appendChild(itemCompte);
    sheet.appendChild(itemParam);

    container.appendChild(overlay);
    container.appendChild(sheet);

    document.body.appendChild(container);

    overlay.addEventListener("click", () => this.toggleBottomMenu(false));

    itemParam.addEventListener("click", () => {
      this.toggleBottomMenu(false, true);
      if (window.appController) {
        window.appController.navigateToPage("settings");
        const footerIcons = document.querySelectorAll(".icon-footer");
        if (footerIcons.length > 3) {
          footerIcons.forEach(i => i.classList.remove("active"));
          footerIcons[3].classList.add("active");
          this.updateFooterSlider(3, true);
        }
      }
    });

    itemCompte.addEventListener("click", () => {
      this.toggleBottomMenu(false, true);
      if (window.appController) {
        window.appController.navigateToPage("profil");
        const footerIcons = document.querySelectorAll(".icon-footer");
        if (footerIcons.length > 3) {
          footerIcons.forEach(i => i.classList.remove("active"));
          footerIcons[3].classList.add("active");
          this.updateFooterSlider(3, true);
        }
      }
    });
  }


  toggleBottomMenu(forceShow, skipSliderReset = false) {
    this.createBottomMenu();
    const container = document.getElementById("bottom-menu-container");
    const isShowing = container.classList.contains("show");
    const shouldShow = forceShow !== undefined ? forceShow : !isShowing;

    if (shouldShow) {
      setTimeout(() => {
        container.classList.add("show");
      }, 0);
    } else {
      container.classList.remove("show");

      if (!skipSliderReset) {
        const hash = window.location.hash.substring(1) || "home";
        let targetPage =
          hash === "settings" || hash === "profil" ? "menu" : hash;
        const pages = ["home", "podium", "music", "menu"];
        let activeIndex =
          pages.indexOf(targetPage) !== -1 ? pages.indexOf(targetPage) : 0;

        const footerIcons = document.querySelectorAll(".icon-footer");
        if (footerIcons[activeIndex]) {
          footerIcons.forEach((i) => i.classList.remove("active"));
          footerIcons[activeIndex].classList.add("active");
          this.updateFooterSlider(activeIndex, true);
        }
      }
    }
  }

  renderPodium() {
    this.app.textContent = "";

    const title = document.createElement("h1");
    title.textContent = "Podium";

    this.app.appendChild(title);
  }

  renderMusic() {
    this.app.textContent = "";

    const title = document.createElement("h1");
    title.textContent = "Musique";

    this.app.appendChild(title);
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

  initTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      if (savedTheme === "light") {
        document.body.classList.add("light-mode");
      }
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      document.body.classList.add("light-mode");
    }
  }
}
