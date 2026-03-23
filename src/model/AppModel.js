class AppModel {
  constructor() {
    this.activeChild = {
      name: "Léo",
      instrument: "Piano",
      sessions: [
        { day: "Lun", status: "done" },
        { day: "Mar", status: "done" },
        { day: "Mer", status: "todo" },
        { day: "Jeu", status: "waiting" },
        { day: "Ven", status: "waiting" },
        { day: "Sam", status: "waiting" },
        { day: "Dim", status: "waiting" },
      ],
    };
  }
  getChildData() {
    return this.activeChild;
  }
}
