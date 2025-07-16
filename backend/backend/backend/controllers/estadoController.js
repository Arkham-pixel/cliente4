import mongoose from 'mongoose';
import secondaryConnection from '../db/secondaryConnection.js';

const EstadoSchema = new mongoose.Schema({
  codiEstado: Number,
  descEstado: String
}, { collection: 'gsk3cAppestados' });

const Estado = secondaryConnection.model('Estado', EstadoSchema);

export const obtenerEstados = async (req, res) => {
  try {
    const estados = await Estado.find();
    res.json(estados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estados', detalle: error.message });
  }
}; 