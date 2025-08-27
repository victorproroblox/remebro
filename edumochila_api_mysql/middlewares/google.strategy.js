// src/middlewares/google.strategy.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  API_BASE_URL,
} = process.env;

const CALLBACK_URL = `${API_BASE_URL}/api/auth/google/callback`;

console.log("[google.strategy] init ->",
  { CALLBACK_URL, hasID: !!GOOGLE_CLIENT_ID, hasSecret: !!GOOGLE_CLIENT_SECRET }
);

// ⚠️ Registra SIEMPRE la estrategia (si faltan env fallará en callbackURL, pero así
// comprobamos que al menos se está ejecutando este archivo)
passport.use("google", new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID || "missing",
    clientSecret: GOOGLE_CLIENT_SECRET || "missing",
    callbackURL: CALLBACK_URL || "http://localhost:4000/api/auth/google/callback",
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const email = profile?.emails?.[0]?.value?.toLowerCase?.() || null;
      const nom_us = profile?.displayName || "Usuario Google";
      const user = { id_us: 123, tip_us: 2, nom_us, email, provider: "google" };
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

console.log("[google.strategy] ✅ registrada? ->", !!passport._strategies?.google);
