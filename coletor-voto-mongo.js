const amqp = require("amqplib");
const connectMongo = require("./mongo");
const Voto = require("./voto.model");

const voto = parseInt(process.argv[2], 10) || 1;

async function enviarVoto() {
  await connectMongo();

  const novoVoto = new Voto({
    type: "voto",
    object: "grupoX",
    valor: voto,
    datetime: new Date()
  });

  try {
    await novoVoto.save();
    console.log("✅ Voto salvo no MongoDB");
  } catch (err) {
    console.error("❌ Erro ao salvar no Mongo:", err);
  }

  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queue = "core.votos";
  await channel.assertQueue(queue, { durable: false });

  const mensagem = JSON.stringify(novoVoto.toObject());
  channel.sendToQueue(queue, Buffer.from(mensagem));

  console.log("✅ Voto enviado para RabbitMQ");
  await channel.close();
  await connection.close();
}

enviarVoto();