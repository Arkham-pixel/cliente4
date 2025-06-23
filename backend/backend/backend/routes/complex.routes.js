import express from 'express';
import {
  crearComplex,
  obtenerTodos,
  obtenerPorId,
  actualizarComplex,
  eliminarComplex,
} from '../controllers/complex.controller.js';

const router = express.Router();

router.post('/', crearComplex);
router.get('/', obtenerTodos);
router.get('/:id', obtenerPorId);
router.put('/:id', actualizarComplex);
router.delete('/:id', eliminarComplex);

export default router;
