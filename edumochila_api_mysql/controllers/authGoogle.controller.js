// controllers/authGoogle.controller.js
import jwt from 'jsonwebtoken';

export function googleRedirect(req, res, next) {
  // Solo dispara el flujo de Google (scope email + profile)
  next();
}

export function googleCallback(req, res) {
  // Si estamos aquí, req.user viene de passport (usuario DB)
  const user = req.user;
  const token = jwt.sign(
    { id_us: user.id_us, tip_us: user.tip_us, nom_us: user.nom_us },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Opción simple: manda el token a tu frontend por query string
  const redirectUrl = `${process.env.FRONTEND_URL}/home?token=${encodeURIComponent(token)}`;

  // (Alternativa más segura: setear cookie httpOnly aquí y redirigir sin token en URL)
  return res.redirect(redirectUrl);
}
