import CasoRiesgo from '../models/CasoRiesgo.js';

export const crearCaso = async (req, res) => {
  try {
    const nuevoCaso = new CasoRiesgo(req.body);
    await nuevoCaso.save();
    res.status(201).json(nuevoCaso);
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar el caso' });
  }
};

export const obtenerCasos = async (req, res) => {
  try {
    const casos = await CasoRiesgo.find();
    res.json(casos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los casos' });
  }
};