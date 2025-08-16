import Peso from '../models/Peso.js';
import { DateTime } from 'luxon';

function dayRangeUTC(fechaYYYYMMDD, tz = process.env.TZ_AMERICA || 'America/Mexico_City') {
  const start = DateTime.fromISO(fechaYYYYMMDD, { zone: tz }).startOf('day');
  const end   = start.endOf('day');
  return { start: start.toUTC().toJSDate(), end: end.toUTC().toJSDate() };
}

// POST /api/pesos
// Body: { producto_id?: string, peso: number, fecha?: ISODate }
export async function store(req, res) {
  try {
    const producto_id = req.body.producto_id || 'MOCHILA123';
    const { peso, fecha } = req.body;

    if (peso === undefined || isNaN(Number(peso))) {
      return res.status(422).json({ message: 'peso es requerido y numérico' });
    }

    const doc = await Peso.create({
      producto_id,
      peso: Number(peso),
      fecha: fecha ? new Date(fecha) : new Date()
    });

    return res.json({ message: 'Peso registrado correctamente', data: doc });
  } catch (e) {
    return res.status(500).json({ message: 'Error al registrar peso', error: e.message });
  }
}

// GET /api/pesos/:producto_id/latest
export async function latest(req, res) {
  try {
    const { producto_id } = req.params;
    const ultimo = await Peso.findOne({ producto_id }).sort({ fecha: -1 });
    return res.json(ultimo);
  } catch (e) {
    return res.status(500).json({ message: 'Error al obtener último peso', error: e.message });
  }
}

// GET /api/pesos/:producto_id/hoy
export async function pesosDelDia(req, res) {
  try {
    const { producto_id } = req.params;
    const today = DateTime.now().setZone(process.env.TZ_AMERICA || 'America/Mexico_City').toISODate();
    const { start, end } = dayRangeUTC(today);

    const pesos = await Peso.find({
      producto_id,
      fecha: { $gte: start, $lte: end }
    }).sort({ fecha: 1 });

    return res.json(pesos);
  } catch (e) {
    return res.status(500).json({ message: 'Error al obtener pesos del día', error: e.message });
  }
}

// GET /api/pesos/:producto_id?fecha=YYYY-MM-DD
export async function pesosPorFecha(req, res) {
  try {
    const { producto_id } = req.params;
    const fechaSeleccionada = req.query.fecha;
    if (!fechaSeleccionada) {
      return res.status(400).json({ message: 'Fecha no proporcionada' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaSeleccionada)) {
      return res.status(422).json({ message: 'fecha debe ser YYYY-MM-DD' });
    }

    const { start, end } = dayRangeUTC(fechaSeleccionada);
    const pesos = await Peso.find({
      producto_id,
      fecha: { $gte: start, $lte: end }
    }).sort({ fecha: 1 });

    return res.json(pesos);
  } catch (e) {
    return res.status(500).json({ message: 'Fecha inválida o error en el servidor' });
  }
}
