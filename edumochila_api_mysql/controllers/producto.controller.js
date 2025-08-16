import Producto from '../models/Producto.js';
import Categoria from '../models/Categoria.js';

// Helpers de validación simples
function isNumber(x) { return x !== undefined && x !== null && !Number.isNaN(Number(x)); }
function requiredStr(s, max) { return typeof s === 'string' && s.trim().length > 0 && s.length <= max; }

const productoFields = ['nom_pr','precio_pr','status_pr','img_pr','id_cat','desc_pr','stock'];

function toDTO(p) {
  return {
    id_pr: p.id_pr,
    nom_pr: p.nom_pr,
    precio_pr: Number(p.precio_pr),
    status_pr: p.status_pr,
    img_pr: p.img_pr,
    id_cat: p.id_cat,
    desc_pr: p.desc_pr,
    stock: p.stock,
    nom_cat: p.categoria?.nom_cat ?? null
  };
}

// GET /api/productos/admin  -> todos (con categoría)
export async function verProductosAd(req, res) {
  const productos = await Producto.findAll({
    include: [{ model: Categoria, as: 'categoria', attributes: ['nom_cat'] }],
    order: [['id_pr','ASC']]
  });
  return res.json(productos.map(toDTO));
}

// GET /api/productos  -> activos con stock > 0 (con categoría)
export async function verProductos(req, res) {
  const productos = await Producto.findAll({
    where: { status_pr: 1 },
    include: [{ model: Categoria, as: 'categoria', attributes: ['nom_cat'] }],
    order: [['id_pr','ASC']]
  });
  const conStock = productos.filter(p => (p.stock ?? 0) > 0);
  return res.json(conStock.map(toDTO));
}

// GET /api/productos/filtro?id_categoria=#
export async function filtro(req, res) {
  const id_categoria = req.query.id_categoria;
  const where = { status_pr: 1 };
  if (id_categoria) where.id_cat = id_categoria;

  const productos = await Producto.findAll({
    where,
    include: [{ model: Categoria, as: 'categoria', attributes: ['nom_cat'] }],
    order: [['id_pr','ASC']]
  });
  return res.json(productos.map(toDTO));
}

// POST /api/productos
export async function agregar(req, res) {
  try {
    const { nom_pr, precio_pr, status_pr, img_pr, id_cat, desc_pr, stock } = req.body;

    // Validaciones tipo Laravel
    if (!requiredStr(nom_pr, 80)) return res.status(422).json({ estatus:'error', mensaje:'nom_pr requerido (<=80)' });
    if (!isNumber(precio_pr) || Number(precio_pr) < 0) return res.status(422).json({ estatus:'error', mensaje:'precio_pr numérico >= 0' });
    if (!isNumber(status_pr)) return res.status(422).json({ estatus:'error', mensaje:'status_pr requerido' });
    if (!requiredStr(img_pr, 300)) return res.status(422).json({ estatus:'error', mensaje:'img_pr requerido (<=300)' });
    if (!isNumber(id_cat)) return res.status(422).json({ estatus:'error', mensaje:'id_cat requerido' });
    if (desc_pr && typeof desc_pr !== 'string') return res.status(422).json({ estatus:'error', mensaje:'desc_pr debe ser string' });
    if (!isNumber(stock) || Number(stock) < 0) return res.status(422).json({ estatus:'error', mensaje:'stock numérico >= 0' });

    // exists:categorias,id_cat
    const cat = await Categoria.findByPk(id_cat);
    if (!cat) return res.status(422).json({ estatus:'error', mensaje:'id_cat no existe en categorias' });

    const producto = await Producto.create({
      nom_pr: nom_pr.trim(),
      precio_pr,
      status_pr,
      img_pr: img_pr.trim(),
      id_cat,
      desc_pr: desc_pr ?? null,
      stock
    });

    return res.status(201).json({
      estatus: 'exitoso',
      mensaje: 'Producto agregado correctamente',
      producto
    });
  } catch (e) {
    return res.status(500).json({ estatus:'error', mensaje:'Error en el servidor: ' + e.message });
  }
}

// PUT /api/productos/:id
export async function actualizar(req, res) {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ estatus:'error', mensaje:'Producto no encontrado' });

    const { nom_pr, precio_pr, status_pr, img_pr, id_cat, desc_pr, stock } = req.body;

    if (!requiredStr(nom_pr, 80)) return res.status(422).json({ estatus:'error', mensaje:'nom_pr requerido (<=80)' });
    if (!isNumber(precio_pr) || Number(precio_pr) < 0) return res.status(422).json({ estatus:'error', mensaje:'precio_pr numérico >= 0' });
    if (!isNumber(status_pr)) return res.status(422).json({ estatus:'error', mensaje:'status_pr requerido' });
    if (!requiredStr(img_pr, 300)) return res.status(422).json({ estatus:'error', mensaje:'img_pr requerido (<=300)' });
    if (!isNumber(id_cat)) return res.status(422).json({ estatus:'error', mensaje:'id_cat requerido' });
    if (desc_pr && typeof desc_pr !== 'string') return res.status(422).json({ estatus:'error', mensaje:'desc_pr debe ser string' });
    if (!isNumber(stock) || Number(stock) < 0) return res.status(422).json({ estatus:'error', mensaje:'stock numérico >= 0' });

    const cat = await Categoria.findByPk(id_cat);
    if (!cat) return res.status(422).json({ estatus:'error', mensaje:'id_cat no existe en categorias' });

    await producto.update({ nom_pr, precio_pr, status_pr, img_pr, id_cat, desc_pr, stock });

    return res.json({
      estatus:'exitoso',
      mensaje:'Producto actualizado correctamente',
      producto
    });
  } catch (e) {
    return res.status(500).json({ estatus:'error', mensaje:'Error en el servidor' });
  }
}

// GET /api/productos/:id  (con categoría)
export async function verProducto(req, res) {
  const { id } = req.params;
  const producto = await Producto.findByPk(id, {
    include: [{ model: Categoria, as: 'categoria', attributes: ['nom_cat'] }]
  });
  if (!producto) return res.status(404).json({ estatus:'error', mensaje:'Producto no encontrado' });
  return res.json(toDTO(producto));
}

// PATCH /api/productos/:id/baja  -> status_pr = 0
export async function bajaLogica(req, res) {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ estatus:'error', mensaje:'Producto no encontrado' });

    producto.status_pr = 0;
    await producto.save();

    return res.json({
      estatus:'exitoso',
      mensaje:'Producto inactivado correctamente',
      producto
    });
  } catch (e) {
    return res.status(500).json({ estatus:'error', mensaje:'Error en el servidor', error: e.message });
  }
}

// PATCH /api/productos/:id/activar -> status_pr = 1
export async function activarProducto(req, res) {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ estatus:'error', mensaje:'Producto no encontrado' });

    producto.status_pr = 1;
    await producto.save();

    return res.json({
      estatus:'exitoso',
      mensaje:'Producto activado correctamente',
      producto
    });
  } catch (e) {
    return res.status(500).json({ estatus:'error', mensaje:'Error en el servidor', error: e.message });
  }
}
