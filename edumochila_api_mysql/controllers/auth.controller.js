import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sequelize } from '../config/database.js';
import Usuario from '../models/Usuario.js';

export async function login(req, res) {
  try {
    const { nom_us, pass_us } = req.body;
    if (!nom_us || !pass_us) {
      return res.status(422).json({ estatus: 'error', mensaje: 'nom_us y pass_us son requeridos' });
    }

    const usuario = await Usuario.findOne({ where: { nom_us } });
    if (!usuario || !usuario.pass_us) {
      return res.status(401).json({ estatus: 'error', mensaje: 'Usuario o contraseña incorrectos' });
    }

    const ok = await bcrypt.compare(pass_us, usuario.pass_us);
    if (!ok) {
      return res.status(401).json({ estatus: 'error', mensaje: 'Usuario o contraseña incorrectos' });
    }

    // Generar JWT (reemplaza a Sanctum)
    const token = jwt.sign(
      { id_us: usuario.id_us, tip_us: usuario.tip_us, nom_us: usuario.nom_us },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      estatus: 'exitoso',
      mensaje: 'Inicio de sesión correcto',
      access_token: token,
      token_type: 'Bearer',
      usuario: {
        id_us: usuario.id_us,
        nom_us: usuario.nom_us,
        tip_us: usuario.tip_us
      }
    });
  } catch (e) {
    return res.status(500).json({ estatus: 'error', mensaje: 'Error en el servidor: ' + e.message });
  }
}

export async function register(req, res) {
  try {
    const { nom1_us, nom2_us, ap_us, am_us, email_us, nom_us, pass_us } = req.body;

    if (!nom1_us || !ap_us || !am_us || !email_us || !nom_us || !pass_us) {
      return res.status(422).json({ estatus: 'error', mensaje: 'Faltan campos requeridos' });
    }

    // Unicidades similares a Laravel
    const dupUser = await Usuario.findOne({ where: { nom_us } });
    if (dupUser) return res.status(409).json({ estatus: 'error', mensaje: 'nom_us ya está en uso' });

    if (email_us) {
      const dupEmail = await Usuario.findOne({ where: { email_us } });
      if (dupEmail) return res.status(409).json({ estatus: 'error', mensaje: 'email_us ya está en uso' });
    }

    const hash = await bcrypt.hash(pass_us, 10);

    const nuevo = await Usuario.create({
      nom1_us, nom2_us: nom2_us ?? null, ap_us, am_us,
      email_us, nom_us, pass_us: hash, tip_us: 2
    });

    return res.json({
      estatus: 'exitoso',
      mensaje: 'Usuario registrado con éxito',
      usuario: {
        id_us: nuevo.id_us,
        nom_us: nuevo.nom_us,
        tip_us: nuevo.tip_us
      }
    });
  } catch (e) {
    return res.status(500).json({ estatus: 'error', mensaje: 'Fallo en el registro: ' + e.message });
  }
}

export async function logout(req, res) {
  // En JWT no hay “revocar” en servidor por defecto.
  // Se maneja en frontend (borrar token) o con blacklist en servidor (si lo deseas luego).
  return res.json({ estatus: 'exitoso', mensaje: 'Sesión cerrada correctamente (JWT invalidado en cliente).' });
}

export async function dbCheck(req, res) {
  try {
    await sequelize.authenticate();
    return res.json({ estatus: 'exitoso', mensaje: 'Conexión establecida con la base de datos' });
  } catch (e) {
    return res.status(500).json({ estatus: 'error', mensaje: 'Error de conexión: ' + e.message });
  }
}
