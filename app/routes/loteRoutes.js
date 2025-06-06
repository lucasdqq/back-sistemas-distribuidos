const express = require('express');
const router = express.Router();
const { receberLote } = require('../controllers/loteController');

router.post('/', receberLote);

module.exports = router;