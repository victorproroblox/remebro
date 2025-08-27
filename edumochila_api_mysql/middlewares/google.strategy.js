import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  API_BASE_URL,
} = process.env;

const CALLBACK_URL = `${API_BASE_URL}/api/auth/google/callback`;

passport.use(new GoogleStrategy(
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

      // TODO: busca/crea en tu BD
      const user = { id_us: 123, tip_us: 2, nom_us, email, provider: "google" };
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// ⚠️ No exportes nada: con solo importar este archivo se registra la estrategia.
