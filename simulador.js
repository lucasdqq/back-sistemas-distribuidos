const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const url = 'http://localhost:3000/lotes';

async function enviarLoteSimulado() {
  const lote = {
    id: uuidv4(),
    dados: [
      { chave: 'A', valor: Math.floor(Math.random() * 10 + 1) },
      { chave: 'B', valor: Math.floor(Math.random() * 5 + 1) }
    ]
  };

  try {
    const response = await axios.post(url, lote);
    console.log('Resposta do servidor:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Erro:', error.response.status, error.response.data);
    } else {
      console.log('Erro ao conectar com o servidor:', error.message);
    }
  }
}

enviarLoteSimulado();