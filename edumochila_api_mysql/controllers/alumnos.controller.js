import UsuarioProducto from '../models/UsuarioProducto.js';

// POST /api/alumnos   body: { id_us, nom_alumno, producto_id }
export async function crearAlumno(req, res) {
  try {
    const id_us = Number(req.body?.id_us);
    const nom_alumno = (req.body?.nom_alumno ?? '').trim();
    const producto_id = (req.body?.producto_id ?? '').trim();

    if (!id_us) return res.status(422).json({ message: 'id_us es requerido (número).' });
    if (!nom_alumno) return res.status(422).json({ message: 'nom_alumno es requerido.' });
    if (!producto_id || producto_id.length > 10) {
      return res.status(422).json({ message: 'producto_id es requerido y máx 10 caracteres.' });
    }

    // ✅ SIN chequeo de duplicados: se permite repetir 'producto_id'
    const row = await UsuarioProducto.create({ id_us, nom_alumno, producto_id });
    return res.status(201).json({ message: 'Alumno registrado', data: row });
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}

// GET /api/alumnos?id_us=123
export async function listarAlumnos(req, res) {
  try {
    const id_us = Number(req.query?.id_us);
    if (!id_us) return res.status(422).json({ message: 'id_us (query) es requerido.' });

    const lista = await UsuarioProducto.findAll({
      where: { id_us },
      attributes: ['nom_alumno', 'producto_id'],
      order: [['nom_alumno', 'ASC']]
    });
    return res.json({ data: lista });
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}

// DELETE /api/alumnos/:producto_id?id_us=123
export async function eliminarAlumno(req, res) {
  try {
    const id_us = Number(req.query?.id_us);
    const { producto_id } = req.params;

    if (!id_us) return res.status(422).json({ message: 'id_us (query) es requerido.' });
    if (!producto_id) return res.status(422).json({ message: 'producto_id (param) es requerido.' });

    const row = await UsuarioProducto.findOne({ where: { id_us, producto_id } });
    if (!row) return res.status(404).json({ message: 'No se encontró el alumno/producto para este usuario.' });

    await row.destroy();
    return res.json({ message: 'Alumno eliminado' });
  } catch (e) {
    return res.status(500).json({ message: 'Error en el servidor: ' + e.message });
  }
}
