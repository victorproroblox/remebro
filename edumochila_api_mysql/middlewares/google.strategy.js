// src/middlewares/google.strategy.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Usuario } from "../models/Usuario.js"; // ajusta si el nombre difiere

const API_BASE = (process.env.API_BASE_URL || "").trim().replace(/\/+$/, "");
const CALLBACK_URL = `${API_BASE}/api/auth/google/callback`;

const getLower = (s) => (s || "").toString().trim().toLowerCase();
const getName = (p) => {
  const g = p?.name?.givenName || "";
  const f = p?.name?.familyName || "";
  const full = [g, f].filter(Boolean).join(" ").trim();
  return full || p?.displayName || "Usuario Google";
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
      const googleId   = profile?.id;
      const email      = getLower(profile?.emails?.[0]?.value);
      const nombre     = getName(profile);
      const avatarUrl  = profile?.photos?.[0]?.value || null; // <- avatar_url

      if (!googleId) throw new Error("No viene google_id");
      if (!email)    throw new Error("Google no regresó email (agrega scope 'email')");

      // 1) ¿Existe por google_id?
      let user = await Usuario.findOne({ where: { google_id: googleId }, transaction: t });

      // 2) Si no, ¿existe por correo? (enlazar cuenta ya registrada)
      if (!user) {
        user = await Usuario.findOne({ where: { correo: email }, transaction: t });
        if (user) {
          await user.update(
            {
              google_id: googleId,
              avatar_url: user.avatar_url || avatarUrl,
              nom_us: user.nom_us || nombre,
            },
            { transaction: t }
          );
        }
      }

      // 3) Si aún no existe, créalo
      if (!user) {
        user = await Usuario.create(
          {
            google_id: googleId,
            correo: email,
            nom_us: nombre,
            avatar_url: avatarUrl,
            tip_us: 2, // rol default; ajusta a tu lógica
          },
          { transaction: t }
        );
      }

      await t.commit();

      const plain = user.get({ plain: true });
      return done(null, {
        id_us:   plain.id_us || plain.id || plain.id_usuario, // ajusta al nombre real de tu PK
        tip_us:  plain.tip_us,
        nom_us:  plain.nom_us,
        email:   plain.correo,
        avatar:  plain.avatar_url,
        provider: "google",
      });
    } catch (err) {
      await t.rollback().catch(() => {});
      return done(err);
    }
  }
));
