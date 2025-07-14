import mongoose from 'mongoose';
import secondaryConnection from '../db/secondaryConnection.js';

const FuncionarioAseguradoraSchema = new mongoose.Schema({
  id: Number,
  codiAsgrdra: String,
  nmbrContcto: String,
  email: String,
  teleCellar: String
}, { collection: 'gsk3cAppcontactoscli' });

const FuncionarioAseguradora = secondaryConnection.model('FuncionarioAseguradora', FuncionarioAseguradoraSchema);
export default FuncionarioAseguradora; 