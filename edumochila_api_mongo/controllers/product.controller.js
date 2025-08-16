import Producto from '../models/Producto.js';

// POST /api/productos/register
export async function registerProduct(req, res) {
  try {
    const { producto_id } = req.body;
    if (!producto_id || typeof producto_id !== 'string' || !producto_id.trim()) {
      return res.status(422).json({ message: 'producto_id es requerido y debe ser string.' });
    }

    const user_id = req.user?.id_us; // viene de authGuard (JWT)
    if (!user_id) return res.status(401).json({ message: 'No autenticado' });

    // Inserción (producto_id único). Manejo de duplicados (E11000)
    try {
      const doc = await Producto.create({
        producto_id: producto_id.trim(),
        user_id,
        fecha_registro: new Date()
      });

      return res.status(201).json({
        message: 'Producto registrado exitosamente',
        producto: doc
      });
    } catch (e) {
      if (e.code === 11000) {
        return res.status(409).json({ message: 'producto_id ya registrado' });
      }
      throw e;
    }
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}

// GET /api/productos/my
export async function getProduct(req, res) {
  try {
    const user_id = req.user?.id_us;
    if (!user_id) return res.status(401).json({ message: 'No autenticado' });

    const producto = await Producto.findOne({ user_id });
    if (!producto) {
      return res.status(404).json({ message: 'No se ha registrado ningún producto.' });
    }

    return res.json({
      producto_id: producto.producto_id,
      fecha_registro: producto.fecha_registro
    });
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}
