// routes/clientes.js
const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente'); // Ajusta la ruta según tu estructura

// GET /api/clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

module.exports = router;
