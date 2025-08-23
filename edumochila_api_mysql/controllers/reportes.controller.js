// src/controllers/reportes.controller.js
import { sequelize } from '../config/database.js';

/**
 * GET /api/reportes/ventas
 * Query opcionales: from=YYYY-MM-DD, to=YYYY-MM-DD, limit, offset
 */
export async function reporteVentas(req, res) {
  try {
    const { from, to } = req.query;
    const limit = Math.min(Number(req.query.limit ?? 200), 1000);
    const offset = Math.max(Number(req.query.offset ?? 0), 0);

    const where = [];
    const repl = { limit, offset };

    if (from) { where.push('v.fec_ve >= :from'); repl.from = `${from} 00:00:00`; }
    if (to)   { where.push('v.fec_ve <= :to');   repl.to   = `${to} 23:59:59`; }

    const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const sql = `
      SELECT
        v.id_ve,
        v.fec_ve,
        v.total_ve,
        v.paypal_order_id,
        v.id_us,
        u.nom_us,
        u.email_us,
        v.id_pr,
        p.nom_pr,
        p.precio_pr
      FROM ventas v
      JOIN usuarios u  ON u.id_us = v.id_us
      JOIN productos p ON p.id_pr = v.id_pr
      ${whereSQL}
      ORDER BY v.fec_ve DESC
      LIMIT :limit OFFSET :offset
    `;

    const rows = await sequelize.query(sql, { replacements: repl, type: sequelize.QueryTypes.SELECT });
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}

/**
 * GET /api/reportes/productos
 */
export async function reporteProductos(_req, res) {
  try {
    const sql = `
      SELECT
        p.id_pr,
        p.nom_pr,
        p.precio_pr,
        p.stock,
        p.status_pr,
        c.nom_cat AS categoria
      FROM productos p
      LEFT JOIN categorias c ON c.id_cat = p.id_cat
      ORDER BY p.id_pr DESC
    `;
    const rows = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}

/**
 * GET /api/reportes/usuarios
 */
export async function reporteUsuarios(_req, res) {
  try {
    // Ajusta columnas a tu esquema real de "usuarios"
    const sql = `
      SELECT
        id_us,
        nom_us,
        email_us,
        tip_us
      FROM usuarios
      ORDER BY id_us DESC
    `;
    const rows = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}

/**
 * (Opcional) GET /api/reportes/codigos
 * Útil si quieres listar también los códigos generados.
 */
export async function reporteCodigos(_req, res) {
  try {
    const sql = `
      SELECT
        c.id,
        c.codigo,
        c.creado_en,
        c.id_ve,
        v.id_us,
        u.nom_us,
        v.id_pr,
        p.nom_pr
      FROM codigos c
      JOIN ventas v   ON v.id_ve = c.id_ve
      JOIN usuarios u ON u.id_us = v.id_us
      JOIN productos p ON p.id_pr = v.id_pr
      ORDER BY c.creado_en DESC
    `;
    const rows = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}
