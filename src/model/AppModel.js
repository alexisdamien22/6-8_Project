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
      this.activeChild.weeklyPlan = data.plan || data.jours || {};
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

    this.generateWeeklyView();
  }

  updateData(key, value) {
    this.tempData[key] = value;
  }

  isLoggedIn() {
    return !!localStorage.getItem("jwt_token");
  }

  login() {
    localStorage.setItem("user_connected", "true");
  }

  getChildData() {
    return this.activeChild;
  }
  generateWeeklyView() {
    if (!this.activeChild) {
      return;
    }

    let plan = this.activeChild.weeklyPlan || {};

    if (typeof plan === "string") {
      try {
        plan = JSON.parse(plan);
      } catch (e) {
        plan = plan.split(",").map((s) => s.trim().replace(/['"\[\]]/g, ""));
      }
    }

    let planLength = 0;
    if (Array.isArray(plan)) {
      planLength = plan.length;
    } else if (typeof plan === "object" && plan !== null) {
      planLength = Object.keys(plan).length;
    }

    if (planLength === 0) {
      plan = { monday: { practice: 1, color: "#7b2fbe" } };
    }

    this.activeChild.weeklyPlan = plan;

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

    const enToAbbr = {
      monday: "L",
      tuesday: "Ma",
      wednesday: "Me",
      thursday: "J",
      friday: "V",
      saturday: "S",
      sunday: "D",
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

    const weeklySessions = [];
    const currentDayOfWeek = today.getDay();
    const distanceToMonday = (currentDayOfWeek + 6) % 7;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - distanceToMonday);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dayOfWeek = dayNameArray[date.getDay()];

      let isPracticeDay = false;
      if (Array.isArray(plan)) {
        isPracticeDay =
          plan.includes(dayOfWeek) || plan.includes(enToAbbr[dayOfWeek]);
      } else if (typeof plan === "object" && plan !== null) {
        isPracticeDay = !!plan[dayOfWeek] || !!plan[enToAbbr[dayOfWeek]];
      }

      let status = "nothing";
      if (isPracticeDay) {
        const isPastOrPracticedToday =
          date.getTime() < today.getTime() ||
          (date.getTime() === today.getTime() && hasPracticedToday);

        if (isPastOrPracticedToday) {
          status = "done";
        } else {
          status = "todo";
        }
      }

      weeklySessions.push({
        date: date.toISOString().split("T")[0],
        day: dayNameMapFr[dayOfWeek],
        status: status,
        isPracticeDay: isPracticeDay,
        isToday: date.getTime() === today.getTime(),
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
      return; // Déjà pratiqué aujourd'hui
    }

    // La source de vérité est l'état du modèle
    const currentStreak = this.activeChild.streakData?.current_streak || 0;
    const newStreak = currentStreak + 1;
    const todayStr = new Date().toISOString().split("T")[0];

    // Mettre à jour l'état du modèle
    if (this.activeChild.streakData) {
      this.activeChild.streakData.current_streak = newStreak;
      this.activeChild.streakData.last_practice_date = todayStr;
    } else {
      this.activeChild.streakData = {
        current_streak: newStreak,
        last_practice_date: todayStr,
      };
    }

    // Mettre à jour également l'item localStorage que la vue utilise pour le header
    localStorage.setItem("strik", newStreak.toString());

    const activeChildId = localStorage.getItem("activeChildId");
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
