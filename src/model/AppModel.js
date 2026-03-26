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
      name: "",
      age: "",
      instrument: "",
      experience: "",
      school: "",
      mascot: "",
      practiceDays: [],
    };
  }

  updateData(key, value) {
    this.tempData[key] = value;
  }

  isLoggedIn() {
    return localStorage.getItem("user_connected") === "true";
  }

  login() {
    localStorage.setItem("user_connected", "true");
  }

  getChildData() {
    return this.activeChild;
  }
  adjustSessionsToToday() {
    const joursFr = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const todayDate = new Date().toDateString();
    const todayIndex = new Date().getDay();

    let firstTodoIndex = this.activeChild.sessions.findIndex(
      (s) => s.status !== "done",
    );

    if (firstTodoIndex !== -1) {
      let isPlayedToday = this.activeChild.lastPlayedDate === todayDate;
      let startOffset = isPlayedToday ? 1 : 0;

      this.activeChild.sessions[firstTodoIndex].status = "todo";

      for (let i = firstTodoIndex; i < this.activeChild.sessions.length; i++) {
        let nextDayIndex =
          (todayIndex + startOffset + (i - firstTodoIndex)) % 7;
        this.activeChild.sessions[i].day = joursFr[nextDayIndex];

        if (i > firstTodoIndex) {
          this.activeChild.sessions[i].status = "nothing";
        }
      }
    }
    this.saveData();
  }

  completeCurrentSession() {
    const todoIndex = this.activeChild.sessions.findIndex(
      (s) => s.status === "todo",
    );
    if (todoIndex !== -1) {
      this.activeChild.sessions[todoIndex].status = "done";
      this.activeChild.lastPlayedDate = new Date().toDateString();
      this.saveData();
      this.adjustSessionsToToday();
    }
  }

  async saveFullProfile() {
    console.log("Envoi des données :", this.tempData);
  }
}
