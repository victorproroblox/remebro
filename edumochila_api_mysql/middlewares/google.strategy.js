// src/middlewares/google.strategy.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Usuario from "../models/Usuario.js";

const API_BASE = (process.env.API_BASE_URL || "").trim().replace(/\/+$/, "");
const CALLBACK_URL = `${API_BASE}/api/auth/google/callback`;

const toLower = s => (s || "").toString().trim().toLowerCase();
const fullName = p => {
  const g = p?.name?.givenName || "";
  const f = p?.name?.familyName || "";
  return [g, f].filter(Boolean).join(" ").trim() || p?.displayName || "Usuario Google";
};

passport.use("google", new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || "missing",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "missing",
    callbackURL: CALLBACK_URL,
    passReqToCallback: true,
  },
  /** verify */
  async (req, accessToken, refreshToken, profile, done) => {
    const t = await Usuario.sequelize.transaction();
    try {
      const googleId  = profile?.id;
      const email     = toLower(profile?.emails?.[0]?.value);
      const nombre    = fullName(profile);              // lo guardaremos en nom_us
      const avatarUrl = profile?.photos?.[0]?.value || null;

      if (!googleId) throw new Error("No viene google_id");
      if (!email)    throw new Error("Google no regresó email (falta scope 'email')");

      // 1) ¿Existe por google_id?
      let user = await Usuario.findOne({ where: { google_id: googleId }, transaction: t });

      // 2) Si no, enlaza por email_us si ya existía
      if (!user) {
        user = await Usuario.findOne({ where: { email_us: email }, transaction: t });
        if (user) {
          await user.update(
            {
              google_id:  googleId,
              avatar_url: user.avatar_url || avatarUrl,
              nom_us:     user.nom_us || nombre,
            },
            { transaction: t }
          );
        }
      }

      // 3) Si aún no existe, créalo
      if (!user) {
        user = await Usuario.create(
          {
            google_id:  googleId,
            email_us:   email,
            nom_us:     nombre,
            avatar_url: avatarUrl,
            tip_us:     2,     // default (ajusta si quieres otro)
          },
          { transaction: t }
        );
      }

      await t.commit();

      const plain = user.get({ plain: true });
      return done(null, {
        id_us:  plain.id_us,         // PK de tu modelo
        tip_us: plain.tip_us,
        nom_us: plain.nom_us,
        email:  plain.email_us,
        avatar: plain.avatar_url,
        provider: "google",
      });
    } catch (err) {
      await t.rollback().catch(() => {});
      return done(err);
    }
  }
));
