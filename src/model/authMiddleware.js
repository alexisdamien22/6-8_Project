import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: "Un token est requis pour l'authentification.",
    });
  }

  try {
    const secret = process.env.JWT_SECRET || "dev_secret_key_fallback";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token invalide." });
  }
}
