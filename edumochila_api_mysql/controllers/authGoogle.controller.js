// controllers/authGoogle.controller.js
// Versión SIN JWT: regresamos el usuario en un query param seguro (base64url)

export function googleRedirect(req, res, next) {
  // Passport hará la redirección a Google con scope email + profile
  next();
}

export function googleCallback(req, res) {
  // req.user lo llena passport con tu estrategia de Google
  const user = req.user; // { id_us, tip_us, nom_us, correo, ... } -> asegúrate de poblar esto en tu strategy

  if (!user) {
    const fail = `${process.env.FRONTEND_URL}?error=google`;
    return res.redirect(fail);
  }

  const usuario = {
    id_us: user.id_us,
    tip_us: user.tip_us,
    nom_us: user.nom_us,
    correo: user.correo || user.email || "",
  };

  // Encode base64url del JSON
  const json = JSON.stringify(usuario);
  const b64 = Buffer.from(json, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  // puedes regresar a /login para que procese ?u=...
  const redirectUrl = `${process.env.FRONTEND_URL}/login?u=${b64}`;

  return res.redirect(redirectUrl);
}
