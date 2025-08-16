import Producto from '../models/Producto.js';
import Categoria from '../models/Categoria.js';

export async function catalogo(req, res) {
  try {
    const productos = await Producto.findAll({
      where: { status_pr: 1 },
      attributes: [
        'id_pr', 'nom_pr', 'precio_pr', 'img_pr',
        'id_cat', 'desc_pr', 'stock', 'status_pr'
      ],
      include: [
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id_cat', 'nom_cat']
        }
      ],
      order: [['id_pr', 'ASC']]
    });

    const data = productos.map(p => ({
      id_pr: p.id_pr,
      nom_pr: p.nom_pr,
      precio_pr: Number(p.precio_pr),
      img_pr: p.img_pr,
      id_cat: p.id_cat,
      categoria_nom: p.categoria?.nom_cat ?? null,
      desc_pr: p.desc_pr ?? '',
      stock: Number(p.stock ?? 0),
      disponible: Number(p.stock ?? 0) > 0
    }));

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({
      estatus: 'error',
      mensaje: 'Error al obtener productos: ' + e.message
    });
  }
}
