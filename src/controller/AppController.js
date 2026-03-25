class AppController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.init();
  }

  init() {
    const currentPage = this.getCurrentPageFromHash();
    this.navigateToPage(currentPage);
  }

  getCurrentPageFromHash() {
    const hash = window.location.hash.substring(1);
    const validPages = ["home", "podium", "music", "menu", "settings"];
    return validPages.includes(hash) ? hash : "home";
  }

  navigateToPage(pageName) {
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
      case "menu":
        this.view.renderMenu();
        break;
      case "settings":
        this.view.renderSettings();
        break;
    }
  }

  updateHash(pageName) {
    window.location.hash = pageName;
  }
}
