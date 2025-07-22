import Riesgo from '../models/CasoRiesgo.js';

export const crearCaso = async (req, res) => {
  try {
    const nuevoCaso = new Riesgo(req.body);
    await nuevoCaso.save();
    res.status(201).json(nuevoCaso);
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar el caso' });
  }
};

export const obtenerCasos = async (req, res) => {
  try {
    const casos = await Riesgo.find();
    res.json(casos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los casos' });
  }
};

export const obtenerCasoPorId = async (req, res) => {
  try {
    const caso = await Riesgo.findById(req.params.id);
    if (!caso) return res.status(404).json({ error: 'Caso no encontrado' });
    res.json(caso);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el caso' });
  }
};

export const actualizarCaso = async (req, res) => {
  try {
    const caso = await Riesgo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!caso) return res.status(404).json({ error: 'Caso no encontrado' });
    res.json(caso);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el caso' });
  }
};

export const eliminarCaso = async (req, res) => {
  try {
    const caso = await Riesgo.findByIdAndDelete(req.params.id);
    if (!caso) return res.status(404).json({ error: 'Caso no encontrado' });
    res.json({ mensaje: 'Caso eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el caso' });
  }
};

export const buscarCasos = async (req, res) => {
  try {
    const filtros = {};
    Object.keys(req.query).forEach(key => {
      if (req.query[key]) filtros[key] = { $regex: req.query[key], $options: 'i' };
    });
    const casos = await Riesgo.find(filtros);
    res.json(casos);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar casos' });
  }
};