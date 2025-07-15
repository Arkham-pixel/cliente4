// routes/clientes.js
import express from 'express';
import Cliente from '../models/Cliente.js';
const router = express.Router();

// GET /api/clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

export default router;
