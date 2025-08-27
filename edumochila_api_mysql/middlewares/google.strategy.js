// src/middlewares/google.strategy.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  API_BASE_URL,
} = process.env;

const CALLBACK_URL = `${API_BASE_URL}/api/auth/google/callback`;

// Logs de verificación en arranque
console.log("[google.strategy] init", {
  hasID: !!GOOGLE_CLIENT_ID,
  hasSecret: !!GOOGLE_CLIENT_SECRET,
  CALLBACK_URL,
});

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !API_BASE_URL) {
  console.error("[google.strategy] ❌ Faltan envs. No se registrará la estrategia.");
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
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
    )
  );

  console.log(
    "[google.strategy] ✅ Estrategia registrada: ",
    typeof passport._strategies?.google !== "undefined"
  );
}
