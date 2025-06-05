const express = require('express');
const router = express.Router();
const { consultarResultados } = require('../controllers/resultadoController');

router.get('/', consultarResultados);

module.exports = router;