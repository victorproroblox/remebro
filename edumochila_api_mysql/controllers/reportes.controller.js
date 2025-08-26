// src/controllers/reportes.controller.js
import { sequelize } from '../config/database.js';

/**
 * GET /api/reportes/ventas
 * Query opcionales: from=YYYY-MM-DD, to=YYYY-MM-DD, limit, offset
 * Respuesta:
 * {
 *   data: [...filas...],
 *   totals: { count, total_importe }
 * }
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

    // Datos (paginados)
    const sqlRows = `
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

    // Totales (mismos filtros, sin límite)
    const sqlTotals = `
      SELECT
        COUNT(*)        AS count,
        COALESCE(SUM(v.total_ve), 0) AS total_importe
      FROM ventas v
      ${whereSQL}
    `;

    const rows   = await sequelize.query(sqlRows,   { replacements: repl, type: sequelize.QueryTypes.SELECT });
    const totals = (await sequelize.query(sqlTotals, { replacements: repl, type: sequelize.QueryTypes.SELECT }))[0];

    return res.json({ data: rows, totals });
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}

/**
 * GET /api/reportes/productos
 * Respuesta:
 * {
 *   data: [...filas...],
 *   totals: { total_activos, total_productos }
 * }
 */
export async function reporteProductos(_req, res) {
  try {
    const sqlRows = `
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

    const sqlTotals = `
      SELECT
        COUNT(*) AS total_productos,
        SUM(CASE WHEN p.status_pr = 1 THEN 1 ELSE 0 END) AS total_activos
      FROM productos p
    `;

    const rows   = await sequelize.query(sqlRows,   { type: sequelize.QueryTypes.SELECT });
    const totals = (await sequelize.query(sqlTotals, { type: sequelize.QueryTypes.SELECT }))[0];

    return res.json({ data: rows, totals });
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}

/**
 * GET /api/reportes/usuarios
 * Respuesta:
 * {
 *   data: [...filas...],
 *   totals: { total_usuarios }
 * }
 */
export async function reporteUsuarios(_req, res) {
  try {
    const sqlRows = `
      SELECT
        id_us,
        nom_us,
        email_us,
        tip_us
      FROM usuarios
      ORDER BY id_us DESC
    `;

    const sqlTotals = `
      SELECT COUNT(*) AS total_usuarios
      FROM usuarios
    `;

    const rows   = await sequelize.query(sqlRows,   { type: sequelize.QueryTypes.SELECT });
    const totals = (await sequelize.query(sqlTotals, { type: sequelize.QueryTypes.SELECT }))[0];

    return res.json({ data: rows, totals });
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}

/**
 * (Opcional) GET /api/reportes/codigos
 * Respuesta:
 * {
 *   data: [...filas...],
 *   totals: { total_codigos }
 * }
 */
export async function reporteCodigos(_req, res) {
  try {
    const sqlRows = `
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

    const sqlTotals = `
      SELECT COUNT(*) AS total_codigos
      FROM codigos
    `;

    const rows   = await sequelize.query(sqlRows,   { type: sequelize.QueryTypes.SELECT });
    const totals = (await sequelize.query(sqlTotals, { type: sequelize.QueryTypes.SELECT }))[0];

    return res.json({ data: rows, totals });
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}
