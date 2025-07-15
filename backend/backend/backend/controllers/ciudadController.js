import Ciudad from '../models/Ciudad.js';

export const obtenerCiudades = async (req, res) => {
  try {
    const ciudades = await Ciudad.find();
    res.json(ciudades);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener ciudades', error: error.message });
  }
};
