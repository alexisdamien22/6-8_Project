class AppView {
  constructor() {
    this.app = document.getElementById("app");
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
        mascotteHTML = `<img src="public/assets/img/mascottes/camelion.png" class="mascotte-path">`;
        haloHTML = `<div class="today-halo"></div>`;
      }

      pathHTML += `
                <div class="path-step ${session.status}" style="transform: translateX(${offset}px)">
                    <div class="path-button-container">
                        ${haloHTML}
                        ${mascotteHTML}
                        <div class="path-dot-shadow"></div> 
                        <div class="path-dot"></div>    
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
