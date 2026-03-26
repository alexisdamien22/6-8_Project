import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { ChildAccountManager } from "./src/managers/ChildAccountManager.js";
import { WeeklyPlanManager } from "./src/managers/WeeklyPlanManager.js";
import { StreaksManager } from "./src/managers/StreaksManager.js";
import { db } from "./src/db/connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.post("/api/test", (req, res) => {
  res.json({ message: "La route API fonctionne !" });
});
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
    const childId = await ChildAccountManager.create(data.name, null);

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
        await WeeklyPlanManager.setDay(childId, joursMap[j], 1, "#7b2fbe");
      }
    }

    await StreaksManager.update(childId, 0, null);

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
