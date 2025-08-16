import mongoose from 'mongoose';

const ProductoSchema = new mongoose.Schema({
  producto_id:    { type: String, required: true },   // <- sin index/unique aquí
  user_id:        { type: Number, required: true },   // <- sin index aquí
  fecha_registro: { type: Date,   default: Date.now }
}, { collection: 'productos', timestamps: false, versionKey: false });

// índices (uno por línea, sin duplicar)
ProductoSchema.index({ producto_id: 1 }, { unique: true });
// Si quieres permitir solo 1 producto por usuario, pon unique:true aquí
ProductoSchema.index({ user_id: 1 /*, unique: true */ });

export default mongoose.model('Producto', ProductoSchema);
