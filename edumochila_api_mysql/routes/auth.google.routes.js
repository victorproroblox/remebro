import { Router } from "express";
import passport from "passport"; // 👈 NO importes desde tu strategy
import { googleRedirect, googleCallback } from "../controllers/authGoogle.controller.js";

const router = Router();

router.get(
  "/google/redirect",
  googleRedirect,
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google`,
  }),
  googleCallback
);

export default router;
