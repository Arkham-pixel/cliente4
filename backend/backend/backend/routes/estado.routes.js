import express from 'express';
import { obtenerEstados, obtenerEstadosRiesgo } from '../controllers/estadoController.js';

const router = express.Router();

// GET /api/estados
router.get('/', obtenerEstados);
router.get('/estados-riesgos', obtenerEstadosRiesgo);

export default router; 