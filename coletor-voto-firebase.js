const amqp = require('amqplib');
const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = require('./firebase-config.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const queue = 'core.votos';

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

  // envio rabbit
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(mensagem)), {
    persistent: true
  });
  console.log("✅ Voto enviado para fila RabbitMQ");

  // salva copia no banco
  await db.collection('votos').add(mensagem);
  console.log("✅ Voto salvo no Firebase Firestore");

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

const args = process.argv.slice(2);
const voto = parseInt(args[0]);
if (![1, 2].includes(voto)) {
  console.error("⚠️  Use: node coletor-voto-firebase.js <1|2>");
  process.exit(1);
}

enviarVoto(voto);