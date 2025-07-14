import express from 'express';
import {
  crearSiniestro,
  obtenerSiniestros,
  obtenerSiniestroPorId,
  actualizarSiniestro,
  eliminarSiniestro
} from '../controllers/siniestroController.js';

const router = express.Router();

router.post('/', crearSiniestro);
router.get('/', obtenerSiniestros);
router.get('/:id', obtenerSiniestroPorId);
router.put('/:id', actualizarSiniestro);
router.delete('/:id', eliminarSiniestro);

export default router;
