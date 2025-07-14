import mongoose from 'mongoose';
import secondaryConnection from '../db/secondaryConnection.js';

const ResponsableSchema = new mongoose.Schema({
  codiRespnsble: String,
  nmbrRespnsble: String,
  email: String,
  telefono: String
}, { collection: 'gsk3cAppresponsable' });

const Responsable = secondaryConnection.model('Responsable', ResponsableSchema);
export default Responsable; 