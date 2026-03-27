export class AppModel {
  constructor() {
    this.activeChild = {
      name: "...",
      instrument: "...",
      sessions: [],
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

  async init() {
    const childId = localStorage.getItem("activeChildId");
    if (!this.isLoggedIn() || !childId) {
      this.loadLocalData();
      return;
    }

    try {
      const response = await fetch(`/api/child/${childId}/full-data`);
      const result = await response.json();
      if (!result.success) throw new Error(result.error || "API Error");

      const { data } = result;
      this.activeChild = { ...this.activeChild, ...data };
      this.activeChild.weeklyPlan = data.plan || {};
      this.activeChild.streakData = data.streak || {
        current_streak: 0,
        last_practice_date: null,
      };

      this.generateWeeklyView();
      this.saveData();
    } catch (e) {
      console.error("Could not init model from server, using local data:", e);
      this.loadLocalData();
    }
  }

  loadLocalData() {
    const savedData = localStorage.getItem("activeChildData");
    this.activeChild = savedData ? JSON.parse(savedData) : this.activeChild;
    if (!this.activeChild.sessions) this.activeChild.sessions = [];
    if (!this.activeChild.weeklyPlan) this.activeChild.weeklyPlan = {};
    if (!this.activeChild.streakData)
      this.activeChild.streakData = {
        current_streak: 0,
        last_practice_date: null,
      };

    if (Object.keys(this.activeChild.weeklyPlan).length === 0)
      this.activeChild.weeklyPlan.monday = { practice: 1, color: "#7b2fbe" };
    this.generateWeeklyView();
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

  generateWeeklyView() {
    if (!this.activeChild || !this.activeChild.weeklyPlan) {
      this.activeChild.sessions = [];
      return;
    }

    const dayNameArray = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayNameMapFr = {
      monday: "Lun",
      tuesday: "Mar",
      wednesday: "Mer",
      thursday: "Jeu",
      friday: "Ven",
      saturday: "Sam",
      sunday: "Dim",
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastPracticeDateStr = this.activeChild.streakData?.last_practice_date;
    const lastPracticeDate = lastPracticeDateStr
      ? new Date(lastPracticeDateStr)
      : null;
    if (lastPracticeDate) lastPracticeDate.setHours(0, 0, 0, 0);

    const hasPracticedToday =
      lastPracticeDate && lastPracticeDate.getTime() === today.getTime();

    let todoDateFound = false;
    const weeklySessions = [];

    const currentDayOfWeek = today.getDay();
    const distanceToMonday = (currentDayOfWeek + 6) % 7;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - distanceToMonday);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dayOfWeek = dayNameArray[date.getDay()];
      const isPracticeDay = !!this.activeChild.weeklyPlan[dayOfWeek];

      let status = "nothing";
      if (isPracticeDay) {
        const isPastOrPracticedToday =
          date.getTime() < today.getTime() ||
          (date.getTime() === today.getTime() && hasPracticedToday);

        if (isPastOrPracticedToday) {
          status = "done";
        } else if (!todoDateFound) {
          status = "todo";
          todoDateFound = true;
        }
      }

      weeklySessions.push({
        date: date.toISOString().split("T")[0],
        day: dayNameMapFr[dayOfWeek],
        status: status,
        isPracticeDay: isPracticeDay,
      });
    }

    this.activeChild.sessions = weeklySessions;
  }

  completeCurrentSession() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastPracticeDateStr = this.activeChild.streakData?.last_practice_date;
    const lastPracticeDate = lastPracticeDateStr
      ? new Date(lastPracticeDateStr)
      : null;
    if (lastPracticeDate) lastPracticeDate.setHours(0, 0, 0, 0);

    if (lastPracticeDate && lastPracticeDate.getTime() === today.getTime()) {
      return;
    }

    let currentStreak = parseInt(localStorage.getItem("strik"), 10);
    if (isNaN(currentStreak)) {
      currentStreak = 0;
    }
    const newStreak = currentStreak + 1;
    localStorage.setItem("strik", newStreak);

    const activeChildId = localStorage.getItem("activeChildId");
    const todayStr = new Date().toISOString().split("T")[0];

    if (this.activeChild.streakData) {
      this.activeChild.streakData.current_streak = newStreak;
      this.activeChild.streakData.last_practice_date = todayStr;
    }

    if (activeChildId) {
      fetch(`/api/child/${activeChildId}/streak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ streak: newStreak, lastDate: todayStr }),
      }).catch((err) => console.error("Erreur de sauvegarde du streak:", err));

      fetch(`/api/child/${activeChildId}/sessions`, { method: "POST" }).catch(
        (err) => console.error("Erreur de sauvegarde de la session:", err),
      );
    }

    this.generateWeeklyView();
    this.saveData();
  }

  saveData() {
    localStorage.setItem("activeChildData", JSON.stringify(this.activeChild));
  }

  async saveFullProfile() {
    console.log("Envoi des données :", this.tempData);
  }
}
