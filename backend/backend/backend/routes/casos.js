import express from 'express';
import { crearCaso, obtenerCasos } from '../controllers/casoController.js';

const router = express.Router();

router.post('/', crearCaso);
router.get('/', obtenerCasos);

export default router;