import Riesgo from '../models/CasoRiesgo.js';

export const crearRiesgo = async (req, res) => {
  try {
    // Buscar el número de riesgo más alto existente
    const ultimo = await Riesgo.findOne().sort({ nmroRiesgo: -1 });
    const nuevoNumero = ultimo && ultimo.nmroRiesgo ? ultimo.nmroRiesgo + 1 : 1;
    // Crear el nuevo riesgo con el número generado
    const nuevoRiesgo = new Riesgo({ ...req.body, nmroRiesgo: nuevoNumero });
    await nuevoRiesgo.save();
    res.status(201).json(nuevoRiesgo);
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar el riesgo' });
  }
};

export const obtenerRiesgos = async (req, res) => {
  try {
    const riesgos = await Riesgo.find();
    res.json(riesgos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los riesgos' });
  }
};

export const obtenerRiesgoPorId = async (req, res) => {
  try {
    const riesgo = await Riesgo.findById(req.params.id);
    if (!riesgo) return res.status(404).json({ error: 'Riesgo no encontrado' });
    res.json(riesgo);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el riesgo' });
  }
};

export const actualizarRiesgo = async (req, res) => {
  try {
    const riesgo = await Riesgo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!riesgo) return res.status(404).json({ error: 'Riesgo no encontrado' });
    res.json(riesgo);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el riesgo' });
  }
};

export const eliminarRiesgo = async (req, res) => {
  try {
    const riesgo = await Riesgo.findByIdAndDelete(req.params.id);
    if (!riesgo) return res.status(404).json({ error: 'Riesgo no encontrado' });
    res.json({ mensaje: 'Riesgo eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el riesgo' });
  }
};

export const buscarRiesgos = async (req, res) => {
  try {
    const filtros = {};
    Object.keys(req.query).forEach(key => {
      if (req.query[key]) filtros[key] = { $regex: req.query[key], $options: 'i' };
    });
    const riesgos = await Riesgo.find(filtros);
    res.json(riesgos);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar riesgos' });
  }
}; 