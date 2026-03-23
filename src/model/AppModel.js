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
        { day: "Ven", status: "todo" },
        { day: "Sam", status: "waiting" },
        { day: "Dim", status: "todo" },
      ],
    };
  }
  getChildData() {
    return this.activeChild;
  }
}
