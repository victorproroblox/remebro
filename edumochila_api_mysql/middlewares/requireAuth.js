// src/middlewares/requireAuth.js
import jwt from 'jsonwebtoken';

/**
 * Extrae y verifica un JWT Bearer y pone el usuario en req.user
 * Espera que el payload tenga al menos { id_us, nom_us, tip_us }.
 */
export function requireAuth(req, res, next) {
  // Authorization: Bearer <token> | x-access-token | cookie (opcional)
  const auth = req.headers.authorization || req.headers['x-access-token'] || '';
  const match = /^Bearer\s+(.+)$/i.exec(auth);
  const token = match ? match[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Falta token de autorización' });
  }

  try {
    const secret = process.env.JWT_SECRET || process.env.SECRET_JWT || 'dev_secret';
    const payload = jwt.verify(token, secret);

    // Normaliza lo que uses en tus controladores
    req.user = {
      id_us: payload.id_us,
      nom_us: payload.nom_us,
      tip_us: payload.tip_us,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}
