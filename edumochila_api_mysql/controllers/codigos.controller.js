// src/controllers/codigos.controller.js
import Codigo from '../models/Codigo.js';
import Venta from '../models/Venta.js';
import Producto from '../models/Producto.js';

/**
 * GET /api/codigos/ultimo
 * Devuelve el código más reciente insertado en la tabla (global).
 */
export async function ultimoCodigo(req, res) {
  try {
    const row = await Codigo.findOne({
      order: [
        ['creado_en', 'DESC'],
        ['id', 'DESC'], // desempate
      ],
      include: [
        {
          model: Venta,
          as: 'venta',
          attributes: ['id_ve', 'id_us', 'fec_ve', 'total_ve', 'id_pr'],
          include: [{ model: Producto, as: 'producto', attributes: ['id_pr', 'nom_pr', 'precio_pr', 'img_pr'] }],
        },
      ],
    });

    // Si no hay códigos aún
    if (!row) return res.status(200).json(null);

    return res.json(row);
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}

/**
 * GET /api/codigos
 * Devuelve toda la tabla de códigos (ordenado del más nuevo al más viejo).
 * Si quieres que solo sea para admin, pon un middleware de rol aquí.
 */
export async function listarCodigos(req, res) {
  try {
    const rows = await Codigo.findAll({
      order: [['creado_en', 'DESC'], ['id', 'DESC']],
      include: [
        {
          model: Venta,
          as: 'venta',
          attributes: ['id_ve', 'id_us', 'fec_ve', 'total_ve', 'id_pr'],
          include: [{ model: Producto, as: 'producto', attributes: ['id_pr', 'nom_pr', 'precio_pr', 'img_pr'] }],
        },
      ],
    });

    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}

/**
 * GET /api/codigos/mios
 * Devuelve los códigos asociados al usuario autenticado, con base en id_ve (join a ventas).
 */
export async function misCodigosPorUsuario(req, res) {
  try {
    const id_us = req.user?.id_us;
    if (!id_us) return res.status(401).json({ message: 'No autenticado' });

    const rows = await Codigo.findAll({
      include: [
        {
          model: Venta,
          as: 'venta',
          where: { id_us },
          attributes: ['id_ve', 'fec_ve', 'total_ve', 'id_pr'],
          include: [{ model: Producto, as: 'producto', attributes: ['id_pr', 'nom_pr', 'precio_pr', 'img_pr'] }],
        },
      ],
      order: [['creado_en', 'DESC'], ['id', 'DESC']],
    });

    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}
