// backend/controllers/complex.controller.js
import Complex from '../models/Complex.js';

// Crear un nuevo caso
export const crearComplex = async (req, res) => {
  try {
    const nuevo = new Complex(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los casos
export const obtenerTodos = async (req, res) => {
  try {
    const casos = await Complex.find().sort({ creado_en: -1 });
    res.json(casos);
  } catch (error) {
    console.error('Error al obtener los casos:', error);
    res.status(500).json({ error: 'Error al obtener los casos' });
  }
};

// Obtener un caso por ID
export const obtenerPorId = async (req, res) => {
  try {
    const caso = await Complex.findById(req.params.id);
    if (!caso) return res.status(404).json({ error: 'Caso no encontrado' });
    res.json(caso);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el caso' });
  }
};

// Actualizar un caso
export const actualizarComplex = async (req, res) => {
  try {
    const casoActualizado = await Complex.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!casoActualizado) return res.status(404).json({ error: 'Caso no encontrado' });
    res.json(casoActualizado);
  } catch (error) {
    console.error('Error al actualizar el caso:', error);
    res.status(500).json({ error: 'Error al actualizar el caso' });
  }
};

// Eliminar un caso
export const eliminarComplex = async (req, res) => {
  try {
    const casoEliminado = await Complex.findByIdAndDelete(req.params.id);
    if (!casoEliminado) return res.status(404).json({ error: 'Caso no encontrado' });
    res.json({ mensaje: 'Caso eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el caso:', error);
    res.status(500).json({ error: 'Error al eliminar el caso' });
  }
};
