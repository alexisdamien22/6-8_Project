class AppModel {
  constructor() {
    this.activeChild = {
      name: "Léo",
      instrument: "Piano",

      sessions: [
        { day: "Lun", status: "done" },
        { day: "Mar", status: "done" },
        { day: "Mer", status: "todo" },
        { day: "Jeu", status: "nothing" },
        { day: "Ven", status: "todo" },
        { day: "Sam", status: "nothing" },
        { day: "Dim", status: "todo" },
      ],
    };
  }
  getChildData() {
    return this.activeChild;
  }
}
