// src/controllers/authGoogle.controller.js
/**
 * Flujo Google sin JWT. Guardamos al usuario en req.session
 * y redirigimos al frontend a una ruta de éxito.
 */

export function googleRedirect(req, res, next) {
  // Solo deja pasar al passport.authenticate
  return next();
}

export function googleCallback(req, res) {
  // Passport puso el usuario encontrado/creado en req.user
  const user = req.user;
  if (!user) {
    const fail = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${fail}/login?error=google`);
  }

  // Guarda datos mínimos en la sesión del backend
  req.session.user = {
    id_us: user.id_us,
    tip_us: user.tip_us,
    nom_us: user.nom_us || user.nom1_us || user.nombre || "",
    email: user.correo || user.email || "",
  };

  // Redirige a una página del frontend que hará /api/auth/me
  const ok = process.env.FRONTEND_URL || "http://localhost:5173";
  return res.redirect(`${ok}/oauth/google/success`);
}

/** Devuelve el usuario de la sesión (para que el front lo guarde en localStorage) */
export function me(req, res) {
  if (req.session?.user) {
    return res.json({ estatus: "exitoso", usuario: req.session.user });
  }
  return res.status(401).json({ estatus: "error", mensaje: "No hay sesión" });
}

/** Cierra sesión (destruye la sesión del backend) */
export function logout(req, res) {
  req.session?.destroy?.(() => {
    res.clearCookie?.("connect.sid");
    return res.json({ estatus: "exitoso" });
  });
}
