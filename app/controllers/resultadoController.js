const { obterResultados } = require('../services/loteService');

const consultarResultados = (req, res) => {
  const resultados = obterResultados();
  res.json(resultados);
};

module.exports = { consultarResultados };