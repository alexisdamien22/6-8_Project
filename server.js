import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { ChildAccountManager } from "./src/managers/ChildAccountManager.js";
import { WeeklyPlanManager } from "./src/managers/WeeklyPlanManager.js";
import { StreaksManager } from "./src/managers/StreaksManager.js";
import { SessionsManager } from "./src/managers/SessionsManager.js";
import { UserManager } from "./src/managers/UserManager.js";
import { db } from "./src/db/connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = "votre_cle_secrete_super_securisee";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// --- FICHIERS STATIQUES ---
app.get("/manifest.json", (req, res) => {
  res.sendFile(path.join(__dirname, "manifest.json"));
});

app.get("/sw.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.sendFile(path.join(__dirname, "sw.js"));
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/src", express.static(path.join(__dirname, "src")));

// --- ROUTES API ---

app.get("/api/status", (req, res) => {
  res.json({ status: "ok", message: "Backend Six-Huit opérationnel" });
});

// Authentification
app.post("/api/auth/register", async (req, res) => {
  try {
    const data = req.body;
    const existingUser = await UserManager.findByEmail(data.email);
    if (existingUser)
      return res
        .status(409)
        .json({ success: false, error: "E-mail déjà utilisé." });

    const adultId = await UserManager.create(data.email, data.password);
    const childId = await ChildAccountManager.create(data, adultId);

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

    const token = jwt.sign({ userId: adultId, childId: childId }, JWT_SECRET, {
      expiresIn: "30d",
    });
    res.json({ success: true, token, childId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserManager.findByEmail(email);
    if (!user || !(await UserManager.verifyPassword(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, error: "Email ou mot de passe incorrect." });
    }

    const children = await ChildAccountManager.getChildrenOfAdult(user.id);
    if (!children || children.length === 0)
      return res
        .status(404)
        .json({ success: false, error: "Aucun enfant trouvé." });

    const childId = children[0].id;
    const token = jwt.sign({ userId: user.id, childId: childId }, JWT_SECRET, {
      expiresIn: "30d",
    });
    res.json({ success: true, token, childId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Données Enfant & Streaks
app.get("/api/child/:id/streak", async (req, res) => {
  try {
    const childId = req.params.id;
    const streakData = await StreaksManager.get(childId);
    res.json({
      success: true,
      streak: streakData ? streakData.current_streak : 0,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/child/:id/full-data", async (req, res) => {
  try {
    const childId = req.params.id;
    const childData = await ChildAccountManager.getById(childId);
    if (!childData)
      return res
        .status(404)
        .json({ success: false, error: "Enfant non trouvé" });
    const planRows = await WeeklyPlanManager.getPlan(childId);
    const streak = await StreaksManager.get(childId);

    const planObject = planRows.reduce((acc, row) => {
      acc[row.day_of_week] = { practice: row.practice, color: row.color };
      return acc;
    }, {});

    res.json({
      success: true,
      data: { ...childData, plan: planObject, streak },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/child/:id/streak", async (req, res) => {
  try {
    const childId = req.params.id;
    const { streak, lastDate } = req.body;
    if (streak === undefined || lastDate === undefined) {
      return res
        .status(400)
        .json({ success: false, error: "Données manquantes pour le streak." });
    }
    await StreaksManager.update(childId, streak, lastDate);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/child/:id/sessions", async (req, res) => {
  try {
    const childId = req.params.id;
    const date = new Date().toISOString().split("T")[0];
    const newSession = await SessionsManager.create(childId, date, 5, 5, 1);
    res.json({ success: true, session: newSession });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- SPA CATCH-ALL ---
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
