class AppView {
  constructor() {
    this.app = document.getElementById("app");
    this.initEventListeners();
  }

  async loadPartial(url) {
    const res = await fetch(url);
    return await res.text();
  }

  async renderLayout() {
    const headerHTML = await this.loadPartial("/src/view/header.html");
    const footerHTML = await this.loadPartial("/src/view/footer.html");
    this.app.innerHTML = `
      ${headerHTML}
      <main id="main-content"></main>
      ${footerHTML}
    `;
    this.mainContent = document.getElementById("main-content");
  }

  initEventListeners() {
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

  async renderHome(childData) {
    await this.renderLayout();
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

    this.mainContent.innerHTML = `
            <div class="home-screen">
                <div class="lesson-overlay">
                    <div class="path-container">
                        <div id="main-scroll-container">
                            <svg id="staff-svg"></svg>
                            <div id="notes-layer"></div>
                        </div>
                        ${pathHTML}
                    </div>
                </div>
            </div>
        `;

    this.scrollToCurrentDay();
    this.setupFooterNavigation();

    if (window.initPartition) {
      window.initPartition();
    }
  }

  scrollToCurrentDay() {
    const currentElement = this.mainContent.querySelector(".mascotte-path");
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
    const pages = ["home", "podium", "music", "menu"];

    const hash = window.location.hash.substring(1);
    let activeIndex = pages.indexOf(hash);
    if (activeIndex === -1) activeIndex = 0;

    if (footerIcons.length > 0) {
      footerIcons[activeIndex].classList.add("active");
    }

    footerIcons.forEach((icon, index) => {
      icon.addEventListener("click", () => {
        footerIcons.forEach((i) => i.classList.remove("active"));
        icon.classList.add("active");

        const currentPage = pages[index];

        if (window.appController) {
          window.appController.navigateToPage(currentPage);
        }
      });
    });
  }

  async renderPodium() {
    await this.renderLayout();
    this.mainContent.innerHTML = `
      <h1>Podium</h1>
    `;
    this.setupFooterNavigation();
  }

  async renderMusic() {
    await this.renderLayout();
    this.mainContent.innerHTML = `
      <h1>Musique</h1>
    `;
    this.setupFooterNavigation();
  }

  async renderMenu() {
    await this.renderLayout();
    this.mainContent.innerHTML = `
      <h1>Menu</h1>
    `;
    this.setupFooterNavigation();
  }
}
