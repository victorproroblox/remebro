import Message from '../models/Message.js';
import { DateTime } from 'luxon';

function dayRangeUTC(fechaYYYYMMDD, tz = process.env.TZ_AMERICA || 'America/Mexico_City') {
  const start = DateTime.fromISO(fechaYYYYMMDD, { zone: tz }).startOf('day');
  const end   = start.endOf('day');
  return { start: start.toUTC().toJSDate(), end: end.toUTC().toJSDate() };
}

// GET /api/mensajes/:producto_id/:fecha  (fecha: YYYY-MM-DD)
export async function mensajesPorProductoYFecha(req, res) {
  try {
    const { producto_id, fecha } = req.params;
    if (!producto_id) return res.status(422).json({ mensaje: 'producto_id requerido' });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return res.status(422).json({ mensaje: 'fecha debe ser YYYY-MM-DD' });
    }

    const { start, end } = dayRangeUTC(fecha);
    const mensajes = await Message.find({
      producto_id,
      fecha: { $gte: start, $lte: end }
    }).sort({ fecha: 1 });

    return res.json(mensajes);
  } catch (e) {
    return res.status(500).json({ mensaje: 'Error al obtener mensajes', error: e.message });
  }
}

// POST /api/mensajes
// Body: { producto_id?: string, message: string, fecha?: ISODate }
export async function create(req, res) {
  try {
    const producto_id = req.body.producto_id || 'MOCHILA123';
    const { message, fecha } = req.body;
    if (!message) return res.status(422).json({ mensaje: 'message es requerido' });

    const doc = await Message.create({
      producto_id,
      message,
      fecha: fecha ? new Date(fecha) : new Date()
    });

    return res.json({ mensaje: 'Mensaje guardado correctamente', data: doc });
  } catch (e) {
    return res.status(500).json({ mensaje: 'Error al guardar mensaje', error: e.message });
  }
}
