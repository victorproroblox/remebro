import jwt from 'jsonwebtoken';

export function authGuard(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ estatus: 'error', mensaje: 'Token requerido' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id_us, tip_us, nom_us }
    next();
  } catch (e) {
    return res.status(401).json({ estatus: 'error', mensaje: 'Token inválido' });
  }
}
