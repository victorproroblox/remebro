// IMPORTANTE: no dependemos de asociaciones aquí
// controllers/codigos.controller.js
import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/database.js';   // 👈 IMPORTANTE
import Codigo from '../models/Codigo.js';             // (opcional si luego lo usas)
/**
 * GET /api/codigos/ultimo
 * - Si viene ?id_ve=N -> devuelve el código más reciente de esa venta
 * - Si NO viene id_ve   -> devuelve el código global más reciente
 */
export async function ultimoCodigo(req, res) {
  try {
    const id_ve = req.query?.id_ve ? Number(req.query.id_ve) : null;

    if (id_ve) {
      const row = await Codigo.findOne({
        where: { id_ve },
        order: [['id', 'DESC']],
        attributes: ['id', 'id_ve', 'codigo', 'creado_en'],
      });
      if (!row) {
        return res.status(404).json({ message: 'No hay código para esa venta aún.' });
      }
      return res.json(row);
    }

    // Global más reciente
    const row = await Codigo.findOne({
      order: [['id', 'DESC']],
      attributes: ['id', 'id_ve', 'codigo', 'creado_en'],
    });
    if (!row) {
      return res.status(404).json({ message: 'No hay códigos registrados.' });
    }
    return res.json(row);
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}

/** Si ya tenías estos, déjalos igual */
export async function listarCodigos(_req, res) {
  try {
    const rows = await Codigo.findAll({
      order: [['id', 'DESC']],
      attributes: ['id', 'id_ve', 'codigo', 'creado_en'],
    });
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}

export async function misCodigosPorUsuario(req, res) {
  try {
    const id_us = Number(req.query?.id_us ?? req.body?.id_us);
    if (!id_us) {
      return res.status(422).json({ message: 'id_us es requerido y debe ser entero.' });
    }

    const sql = `
      SELECT
        c.id           AS codigo_id,
        c.codigo       AS codigo,
        c.creado_en    AS creado_en,
        v.id_ve        AS id_ve,
        v.fec_ve       AS fec_ve,
        v.total_ve     AS total_ve,
        p.id_pr        AS id_pr,
        p.nom_pr       AS nom_pr,
        p.precio_pr    AS precio_pr,
        p.img_pr       AS img_pr
      FROM codigos c
      INNER JOIN ventas v  ON v.id_ve = c.id_ve
      INNER JOIN productos p ON p.id_pr = v.id_pr
      WHERE v.id_us = :id_us
      ORDER BY c.creado_en DESC, v.fec_ve DESC
    `;

    const [rows] = await sequelize.query(sql, {
      replacements: { id_us },
    });

    return res.json({ data: rows });
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}
