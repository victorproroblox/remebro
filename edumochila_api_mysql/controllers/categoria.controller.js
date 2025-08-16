import Categoria from '../models/Categoria.js';

export async function verCategorias(req, res) {
  try {
    const categorias = await Categoria.findAll({
      order: [['id_cat', 'ASC']]
    });
    return res.status(200).json(categorias);
  } catch (e) {
    return res.status(500).json({
      estatus: 'error',
      mensaje: 'Error al obtener categorías',
      error: e.message
    });
  }
}
