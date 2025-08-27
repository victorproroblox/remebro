// src/controllers/authGoogle.controller.js
/**
 * Flujo Google sin JWT. Guardamos al usuario en req.session
 * y redirigimos al frontend a una ruta de éxito.
 */

export function googleRedirect(req, res, next) {
  // Solo deja pasar al passport.authenticate
  return next();
}

// src/controllers/authGoogle.controller.js
// src/controllers/authGoogle.controller.js
const ALLOWED_FRONTS = new Set([
  "https://edumochila-web.onrender.com",
  "http://localhost:5173",
]);

export function googleCallback(req, res) {
  const user = req.user;
  const FRONT = process.env.FRONTEND_URL || "http://localhost:5173";

  if (!user) {
    return res.redirect(`${FRONT}/login?error=google`);
  }

  // Guardar la sesión
  req.session.user = {
    id_us: user.id_us,
    tip_us: user.tip_us,
    nom_us: user.nom_us || "",
    email: user.email || user.correo || "",
  };

  // Redirigir según el tipo de usuario
  if (user.tip_us === 1) {
    return res.redirect(`${FRONT}/dashboard`);
  } else if (user.tip_us === 3) {
    return res.redirect(`${FRONT}/maestro`);
  } else {
    return res.redirect(`${FRONT}/home`);
  }
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
