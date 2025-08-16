import UsuarioProducto from '../models/UsuarioProducto.js';

export async function registerProduct(req, res) {
  try {
    const { producto_id } = req.body;

    if (!producto_id || typeof producto_id !== 'string' || !producto_id.trim()) {
      return res.status(422).json({ message: 'producto_id es requerido y debe ser string.' });
    }
    if (producto_id.length > 10) {
      return res.status(422).json({ message: 'producto_id debe tener máximo 10 caracteres.' });
    }

    const id_us = req.user?.id_us; // viene del authGuard (JWT)
    if (!id_us) {
      return res.status(401).json({ message: 'No hay sesión activa.' });
    }

    const existing = await UsuarioProducto.findOne({ where: { id_us } });
    if (existing) {
      return res.status(400).json({ message: 'Ya has registrado un producto.' });
    }

    const userProduct = await UsuarioProducto.create({
      id_us,
      producto_id: producto_id.trim()
    });

    return res.status(201).json({
      message: 'Producto registrado exitosamente',
      data: userProduct
    });
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}

export async function getProduct(req, res) {
  try {
    const id_us = req.user?.id_us;
    if (!id_us) {
      return res.status(401).json({ message: 'No hay sesión activa.' });
    }

    const userProduct = await UsuarioProducto.findOne({ where: { id_us } });
    if (!userProduct) {
      return res.status(404).json({ message: 'No tienes un producto registrado.' });
    }

    return res.json({ producto_id: userProduct.producto_id });
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}

export async function removeProduct(req, res) {
  try {
    const id_us = req.user?.id_us;
    if (!id_us) {
      return res.status(401).json({ message: 'No hay sesión activa.' });
    }

    const userProduct = await UsuarioProducto.findOne({ where: { id_us } });
    if (!userProduct) {
      return res.status(404).json({ message: 'No tienes un producto registrado.' });
    }

    await userProduct.destroy(); // o UsuarioProducto.destroy({ where: { id_us } })

    return res.status(200).json({
      message: 'Producto desvinculado correctamente'
    });
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}

