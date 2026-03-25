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
      if (e.target.closest(".parametre")) {
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
        } catch (err) {}
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
            } catch (err) {}
          }
        });
    };

    this.app.addEventListener("pointerup", releaseButton);
    this.app.addEventListener("pointercancel", releaseButton);
    this.app.addEventListener("pointerleave", releaseButton);
  }

  renderHome(childData) {
    let pathHTML = "";
    const joursFr = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    let dayActuel = joursFr[new Date().getDay()];

    const pattern = [0, 45, 25, -25, -45];

    for (let i = 0; i < childData.sessions.length; i++) {
      let session = childData.sessions[i];
      let offset = pattern[i % pattern.length];

      let mascotteHTML = "";
      let haloHTML = "";
      let popupContent = "";
      let lockedClass = "";

      if (session.day === dayActuel) {
        mascotteHTML = `<img src="/assets/img/mascottes/camelion.png" class="mascotte-path" alt="Mascotte">`;
        haloHTML = `<div class="today-halo"></div>`;
      }
      if (session.day === dayActuel) {
        popupContent = `
                  <h3>Leçon ${i + 1}</h3>
                  <p>Prêt pour un défi ?</p>
                  <button class="start-btn">COMMENCER</button>
              `;
      } else if (session.status === "done") {
        popupContent = `
                  <h3>Leçon ${i + 1}</h3>
                  <p>Bravo ! Tu as validé cette séance.</p>
              `;
      } else {
        lockedClass = "is-locked";
        popupContent = `
                  <h3>Leçon ${i + 1}</h3>
                  <p>Patience... cette leçon n'est pas encore disponible.</p>
                  <button class="start-btn disabled" disabled>
                      <span class="icon-lock">🔒</span> BLOQUÉ
                  </button>
              `;
      }

      pathHTML += `
                <div class="path-step ${session.status} ${lockedClass}" style="transform: translateX(${offset}px); z-index: 1;">
                    <div class="path-button-container">
                        ${haloHTML}
                        ${mascotteHTML}
                        <div class="path-dot-shadow"></div> 
                        <div class="path-dot"></div>
                        <div class="duo-popup">
                          <div class="popup-arrow"></div>
                          ${popupContent}
                        </div>    
                    </div>
                    <span class="path-label">${session.day}</span>
                </div>`;
    }

    this.app.innerHTML = `
            <div class="home-screen">
                <div class="path-container">
                    ${pathHTML}
                </div>
            </div>
        `;

    this.scrollToCurrentDay();
  }

  scrollToCurrentDay() {
    const currentElement = this.app.querySelector(".mascotte-path");
    if (currentElement) {
      setTimeout(() => {
        currentElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
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
    let targetPage = hash === "settings" ? "menu" : hash;
    let activeIndex = pages.indexOf(targetPage);
    if (activeIndex === -1) activeIndex = 0;

    footerIcons.forEach((i) => i.classList.remove("active"));
    footerIcons[activeIndex].classList.add("active");

    setTimeout(() => this.updateFooterSlider(activeIndex, false), 50);

    window.addEventListener("resize", () => {
      const activeIdx = Array.from(footerIcons).findIndex((i) =>
        i.classList.contains("active"),
      );
      if (activeIdx !== -1) this.updateFooterSlider(activeIdx, false);
    });

    footerIcons.forEach((icon, index) => {
      icon.addEventListener("click", () => {
        footerIcons.forEach((i) => i.classList.remove("active"));
        icon.classList.add("active");

        this.updateFooterSlider(index, true);

        const currentPage = pages[index];

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
        ? "left 0.3s cubic-bezier(0.25, 1, 0.5, 1), width 0.3s cubic-bezier(0.25, 1, 0.5, 1)"
        : "none";
      slider.style.width = `${icon.offsetWidth}px`;
      slider.style.left = `${icon.offsetLeft}px`;
    });
  }

  renderPodium() {
    this.app.innerHTML = `
      <h1>Podium</h1>    
    `;
  }

  renderMusic() {
    this.app.innerHTML = `
      <h1>Musique</h1>
    `;
  }

  renderMenu() {
    this.app.innerHTML = `
      <h1>Menu</h1>
    `;
  }

  renderSettings() {
    const isLightMode = document.body.classList.contains("light-mode");

    this.app.innerHTML = `
      <div style="padding-top: 12vh; text-align: center; color: var(--color-text-main);">
        <h1>Paramètres</h1>
        <p>Gérez vos options ici.</p>
        
        <div class="theme-switch-wrapper">
          <span>Sombre</span>
          <label class="theme-switch" for="theme-checkbox">
            <input type="checkbox" id="theme-checkbox" ${isLightMode ? "checked" : ""} />
            <div class="slider"></div>
          </label>
          <span>Clair</span>
        </div>
      </div>
    `;
  }

  initTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      document.body.classList.add("light-mode");
    }
  }
}
