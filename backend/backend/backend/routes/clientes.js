//backend/backend/backend/routes/clientes.js
import express from 'express';
import Cliente from '../models/Cliente.js';
import mongoose from 'mongoose';
const router = express.Router();

console.log('RUTA CLIENTES CARGADA');

// GET /api/clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find({});
    console.log('Clientes encontrados:', clientes);
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

router.get('/prueba', (req, res) => {
  res.send('Funciona clientes!');
});

router.get('/raw', async (req, res) => {
  const docs = await mongoose.connection.db.collection('gsk3cAppcliente').find({}).toArray();
  res.json(docs);
});

console.log('Base de datos activa:', Cliente.db.name);

export default router;
