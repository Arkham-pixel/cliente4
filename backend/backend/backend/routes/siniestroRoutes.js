const express = require('express');
const { crearSiniestro } = require('../controllers/siniestroController');

const router = express.Router();

router.post('/', crearSiniestro);

module.exports = router;
