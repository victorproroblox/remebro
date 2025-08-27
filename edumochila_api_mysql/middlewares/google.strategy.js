import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const rawBase = (process.env.API_BASE_URL || "").trim();
// quita cualquier slash final
const API_BASE = rawBase.replace(/\/+$/, "");
const CALLBACK_URL = `${API_BASE}/api/auth/google/callback`;

console.log("[google.strategy] init ->", {
  CALLBACK_URL,
  hasID: !!process.env.GOOGLE_CLIENT_ID,
  hasSecret: !!process.env.GOOGLE_CLIENT_SECRET
});

passport.use("google", new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || "missing",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "missing",
    callbackURL: CALLBACK_URL,
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
