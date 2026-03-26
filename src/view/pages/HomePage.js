export const HomePage = {
  getHTML: function (childData) {
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

    return `
            <div class="home-screen">
                <div class="path-container">
                    ${pathHTML}
                </div>
            </div>
        `;
  },

  afterRender: function () {
    const currentElement = document.querySelector(".mascotte-path");
    if (currentElement) {
      currentElement.scrollIntoView({
        behavior: "auto",
        block: "center",
      });
    }
  },
};
