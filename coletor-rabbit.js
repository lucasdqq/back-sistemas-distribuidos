const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');

async function enviarLote() {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();
  const queue = 'lotes';

  await channel.assertQueue(queue, { durable: true });

  const lote = {
    id: uuidv4(),
    dados: [
      { chave: 'A', valor: Math.floor(Math.random() * 10 + 1) },
      { chave: 'B', valor: Math.floor(Math.random() * 5 + 1) }
    ]
  };

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(lote)), { persistent: true });
  console.log('📤 Lote enviado para a fila:', lote);

  setTimeout(() => {
    channel.close();
    conn.close();
  }, 500);
}

enviarLote().catch(console.error);
