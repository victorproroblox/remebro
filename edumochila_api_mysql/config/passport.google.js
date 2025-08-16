// config/passport.google.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Usuario from '../models/Usuario.js';

function norm(s) {
  return s ? s.toString().trim().replace(/\s+/g, ' ')
    .toLowerCase().replace(/^[a-zñáéíóúü]/, c => c.toUpperCase())
    : null;
}

function splitWords(s) {
  if (!s) return [];
  return s.toString().trim().split(/\s+/);
}

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: false
  },
  // verify
  async (accessToken, refreshToken, profile, done) => {
    try {
      const googleId   = profile.id;
      const email      = profile.emails?.[0]?.value || null;
      const avatar     = profile.photos?.[0]?.value || null;
      const fullName   = profile.displayName || null;
      const givenName  = profile.name?.givenName || null;
      const familyName = profile.name?.familyName || null;

      const gnParts = splitWords(givenName);
      const fnParts = splitWords(familyName);

      let nom1_us = norm(gnParts[0]);
      let nom2_us = norm(gnParts[1]);
      let ap_us   = norm(fnParts[0]);
      let am_us   = norm(fnParts[1]);
      let nom_us  = norm(fullName);

      // Si no hay apellidos, heurística simple desde nombre completo
      if (!ap_us && !am_us && fullName) {
        const parts = splitWords(fullName);
        if (parts.length >= 3) {
          am_us  = norm(parts.pop());
          ap_us  = norm(parts.pop());
          nom1_us = nom1_us ?? norm(parts[0]);
          nom2_us = nom2_us ?? norm(parts[1]);
        }
      }

      // Buscar por google_id o por email (como en tu Laravel)
      let user = await Usuario.findOne({
        where: email
          ? { email_us: email }
          : { google_id: googleId }
      });

      if (!user) {
        // Si no encontró por email, intenta por google_id
        if (!email) {
          user = await Usuario.findOne({ where: { google_id: googleId } });
        }
      }

      if (!user) {
        user = await Usuario.create({
          google_id: googleId,
          email_us : email,
          avatar_url: avatar,
          nom1_us, nom2_us, ap_us, am_us,
          nom_us,                // displayName
          pass_us: null,         // placeholder, no lo necesitas con Google
          tip_us: 2
        });
      } else {
        // Link/actualiza sin sobreescribir valores existentes
        let changed = false;
        if (!user.google_id) { user.google_id = googleId; changed = true; }
        if (avatar && user.avatar_url !== avatar) { user.avatar_url = avatar; changed = true; }
        if (!user.nom1_us && nom1_us) { user.nom1_us = nom1_us; changed = true; }
        if (!user.nom2_us && nom2_us) { user.nom2_us = nom2_us; changed = true; }
        if (!user.ap_us && ap_us) { user.ap_us = ap_us; changed = true; }
        if (!user.am_us && am_us) { user.am_us = am_us; changed = true; }
        if (!user.nom_us && nom_us) { user.nom_us = nom_us; changed = true; }
        if (changed) await user.save();
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));
