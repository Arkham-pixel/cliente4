import mongoose from 'mongoose';

const complexSchema = new mongoose.Schema({
  numero_siniestro: String,
  codigo_workflow: String,
}, { timestamps: true });

export default mongoose.model('Complex', complexSchema);
