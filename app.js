const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Para permitir acesso do front-end Vue.js
  }
});

app.use(cors());
app.use(bodyParser.json());

io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado via WebSocket');

  socket.on('voto', (data) => {
    console.log('📨 Voto recebido via WebSocket:', data);
    io.emit('voto-recebido', data); // retransmite para todos os clientes
  });

  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado');
  });
});

// Rota de teste
app.get('/', (req, res) => {
  res.send('Backend de votação com WebSocket funcionando!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor ouvindo na porta ${PORT}`);
});