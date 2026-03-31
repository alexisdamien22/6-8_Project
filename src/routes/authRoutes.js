import express from "express";
import jwt from "jsonwebtoken";
import { UserManager } from "../managers/UserManager.js";
import { ChildAccountManager } from "../managers/ChildAccountManager.js";
import { WeeklyPlanManager } from "../managers/WeeklyPlanManager.js";
import { StreaksManager } from "../managers/StreaksManager.js";
import { verifyToken } from "../model/authMiddleware.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key_fallback";

const DAYS_MAP = {
  L: "monday",
  Ma: "tuesday",
  Me: "wednesday",
  J: "thursday",
  V: "friday",
  S: "saturday",
  D: "sunday",
};

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email et mot de passe requis." });
    }

    const existingUser = await UserManager.findByEmail(email);
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, error: "E-mail déjà utilisé." });
    }

    console.log("Attempting to create user...");
    const adultId = await UserManager.create(email, password);
    console.log("User created with ID:", adultId);

    const token = jwt.sign({ userId: adultId }, JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(201).json({
      success: true,
      token,
      userId: adultId,
    });
  } catch (err) {
    console.error("CRASH REGISTER:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
      stack: err.stack,
    });
  }
});

router.post("/register-child", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { jours, ...childInfo } = req.body;
    console.log(
      "Tentative de création d'enfant pour l'ID parent (depuis le token) :",
      userId,
    );

    if (!userId) {
      return res.status(400).json({
        success: false,
        error:
          "ID du parent manquant dans le token. Impossible de créer l'enfant.",
      });
    }

    const childId = await ChildAccountManager.create(childInfo, userId);

    if (Array.isArray(jours)) {
      for (const j of jours) {
        if (DAYS_MAP[j]) {
          await WeeklyPlanManager.setDay(childId, DAYS_MAP[j], 1, "#7b2fbe");
        }
      }
    }

    await StreaksManager.update(childId, 0, null);

    return res.status(201).json({ success: true, childId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserManager.findByEmail(email);

    if (!user || !(await UserManager.verifyPassword(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, error: "Identifiants incorrects." });
    }

    const children = await ChildAccountManager.getChildrenOfAdult(user.id);
    const tokenData = { userId: user.id };

    if (children && children.length > 0) {
      tokenData.childId = children[0].id;
    }

    const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: "30d" });

    return res.status(200).json({
      success: true,
      token,
      hasChild: children && children.length > 0,
      childId: children && children.length > 0 ? children[0].id : null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/me", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await UserManager.getById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Utilisateur non trouvé." });
    }

    const children = await ChildAccountManager.getChildrenOfAdult(userId);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.username,
        children: children || [],
      },
    });
  } catch (error) {
    console.error("Erreur dans GET /me :", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
