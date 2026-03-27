import express from "express";
import jwt from "jsonwebtoken";
import { UserManager } from "../managers/UserManager.js";
import { ChildAccountManager } from "../managers/ChildAccountManager.js";
import { WeeklyPlanManager } from "../managers/WeeklyPlanManager.js";
import { StreaksManager } from "../managers/StreaksManager.js";

const router = express.Router();
const JWT_SECRET = "votre_cle_secrete_super_securisee";

router.post("/register", async (req, res) => {
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

router.post("/login", async (req, res) => {
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

export default router;
