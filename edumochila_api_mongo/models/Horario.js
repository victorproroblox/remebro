import mongoose from 'mongoose';

const ClaseSchema = new mongoose.Schema(
  {
    hora: { type: String, required: true },   // "6:00 am - 7:00 am"
    materia: { type: String, required: true },
    materiales: { type: [String], default: [] },
  },
  { _id: false }
);

const HorarioSchema = new mongoose.Schema(
  {
    producto_id: { type: String, required: true, index: true },
    dia: { type: String, required: true, index: true }, // "lunes", "martes", ...
    clases: { type: [ClaseSchema], default: [] },
  },
  { collection: 'horarios' }
);

// Evita duplicados para el mismo producto/día
HorarioSchema.index({ producto_id: 1, dia: 1 }, { unique: true });

export default mongoose.model('Horario', HorarioSchema);
