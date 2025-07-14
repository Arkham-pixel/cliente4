import Siniestro from '../models/CasoComplex.js';

export const crearSiniestro = async (req, res) => {
  try {
    const nuevoSiniestro = new Siniestro(req.body);
    await nuevoSiniestro.save();
    res.status(201).json(nuevoSiniestro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los siniestros con paginación y búsqueda
export const obtenerSiniestros = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const query = {};
    // Construir filtros dinámicamente
    Object.keys(filters).forEach((key) => {
      if (filters[key]) query[key] = { $regex: filters[key], $options: 'i' };
    });
    const siniestros = await Siniestro.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Siniestro.countDocuments(query);
    res.json({ total, page: Number(page), limit: Number(limit), siniestros });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener siniestros', error });
  }
};

// Obtener un siniestro por ID
export const obtenerSiniestroPorId = async (req, res) => {
  try {
    const siniestro = await Siniestro.findById(req.params.id);
    if (!siniestro) return res.status(404).json({ mensaje: 'No encontrado' });
    res.json(siniestro);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar siniestro', error });
  }
};

// Actualizar un siniestro por ID (todos los campos)
export const actualizarSiniestro = async (req, res) => {
  try {
    const siniestro = await Siniestro.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!siniestro) return res.status(404).json({ mensaje: 'No encontrado' });
    res.json(siniestro);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar siniestro', error });
  }
};

// Eliminar un siniestro por ID
export const eliminarSiniestro = async (req, res) => {
  try {
    const siniestro = await Siniestro.findByIdAndDelete(req.params.id);
    if (!siniestro) return res.status(404).json({ mensaje: 'No encontrado' });
    res.json({ mensaje: 'Siniestro eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar siniestro', error });
  }
};
