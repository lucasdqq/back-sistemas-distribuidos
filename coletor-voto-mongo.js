const amqp = require("amqplib");
const connectMongo = require("./mongo");
const mongoose = require("mongoose");

const votoSchema = new mongoose.Schema({
  type: String,
  objectIdentifier: String,
  valor: Number,
  datetime: Number
});

const Voto = mongoose.model("Voto", votoSchema);

const votoValor = parseInt(process.argv[2], 10) || 1;

async function enviarVoto() {
  await connectMongo();

  const votoData = {
    type: "voto",
    objectIdentifier: "grupoX",
    valor: votoValor,
    datetime: Date.now()
  };

  const novoVoto = new Voto(votoData);
  await novoVoto.save();

  const connection = await amqp.connect("amqp://rabbitmq:5672");
  const channel = await connection.createChannel();
  const queue = "lotes_de_dados";
  await channel.assertQueue(queue, { durable: false });

  const mensagem = JSON.stringify(votoData);
  channel.sendToQueue(queue, Buffer.from(mensagem));

  console.log("✅ Voto enviado para fila:", queue);

  await channel.close();
  await connection.close();
  await mongoose.disconnect();
  process.exit(0);  
}
enviarVoto();