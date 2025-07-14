const express = require('express');
const router = express.Router();
const { crearSiniestro } = require('../controllers/siniestroController');

// POST /api/siniestros
router.post('/', crearSiniestro);

module.exports = router;
