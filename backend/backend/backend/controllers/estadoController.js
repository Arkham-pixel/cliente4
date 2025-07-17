import Estado from '../models/Estado.js';

export const obtenerEstados = async (req, res) => {
  try {
    const estados = await Estado.find();
    res.json(estados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estados', detalle: error.message });
  }
}; 