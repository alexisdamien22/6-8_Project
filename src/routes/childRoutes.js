import express from "express";
import { ChildAccountManager } from "../managers/ChildAccountManager.js";
import { WeeklyPlanManager } from "../managers/WeeklyPlanManager.js";
import { StreaksManager } from "../managers/StreaksManager.js";
import { SessionsManager } from "../managers/SessionsManager.js";

const router = express.Router();

router.get("/:id/streak", async (req, res) => {
  try {
    const childId = req.params.id;
    if (!childId || childId === "null" || childId === "undefined") {
      return res.status(200).json({ success: true, streak: 0 });
    }

    const streakData = await StreaksManager.get(childId);
    return res.status(200).json({
      success: true,
      streak: streakData ? streakData.current_streak : 0,
    });
  } catch (err) {
    console.error("STREAK GET ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/:id/streak", async (req, res) => {
  try {
    const childId = req.params.id;
    if (!childId || childId === "null") throw new Error("Child ID is required");

    const { streak, lastDate } = req.body;
    await StreaksManager.update(childId, streak, lastDate);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("STREAK UPDATE ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/:id/full-data", async (req, res) => {
  try {
    const childId = req.params.id;

    if (!childId || childId === "null" || childId === "undefined") {
      return res
        .status(400)
        .json({ success: false, error: "ID enfant invalide ou manquant." });
    }

    const childData = await ChildAccountManager.getById(childId);

    if (!childData) {
      return res
        .status(404)
        .json({ success: false, error: "Enfant non trouvé." });
    }

    const planRows = (await WeeklyPlanManager.getPlan(childId)) || [];
    const streak = (await StreaksManager.get(childId)) || { current_streak: 0 };

    return res.status(200).json({
      success: true,
      data: { ...childData, plan: planRows, streak },
    });
  } catch (err) {
    console.error("FULL DATA ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/:id/sessions", async (req, res) => {
  try {
    const childId = req.params.id;
    if (!childId || childId === "null")
      return res
        .status(400)
        .json({ success: false, error: "Child ID missing" });

    const date = new Date().toISOString().split("T")[0];
    const newSession = await SessionsManager.create(childId, date, 5, 5, 1);

    return res.status(201).json({ success: true, session: newSession });
  } catch (err) {
    console.error("SESSION CREATE ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
