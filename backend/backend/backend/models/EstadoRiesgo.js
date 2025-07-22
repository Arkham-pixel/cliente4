import mongoose from 'mongoose';

const estadoRiesgoSchema = new mongoose.Schema({
  codiEstdo: Number,
  descEstdo: String
}, { collection: 'gsk3cAppestadosRiesgos' });

export default mongoose.model('EstadoRiesgo', estadoRiesgoSchema, 'gsk3cAppestadosRiesgos'); 