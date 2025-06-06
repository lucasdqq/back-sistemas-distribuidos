const { processarLote } = require('../services/loteService');

const receberLote = (req, res) => {
  try {
    const dados = req.body;
    const sucesso = processarLote(dados);
    if (sucesso) {
      res.status(200).json({ mensagem: 'Lote recebido com sucesso' });
    } else {
      res.status(409).json({ mensagem: 'Lote duplicado ou inválido' });
    }
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao processar lote' });
  }
};

module.exports = { receberLote };