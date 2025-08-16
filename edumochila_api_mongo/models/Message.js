import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  producto_id: { type: String, required: true, index: true },
  message:     { type: String, required: true },
  fecha:       { type: Date,   required: true, index: true } // ISODate
}, { collection: 'messages', timestamps: false });

MessageSchema.index({ producto_id: 1, fecha: 1 });

export default mongoose.model('Message', MessageSchema);
