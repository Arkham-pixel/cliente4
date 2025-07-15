import mongoose from 'mongoose';

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
  // ...agrega aquí los campos que realmente tiene tu colección
}, { collection: 'gsk3cAppcliente' }); // Asegúrate de poner el nombre real de la colección

const Cliente = mongoose.model('Cliente', ClienteSchema);

export default Cliente;
