import mongoose from 'mongoose';
import secondaryConnection from '../db/secondaryConnection.js';

const CiudadSchema = new mongoose.Schema({
  codiMunicipio: String,
  descMunicipio: String,
  codiDepto: String,
  descDepto: String,
  codiPais: String,
  descPais: String,
  codiCpolado: String,
  descCpolado: String
}, { collection: 'gsk3cAppciudades' });

const Ciudad = secondaryConnection.model('Ciudad', CiudadSchema);
export default Ciudad;
