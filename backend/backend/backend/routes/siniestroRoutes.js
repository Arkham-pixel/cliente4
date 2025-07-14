import express from 'express';
import { crearSiniestro } from '../controllers/siniestroController.js';

const router = express.Router();

router.post('/', crearSiniestro);

export default router;
