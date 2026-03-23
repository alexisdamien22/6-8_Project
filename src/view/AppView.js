class AppView {
  constructor() {
    this.app = document.getElementById("app");
  }

  renderHome(childData) {
    let pathHTML = "";

    for (let i = 0; i < childData.sessions.length; i++) {
      let session = childData.sessions[i];

      let offset = 0;
      if (i % 4 === 1) offset = 40;
      if (i % 4 === 2) offset = 0;
      if (i % 4 === 3) offset = -40;

      pathHTML += `
                    <div class="path-step ${session.status}" style="transform: translateX(${offset}px)">
                        <div class="path-button-container">
                            <div class="path-dot-shadow"></div> <div class="path-dot"></div>       
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
  }
}
