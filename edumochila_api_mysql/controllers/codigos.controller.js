// IMPORTANTE: no dependemos de asociaciones aquí
import Codigo from '../models/Codigo.js';

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
  // Si en algún momento quieres esto, aquí normalmente necesitarías join con ventas->usuarios.
  // Lo dejo como placeholder:
  return res.status(501).json({ message: 'No implementado' });
}
