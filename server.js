const express = require("express");
const path = require("path");
const { ChildAccountManager } = require("./src/managers/ChildAccountManager");
const { WeeklyPlanManager } = require("./src/managers/WeeklyPlanManager");
const { StreaksManager } = require("./src/managers/StreaksManager");
const { db } = require("./src/db/connection");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.get("/manifest.json", (req, res) => {
  res.sendFile(path.join(__dirname, "manifest.json"));
});

app.get("/sw.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.sendFile(path.join(__dirname, "sw.js"));
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/src", express.static(path.join(__dirname, "src")));

app.get("/api/status", (req, res) => {
  res.json({ status: "ok", message: "Node.js backend fonctionnel" });
});

app.post("/api/signup/child", async (req, res) => {
  try {
    const data = req.body;
    const childId = await ChildAccountManager.create(data.prenom);

    const joursMap = {
      L: "monday",
      Ma: "tuesday",
      Me: "wednesday",
      J: "thursday",
      V: "friday",
      S: "saturday",
      D: "sunday",
    };

    if (data.jours && Array.isArray(data.jours)) {
      for (let j of data.jours) {
        await WeeklyPlanManager.updateDay(childId, joursMap[j], 1, "#7b2fbe");
      }
    }

    await StreaksManager.updateStreak(childId, 0);

    res.json({ success: true, childId: childId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query("SELECT * FROM childaccount WHERE name = ?", [
      email,
    ]);
    const user = rows[0];

    if (user) {
      res.json({ success: true, user: user });
    } else {
      res.json({ success: false, message: "Utilisateur non trouvé" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
