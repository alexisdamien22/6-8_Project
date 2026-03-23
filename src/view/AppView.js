export default class AppView {
  constructor() {
    this.app = document.getElementById("app");
  }

  renderHome(childName) {
    this.app.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h1>Six-Huit Music</h1>
                <p>Bienvenue, <strong>${childName || "nouvel élève"}</strong> !</p>
                <div id="main-content">Chargement du chemin musical...</div>
            </div>
        `;
  }
}
