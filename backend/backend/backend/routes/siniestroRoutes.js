import express from 'express';
import {
  crearSiniestro,
  obtenerSiniestros,
  obtenerSiniestroPorId,
  actualizarSiniestro,
  eliminarSiniestro,
  obtenerSiniestrosConResponsables,
  probarJoin,
  verificarFuncionarios
} from '../controllers/siniestroController.js';

const router = express.Router();

router.post('/', crearSiniestro);
router.get('/', obtenerSiniestros);
router.get('/con-responsables', obtenerSiniestrosConResponsables);
router.get('/probar-join', probarJoin);
router.get('/verificar-funcionarios', verificarFuncionarios);
router.get('/:id', obtenerSiniestroPorId);
router.put('/:id', actualizarSiniestro);
router.delete('/:id', eliminarSiniestro);

export default router;
