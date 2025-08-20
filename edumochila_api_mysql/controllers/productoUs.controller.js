import UsuarioProducto from '../models/UsuarioProducto.js';

export async function registerProduct(req, res) {
  try {
    const { producto_id, nom_alumno } = req.body;

    if (!producto_id || typeof producto_id !== 'string' || !producto_id.trim()) {
      return res.status(422).json({ message: 'producto_id es requerido y debe ser string.' });
    }
    if (producto_id.length > 10) {
      return res.status(422).json({ message: 'producto_id debe tener máximo 10 caracteres.' });
    }
    if (nom_alumno && (typeof nom_alumno !== 'string' || nom_alumno.length > 100)) {
      return res.status(422).json({ message: 'nom_alumno debe ser string y máximo 100 caracteres.' });
    }

    const id_us = req.user?.id_us;
    if (!id_us) {
      return res.status(401).json({ message: 'No hay sesión activa.' });
    }

    const existing = await UsuarioProducto.findOne({ where: { id_us } });
    if (existing) {
      return res.status(400).json({ message: 'Ya has registrado un producto.' });
    }

    const userProduct = await UsuarioProducto.create({
      id_us,
      producto_id: producto_id.trim(),
      nom_alumno: nom_alumno?.trim() || null
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

    const userProduct = await UsuarioProducto.findOne({
      where: { id_us },
      attributes: ['producto_id', 'nom_alumno']
    });

    if (!userProduct) {
      return res.status(404).json({ message: 'No tienes un producto registrado.' });
    }

    return res.json({
      producto_id: userProduct.producto_id,
      nom_alumno: userProduct.nom_alumno
    });
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

    await userProduct.destroy();

    return res.status(200).json({ message: 'Producto desvinculado correctamente' });
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}
