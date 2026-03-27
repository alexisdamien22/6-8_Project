import express from "express";
import { ChildAccountManager } from "../managers/ChildAccountManager.js";
import { WeeklyPlanManager } from "../managers/WeeklyPlanManager.js";
import { StreaksManager } from "../managers/StreaksManager.js";
import { SessionsManager } from "../managers/SessionsManager.js";

const router = express.Router();

router.get("/:id/streak", async (req, res) => {
  try {
    const streakData = await StreaksManager.get(req.params.id);
    res.json({
      success: true,
      streak: streakData ? streakData.current_streak : 0,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/:id/streak", async (req, res) => {
  try {
    const { streak, lastDate } = req.body;
    await StreaksManager.update(req.params.id, streak, lastDate);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/:id/full-data", async (req, res) => {
  try {
    const childId = req.params.id;
    const childData = await ChildAccountManager.getById(childId);
    if (!childData)
      return res
        .status(404)
        .json({ success: false, error: "Enfant non trouvé" });
    const planRows = await WeeklyPlanManager.getPlan(childId);
    const streak = await StreaksManager.get(childId);
    res.json({ success: true, data: { ...childData, plan: planRows, streak } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/:id/sessions", async (req, res) => {
  try {
    const childId = req.params.id;
    const date = new Date().toISOString().split("T")[0];
    const newSession = await SessionsManager.create(childId, date, 5, 5, 1);
    res.json({ success: true, session: newSession });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
