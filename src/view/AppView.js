class AppView {
  constructor() {
    this.app = document.getElementById("app");
  }

  renderHome(childData) {
    let pathHTML = "";

    for (let i = 0; i < childData.sessions.length; i++) {
      let session = childData.sessions[i];

      pathHTML += `
                <div class="path-step ${session.status}">
                    <div class="path-dot"></div>
                    <span class="path-label">${session.day}</span>
                </div>`;
    }

    this.app.innerHTML = `
            <div class="home-screen">
                <div style="text-align:center; padding:20px;">
                    <h1>Six-Huit Music</h1>
                    <p>Salut <strong>${childData.name}</strong> !</p>
                    <p>Instrument : ${childData.instrument}</p>
                </div>

                <div class="path-container">
                    ${pathHTML}
                </div>
            </div>
        `;
  }
}
