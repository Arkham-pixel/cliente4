import express from 'express';
import Complex from '../models/complex.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const nuevo = new Complex(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
