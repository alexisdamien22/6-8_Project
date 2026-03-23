class AppController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.init();
  }

  init() {
    const data = this.model.getChildData();

    if (data) {
      this.view.renderHome(data);
    } else {
      console.error("Le modèle n'a renvoyé aucune donnée.");
    }
  }
}
