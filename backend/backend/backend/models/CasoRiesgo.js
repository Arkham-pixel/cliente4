import mongoose from 'mongoose';

const casoRiesgoSchema = new mongoose.Schema({
  aseguradora: String,
  direccion: String,
  ciudad: String,
  asegurado: String,
  fechaInspeccion: Date,
  creadoEn: { type: Date, default: Date.now }
});

export default mongoose.model('CasoRiesgo', casoRiesgoSchema);