const { v4: uuidv4 } = require('uuid');
const lotesRecebidos = new Set();
const resultados = {}; // exemplo: { "A": 10, "B": 5 }

function processarLote(lote) {
  if (!lote.id || !Array.isArray(lote.dados)) return false;
  if (lotesRecebidos.has(lote.id)) return false;

  lote.dados.forEach(item => {
    const { chave, valor } = item;
    resultados[chave] = (resultados[chave] || 0) + valor;
  });

  lotesRecebidos.add(lote.id);
  return true;
}

function obterResultados() {
  return resultados;
}

module.exports = { processarLote, obterResultados };