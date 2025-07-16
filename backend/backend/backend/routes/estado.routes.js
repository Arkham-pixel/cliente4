import express from 'express';
import { obtenerEstados } from '../controllers/estadoController.js';

const router = express.Router();

// GET /api/estados
router.get('/', obtenerEstados);

export default router; 