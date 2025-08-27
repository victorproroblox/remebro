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
    try {
      const googleId  = profile?.id;
      const email     = toLower(profile?.emails?.[0]?.value);
      const nombre    = fullName(profile);
      const avatarUrl = profile?.photos?.[0]?.value || null;

      console.log("[G] profile", {
        googleId,
        emails: profile?.emails?.map(e => e?.value),
        avatarUrl
      });

      if (!googleId) throw new Error("No viene google_id");
      if (!email)    throw new Error("Google no regresó email (agrega scope 'email')");

      let user = null;
      let created = false;

      // 1) Busca por google_id
      user = await Usuario.findOne({ where: { google_id: googleId } });
      if (user) {
        console.log("[G] encontrado por google_id:", user.id_us);
      }

      // 2) Si no, intenta por email_us (para enlazar cuenta existente)
      if (!user) {
        user = await Usuario.findOne({ where: { email_us: email } });
        if (user) {
          console.log("[G] enlazando cuenta existente por email_us:", user.id_us);
          await user.update({
            google_id:  googleId,
            avatar_url: user.avatar_url || avatarUrl,
            nom_us:     user.nom_us || nombre
          });
        }
      }

      // 3) Si no existe, crea
      if (!user) {
        user = await Usuario.create({
          google_id:  googleId,
          email_us:   email,
          nom_us:     nombre,
          avatar_url: avatarUrl,
          tip_us:     2
        });
        created = true;
        console.log("[G] creado usuario:", user.id_us);
      }

      // 4) Asegura actualizar avatar/nombre si venían vacíos
      const patch = {};
      if (!user.avatar_url && avatarUrl) patch.avatar_url = avatarUrl;
      if (!user.nom_us && nombre)       patch.nom_us = nombre;
      if (Object.keys(patch).length) {
        await user.update(patch);
        console.log("[G] actualizado perfil (avatar/nombre) para:", user.id_us);
      }

      const plain = user.get({ plain: true });
      console.log("[G] listo:", { id: plain.id_us, created });

      return done(null, {
        id_us:  plain.id_us,
        tip_us: plain.tip_us,
        nom_us: plain.nom_us,
        email:  plain.email_us,
        avatar: plain.avatar_url,
        provider: "google",
      });
    } catch (err) {
      console.error("[G] ERROR verify:", err?.message || err);
      return done(err);
    }
  }
));
