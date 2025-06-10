const amqp = require('amqplib');
const { processarLote } = require('./app/services/loteService');

async function startConsumer() {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();
  const queue = 'lotes';

  await channel.assertQueue(queue, { durable: true });

  console.log('👂 Aguardando mensagens da fila:', queue);
  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const dados = JSON.parse(msg.content.toString());
      console.log('📥 Lote recebido da fila:', dados);
      const sucesso = await processarLote(dados);
      if (sucesso) channel.ack(msg);
      else channel.nack(msg, false, false); // rejeita duplicata
    }
  });
}

startConsumer().catch(console.error);
