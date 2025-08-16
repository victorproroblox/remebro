import mongoose from 'mongoose';

const ProductoSchema = new mongoose.Schema({
  producto_id:   { type: String, required: true, unique: true, index: true },
  user_id:       { type: Number, required: true, index: true }, // id_us del JWT
  fecha_registro:{ type: Date,   required: true, default: Date.now }
}, { collection: 'productos', timestamps: false });

// Índices útiles
ProductoSchema.index({ producto_id: 1 }, { unique: true });
ProductoSchema.index({ user_id: 1 }); // si quieres 1 por usuario, hazlo unique:true

export default mongoose.model('Producto', ProductoSchema);
