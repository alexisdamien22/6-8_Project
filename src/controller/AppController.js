export class AppController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async init() {
    await this.model.init();
    const currentPage = this.getCurrentPageFromHash();
    this.navigateToPage(currentPage);
  }

  getCurrentPageFromHash() {
    const hash = window.location.hash.substring(1);
    const validPages = [
      "home",
      "podium",
      "music",
      "menu",
      "settings",
      "profil",
      "createAccount",
    ];
    return validPages.includes(hash) ? hash : "home";
  }

  navigateToPage(pageName) {
    if (!this.model.isLoggedIn() && pageName !== "createAccount") {
      this.navigateToPage("createAccount");
      return;
    }

    this.updateHash(pageName);

    switch (pageName) {
      case "home":
        const homeData = this.model.getChildData();
        if (homeData) {
          this.view.renderHome(homeData);
        }
        break;
      case "podium":
        this.view.renderPodium();
        break;
      case "music":
        this.view.renderMusic();
        break;
      case "settings":
        this.view.renderSettings();
        break;
      case "profil":
        const profilData = this.model.getChildData();
        this.view.renderProfil(profilData);
        break;
      case "createAccount":
        this.view.renderCreateAccount();
        break;
    }
  }

  updateHash(pageName) {
    window.location.hash = pageName;
  }
  async handleSessionValidation() {
    const childData = this.model.getChildData();
    if (!childData) return;

    const currentStreak = parseInt(localStorage.getItem("strik") || "0");
    const newStreak = currentStreak + 1;
    const today = new Date().toISOString().split("T")[0];

    try {
      await this.view.saveStreakToServer(newStreak);

      localStorage.setItem("strik", newStreak);

      if (childData.streakData) {
        childData.streakData.current_streak = newStreak;
        childData.streakData.last_practice_date = today;
      }

      this.view.updateHeaderStreak();

      this.navigateToPage("home");
    } catch (error) {
      console.error("Erreur lors de la validation :", error);
      alert("Impossible de sauvegarder ta séance.");
    }
  }
}
