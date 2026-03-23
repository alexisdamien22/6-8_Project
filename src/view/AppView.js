class AppView {
  constructor() {
    this.app = document.getElementById("app");
    this.initEventListeners();
  }

  initEventListeners() {
    this.app.addEventListener("click", (e) => {
      if (e.target.classList.contains("path-dot")) {
        const container = e.target.closest(".path-button-container");
        const popup = container.querySelector(".duo-popup");

        document.querySelectorAll(".duo-popup").forEach((p) => {
          if (p !== popup) p.classList.remove("show");
        });

        popup.classList.toggle("show");
      } else if (!e.target.closest(".duo-popup")) {
        document.querySelectorAll(".duo-popup.show").forEach((p) => {
          p.classList.remove("show");
        });
      }

      if (e.target.classList.contains("start-btn")) {
        console.log("Démarrage de la leçon !");
      }
    });
  }

  renderHome(childData) {
    let pathHTML = "";
    const joursFr = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    let dayActuel = joursFr[new Date().getDay()];

    for (let i = 0; i < childData.sessions.length; i++) {
      let session = childData.sessions[i];
      let offset = 0;
      if (i % 4 === 1) offset = 40;
      if (i % 4 === 2) offset = 0;
      if (i % 4 === 3) offset = -40;

      let mascotteHTML = "";
      let haloHTML = "";

      if (session.day === dayActuel) {
        mascotteHTML = `<img src="/assets/img/mascottes/camelion.png" class="mascotte-path">`;
        haloHTML = `<div class="today-halo"></div>`;
      }

      pathHTML += `
                <div class="path-step ${session.status}" style="transform: translateX(${offset}px)">
                    <div class="path-button-container">
                        ${haloHTML}
                        ${mascotteHTML}
                        <div class="path-dot-shadow"></div> 
                        <div class="path-dot"></div>
                        <div class="duo-popup">
                          <div class="popup-content">
                              <h3>Leçon ${i + 1}</h3>
                              <p>Prêt pour un défi ?</p>
                              <button class="start-btn">COMMENCER</button>
                          </div>
                          <div class="popup-arrow"></div> 
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
}
