const amqp = require('amqplib');
const queue = 'core.votos'; // nome da fila deve ser igual ao usado no core

async function enviarVoto(voto, grupo = "grupoX") {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: true });

  const mensagem = {
    type: "voto",
    object: grupo,
    valor: voto,
    datetime: new Date().toISOString()
  };

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(mensagem)), {
    persistent: true
  });

  console.log("✅ Voto enviado:", mensagem);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

// Enviar voto 1 ou 2 via argumento de terminal
const args = process.argv.slice(2);
const voto = parseInt(args[0]);
if (![1, 2].includes(voto)) {
  console.error("⚠️ Use: node coletor-voto.js <1|2>");
  process.exit(1);
}

enviarVoto(voto);