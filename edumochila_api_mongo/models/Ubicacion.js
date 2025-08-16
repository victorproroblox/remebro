import mongoose from 'mongoose';

const UbicacionSchema = new mongoose.Schema({
  producto_id: { type: String, required: true, index: true },
  lat:         { type: Number, required: true },
  lng:         { type: Number, required: true },
  fecha:       { type: Date,   required: true, index: true }
}, { collection: 'ubicaciones', timestamps: false });

// Índices útiles
UbicacionSchema.index({ producto_id: 1, fecha: -1 });

export default mongoose.model('Ubicacion', UbicacionSchema);
