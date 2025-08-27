// src/middlewares/google.strategy.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario.js";

const API_BASE = (process.env.API_BASE_URL || "").trim().replace(/\/+$/, "");
const CALLBACK_URL = `${API_BASE}/api/auth/google/callback`;

const toLower = (s) => (s || "").toString().trim().toLowerCase();
const fullName = (p) => {
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
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const googleId  = profile?.id;
      const email     = toLower(profile?.emails?.[0]?.value);
      const nombre    = fullName(profile);
      const avatarUrl = profile?.photos?.[0]?.value || null;

      if (!googleId) throw new Error("No viene google_id");
      if (!email)    throw new Error("Google no regresó email (falta scope 'email')");

      let user = await Usuario.findOne({ where: { google_id: googleId } });

      // Enlaza por email si ya existe
      if (!user) {
        user = await Usuario.findOne({ where: { email_us: email } });
        if (user) {
          const patch = {
            google_id:  googleId,
            nom_us:     user.nom_us || nombre,
            avatar_url: user.avatar_url || avatarUrl,
          };

          // Si la cuenta existente no tiene pass_us, genera uno aleatorio
          if (!user.pass_us) {
            const randomSecret = crypto.randomUUID();          // o crypto.randomBytes(16).toString("hex")
            patch.pass_us = await bcrypt.hash(randomSecret, 10);
          }

          await user.update(patch);
        }
      }

      // Si no existe, CREAR con pass_us aleatorio
      if (!user) {
        const randomSecret = crypto.randomUUID();
        const hash = await bcrypt.hash(randomSecret, 10);

        user = await Usuario.create({
          google_id:  googleId,
          email_us:   email,
          nom_us:     nombre,
          avatar_url: avatarUrl,
          tip_us:     2,
          pass_us:    hash,               // 👈 contraseña aleatoria hasheada
        });
      }

      // Rellenos suaves
      const patch = {};
      if (!user.avatar_url && avatarUrl) patch.avatar_url = avatarUrl;
      if (!user.nom_us && nombre)       patch.nom_us = nombre;
      if (!user.email_us && email)      patch.email_us = email;
      if (Object.keys(patch).length) await user.update(patch);

      const plain = user.get({ plain: true });
      return done(null, {
        id_us:  plain.id_us,
        tip_us: plain.tip_us,
        nom_us: plain.nom_us,
        email:  plain.email_us,
        avatar: plain.avatar_url,
        provider: "google",
      });
    } catch (err) {
      return done(err);
    }
  }
));
