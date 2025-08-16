import mongoose from 'mongoose';

const PesoSchema = new mongoose.Schema({
  producto_id: { type: String, required: true, index: true },
  peso:        { type: Number, required: true },
  fecha:       { type: Date,   required: true, index: true }
}, { collection: 'pesos', timestamps: false });

// Índices útiles
PesoSchema.index({ producto_id: 1, fecha: -1 });

export default mongoose.model('Peso', PesoSchema);
