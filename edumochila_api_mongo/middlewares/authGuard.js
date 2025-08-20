// middlewares/authGuard.js
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_ISSUER, JWT_AUDIENCE } from "../config/jwt.js";

export function authGuard(req, res, next) {
  const auth = req.headers.authorization || "";
  const [scheme, token] = auth.split(" ");

  if (!token || scheme !== "Bearer") {
    return res.status(401).json({ message: "Token requerido (Bearer)" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    req.user = payload; // { sub, email, role, ... }
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}
