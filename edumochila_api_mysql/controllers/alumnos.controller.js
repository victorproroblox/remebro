// controllers/alumnos.controller.js
import UsuarioProducto from '../models/UsuarioProducto.js';

export async function crearAlumno(req, res) {
  try {
    const { producto_id, nom_alumno } = req.body;

    if (!producto_id || typeof producto_id !== 'string' || !producto_id.trim() || producto_id.length > 10) {
      return res.status(422).json({ message: 'producto_id es requerido, string, y máx 10 caracteres.' });
    }
    if (!nom_alumno || typeof nom_alumno !== 'string' || !nom_alumno.trim() || nom_alumno.length > 100) {
      return res.status(422).json({ message: 'nom_alumno es requerido, string, y máx 100 caracteres.' });
    }

    const id_us = req.user?.id_us;
    if (!id_us) return res.status(401).json({ message: 'No hay sesión activa.' });

    // Asegurar que el producto_id no esté ya vinculado con alguien
    const dup = await UsuarioProducto.findOne({ where: { producto_id: producto_id.trim() } });
    if (dup) return res.status(409).json({ message: 'Este producto_id ya está registrado.' });

    const row = await UsuarioProducto.create({
      id_us,
      producto_id: producto_id.trim(),
      nom_alumno: nom_alumno.trim()
    });

    return res.status(201).json({ message: 'Alumno registrado', data: row });
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}

export async function listarAlumnos(req, res) {
  try {
    const id_us = req.user?.id_us;
    if (!id_us) return res.status(401).json({ message: 'No hay sesión activa.' });

    const lista = await UsuarioProducto.findAll({
      where: { id_us },
      attributes: ['producto_id', 'nom_alumno']
    });

    return res.json({ data: lista });
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}

export async function eliminarAlumno(req, res) {
  try {
    const id_us = req.user?.id_us;
    if (!id_us) return res.status(401).json({ message: 'No hay sesión activa.' });

    const { producto_id } = req.params;
    if (!producto_id) return res.status(400).json({ message: 'producto_id es requerido.' });

    const row = await UsuarioProducto.findOne({ where: { id_us, producto_id } });
    if (!row) return res.status(404).json({ message: 'No se encontró el alumno/producto para este maestro.' });

    await row.destroy();
    return res.json({ message: 'Alumno eliminado' });
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}
