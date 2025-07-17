import mongoose from 'mongoose';
import secondaryConnection from '../db/secondaryConnection.js';

const EstadoSchema = new mongoose.Schema({
  codiEstado: Number,
  descEstado: String
}, { collection: 'gsk3cAppestados' });

const Estado = secondaryConnection.model('Estado', EstadoSchema);
export default Estado; 