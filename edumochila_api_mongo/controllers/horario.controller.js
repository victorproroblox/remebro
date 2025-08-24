import Horario from '../models/Horario.js';

// POST /api/horario/clase
// POST /api/horario/clase
export async function agregarClase(req, res) {
  try {
    const { producto_id, dia, hora, materia, materiales } = req.body;

    if (!producto_id || !dia || !hora || !materia) {
      return res
        .status(422)
        .json({ message: 'producto_id, dia, hora y materia son requeridos' });
    }

    const diaKey = String(dia).toLowerCase();

    // materiales: string -> array
    const mats = Array.isArray(materiales)
      ? materiales
      : (materiales || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

    // ✅ No uses $setOnInsert sobre "clases" porque entra en conflicto con $push
    await Horario.updateOne(
      { producto_id, dia: diaKey },
      { $push: { clases: { hora, materia, materiales: mats } } },
      { upsert: true, setDefaultsOnInsert: true }
    );

    // Devuelve el documento actualizado
    const doc = await Horario.findOne({ producto_id, dia: diaKey }).lean();

    return res.json({ message: 'Clase guardada', horario: doc });
  } catch (e) {
    return res
      .status(500)
      .json({ message: 'Error guardando clase: ' + e.message });
  }
}


// PUT /api/horario
export async function reemplazarClases(req, res) {
  try {
    const { producto_id, dia, clases } = req.body;
    if (!producto_id || !dia || !Array.isArray(clases)) {
      return res
        .status(422)
        .json({ message: 'producto_id, dia y clases[] son requeridos' });
    }

    const diaKey = String(dia).toLowerCase();

    // normaliza materiales a array
    const clasesNorm = clases.map((c) => ({
      hora: c.hora,
      materia: c.materia,
      materiales: Array.isArray(c.materiales)
        ? c.materiales
        : (c.materiales || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
    }));

    // SOLO $set del array completo
    const r = await Horario.updateOne(
      { producto_id, dia: diaKey },
      { $set: { clases: clasesNorm } },
      { upsert: true }
    );

    return res.json({ message: 'Horario actualizado', result: r });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

// GET /api/horario/:producto_id/:dia
export async function verPorDia(req, res) {
  try {
    const { producto_id, dia } = req.params;
    const diaKey = String(dia).toLowerCase();

    const doc = await Horario.findOne({ producto_id, dia: diaKey }).lean();
    if (!doc) return res.json({ producto_id, dia: diaKey, clases: [] });

    return res.json(doc);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
