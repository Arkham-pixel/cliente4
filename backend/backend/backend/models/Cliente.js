//backend/backend/backend/models/Cliente.js
import mongoose from 'mongoose';
import secondaryConnection from '../db/secondaryConnection.js';

const ClienteSchema = new mongoose.Schema({
  correo: String,
  codiAsgrdra: String,
  rzonSocial: String,
  teleFijo: String,
  teleCellar: String,
  direCliente: String,
  pais: String,
  codiPais: String,
  codiDepto: String,
  codiMpio: String,
  codiPoblado: String,
  codiEstdo: Number,
  descIva: Number,
  reteIva: Number,
  reteFuente: Number,
  reteIca: Number,
}, { collection: 'gsk3cAppcliente' });

//const Cliente = mongoose.model('Cliente', ClienteSchema, 'gsk3cAppcliente');m // Forzar nombre de colección
const Cliente = secondaryConnection.model('Cliente', ClienteSchema);

export default Cliente;
