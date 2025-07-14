import mongoose from 'mongoose';
import secondaryConnection from '../db/secondaryConnection.js';

const FuncionarioAseguradoraSchema = new mongoose.Schema({
  codiAsgrdra: String,
  nmbrFuncionario: String,
  email: String,
  telefono: String
}, { collection: 'gsk3cAppcontactoscli' });

const FuncionarioAseguradora = secondaryConnection.model('FuncionarioAseguradora', FuncionarioAseguradoraSchema);
export default FuncionarioAseguradora; 