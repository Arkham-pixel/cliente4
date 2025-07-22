import Estado from '../models/Estado.js';
import EstadoRiesgo from '../models/EstadoRiesgo.js';

export const obtenerEstados = async (req, res) => {
  try {
    const estados = await Estado.find();
    res.json(estados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estados', detalle: error.message });
  }
};

export const obtenerEstadosRiesgo = async (req, res) => {
  try {
    const estados = await EstadoRiesgo.find();
    res.json(estados);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los estados de riesgo' });
  }
}; 