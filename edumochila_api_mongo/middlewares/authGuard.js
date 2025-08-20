// middlewares/authGuard.js
import jwt from "jsonwebtoken";

const JWT_SECRET   = process.env.JWT_SECRET   || "dev_secret";
const JWT_ISSUER   = process.env.JWT_ISSUER   || ""; // opcional
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || ""; // opcional

export function authGuard(req, res, next) {
  const auth = req.headers.authorization || "";
  const [scheme, token] = auth.split(" ");

  if (!token || scheme !== "Bearer") {
    return res.status(401).json({ message: "Token requerido (Bearer)" });
  }

  try {
    // Debug para confirmar que sí cargó el secret desde env
    console.log("JWT debug → secretLen:", (JWT_SECRET || "").length, {
      iss: JWT_ISSUER || "(none)",
      aud: JWT_AUDIENCE || "(none)",
    });

    const verifyOpts = {};
    if (JWT_ISSUER)   verifyOpts.issuer = JWT_ISSUER;
    if (JWT_AUDIENCE) verifyOpts.audience = JWT_AUDIENCE;

    const payload = jwt.verify(token, JWT_SECRET, verifyOpts);
    req.user = payload;
    return next();
  } catch (err) {
    console.error("JWT error:", err.name, err.message);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}
