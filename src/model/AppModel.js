export class AppModel {
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
    this.onboardingStep = 0;
    this.tempData = {
      name: "", age: "", instrument: "",
      experience: "", school: "", mascot: "", practiceDays: []
    };
  }

  updateData(key, value) {
    this.tempData[key] = value;
  }

  getChildData() {
    return this.activeChild;
  }

  async saveFullProfile() {
    console.log("Envoi des données :", this.tempData);
  }
}
