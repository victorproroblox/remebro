import Ubicacion from '../models/Ubicacion.js';
import { DateTime } from 'luxon';

function dayRangeUTC(fechaYYYYMMDD, tz = process.env.TZ_AMERICA || 'America/Mexico_City') {
  const start = DateTime.fromISO(fechaYYYYMMDD, { zone: tz }).startOf('day');
  const end   = start.endOf('day');
  return { start: start.toUTC().toJSDate(), end: end.toUTC().toJSDate() };
}

// GET /api/ubicaciones/:producto_id/ultima
export async function ultima(req, res) {
  try {
    const { producto_id } = req.params;
    const doc = await Ubicacion.findOne({ producto_id }).sort({ fecha: -1 });
    if (!doc) return res.status(404).json({ message: 'Sin datos' });
    return res.json(doc);
  } catch (e) {
    return res.status(500).json({ message: 'Error al consultar', error: e.message });
  }
}

// GET /api/ubicaciones/:producto_id/hoy
export async function recorridoDelDia(req, res) {
  try {
    const { producto_id } = req.params;
    const today = DateTime.now().setZone(process.env.TZ_AMERICA || 'America/Mexico_City').toISODate();
    const { start, end } = dayRangeUTC(today);

    const docs = await Ubicacion.find({
      producto_id,
      fecha: { $gte: start, $lte: end }
    }).sort({ fecha: 1 });

    return res.json(docs);
  } catch (e) {
    return res.status(500).json({ message: 'Error al consultar recorrido del día', error: e.message });
  }
}

// GET /api/ubicaciones/:producto_id/por-fecha?fecha=YYYY-MM-DD
export async function recorridoPorFecha(req, res) {
  try {
    const { producto_id } = req.params;
    const fecha = req.query.fecha;
    if (!fecha) return res.status(400).json({ message: 'Fecha no proporcionada' });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return res.status(422).json({ message: 'fecha debe ser YYYY-MM-DD' });
    }

    const { start, end } = dayRangeUTC(fecha);
    const docs = await Ubicacion.find({
      producto_id,
      fecha: { $gte: start, $lte: end }
    }).sort({ fecha: 1 });

    return res.json(docs);
  } catch (e) {
    return res.status(500).json({ message: 'Error al filtrar por fecha' });
  }
}

// (Opcional) POST /api/ubicaciones  ← ingesta desde el IoT
// Body: { producto_id, lat, lng, fecha?: ISODate }
export async function store(req, res) {
  try {
    const { producto_id, lat, lng, fecha } = req.body;
    if (!producto_id || typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(422).json({ message: 'producto_id, lat y lng son requeridos' });
    }
    const doc = await Ubicacion.create({
      producto_id,
      lat, lng,
      fecha: fecha ? new Date(fecha) : new Date()
    });
    return res.status(201).json({ message: 'Ubicación registrada', data: doc });
  } catch (e) {
    return res.status(500).json({ message: 'Error al registrar', error: e.message });
  }
}
