// controllers/auth.controller.js
import bcrypt from "bcryptjs";
import { sequelize } from "../config/database.js";
import Usuario from "../models/Usuario.js";
import Estado from "../models/Estado.js";

const trimOrNull = (v) => (v === undefined || v === null ? null : String(v).trim());

export async function login(req, res) {
  try {
    const nom_us = trimOrNull(req.body.nom_us);
    const pass_us = req.body.pass_us;

    if (!nom_us || !pass_us) {
      return res
        .status(422)
        .json({ estatus: "error", mensaje: "nom_us y pass_us son requeridos" });
    }

    const usuario = await Usuario.findOne({ where: { nom_us } });
    if (!usuario || !usuario.pass_us) {
      return res
        .status(401)
        .json({ estatus: "error", mensaje: "Usuario o contraseña incorrectos" });
    }

    const ok = await bcrypt.compare(String(pass_us), usuario.pass_us);
    if (!ok) {
      return res
        .status(401)
        .json({ estatus: "error", mensaje: "Usuario o contraseña incorrectos" });
    }

    // ✅ Sin token: solo regresamos info mínima del usuario
    return res.json({
      estatus: "exitoso",
      mensaje: "Inicio de sesión correcto",
      usuario: {
        id_us: usuario.id_us,
        nom_us: usuario.nom_us,
        tip_us: usuario.tip_us ?? 2,
      },
    });
  } catch (e) {
    return res
      .status(500)
      .json({ estatus: "error", mensaje: "Error en el servidor: " + e.message });
  }
}

export async function register(req, res) {
  try {
    // Sanitizar
    const nom1_us = trimOrNull(req.body.nom1_us);
    const nom2_us = trimOrNull(req.body.nom2_us);
    const ap_us = trimOrNull(req.body.ap_us);
    const am_us = trimOrNull(req.body.am_us);
    const email_us = trimOrNull(req.body.email_us)?.toLowerCase() || null;
    const nom_us = trimOrNull(req.body.nom_us);
    const pass_us = req.body.pass_us;

    const tip_req = req.body.tip_us;
    const cp_us = trimOrNull(req.body.cp_us);
    const mun_us = trimOrNull(req.body.mun_us);
    const id_estado =
      req.body.id_estado !== undefined && req.body.id_estado !== null
        ? Number(req.body.id_estado)
        : null;
    const colonia_us = trimOrNull(req.body.colonia_us);
    const calle_us = trimOrNull(req.body.calle_us);
    const ni_us = trimOrNull(req.body.ni_us);
    const ne_us = trimOrNull(req.body.ne_us);
    const cedula_us = trimOrNull(req.body.cedula_us);

    // Reglas mínimas
    if (!nom1_us || !ap_us || !am_us || !email_us || !nom_us || !pass_us) {
      return res.status(422).json({
        estatus: "error",
        mensaje:
          "Faltan campos requeridos (nom1_us, ap_us, am_us, email_us, nom_us, pass_us).",
      });
    }

    const tip = Number.isInteger(Number(tip_req)) ? Number(tip_req) : 2;

    if (tip === 3 && !cedula_us) {
      return res.status(422).json({
        estatus: "error",
        mensaje: "cedula_us es obligatoria para maestros (tip_us=3).",
      });
    }

    if (cp_us && !/^\d{5}$/.test(cp_us)) {
      return res
        .status(422)
        .json({ estatus: "error", mensaje: "cp_us debe ser 5 dígitos." });
    }

    if (id_estado !== null && !Number.isInteger(id_estado)) {
      return res
        .status(422)
        .json({ estatus: "error", mensaje: "id_estado debe ser entero." });
    }

    // Unicidades
    if (nom_us) {
      const dupUser = await Usuario.findOne({ where: { nom_us } });
      if (dupUser) {
        return res
          .status(409)
          .json({ estatus: "error", mensaje: "nom_us ya está en uso." });
      }
    }
    if (email_us) {
      const dupEmail = await Usuario.findOne({ where: { email_us } });
      if (dupEmail) {
        return res
          .status(409)
          .json({ estatus: "error", mensaje: "email_us ya está en uso." });
      }
    }

    // Validar estado existente (si viene)
    if (id_estado !== null) {
      const estadoOk = await Estado.findByPk(id_estado);
      if (!estadoOk) {
        return res
          .status(422)
          .json({ estatus: "error", mensaje: "id_estado no existe." });
      }
    }

    const hash = await bcrypt.hash(String(pass_us), 10);

    const nuevo = await Usuario.create({
      nom1_us,
      nom2_us,
      ap_us,
      am_us,
      email_us,
      nom_us,
      pass_us: hash,
      tip_us: tip,
      cp_us,
      mun_us,
      id_estado,
      colonia_us,
      calle_us,
      ni_us,
      ne_us,
      cedula_us: tip === 3 ? cedula_us : null,
    });

    return res.status(201).json({
      estatus: "exitoso",
      mensaje: "Usuario registrado con éxito",
      usuario: {
        id_us: nuevo.id_us,
        nom_us: nuevo.nom_us,
        tip_us: nuevo.tip_us,
      },
    });
  } catch (e) {
    // Duplicado por índice único (fallback)
    if (e?.original?.code === "ER_DUP_ENTRY" || e?.original?.errno === 1062) {
      return res
        .status(409)
        .json({ estatus: "error", mensaje: "Usuario o email ya existe." });
    }
    return res
      .status(500)
      .json({ estatus: "error", mensaje: "Fallo en el registro: " + e.message });
  }
}

export async function logout(_req, res) {
  // Sin JWT, el logout es responsabilidad del cliente (borrar localStorage/estado).
  return res.json({
    estatus: "exitoso",
    mensaje: "Sesión cerrada correctamente.",
  });
}

export async function dbCheck(_req, res) {
  try {
    await sequelize.authenticate();
    return res.json({
      estatus: "exitoso",
      mensaje: "Conexión establecida con la base de datos",
    });
  } catch (e) {
    return res
      .status(500)
      .json({ estatus: "error", mensaje: "Error de conexión: " + e.message });
  }
}
