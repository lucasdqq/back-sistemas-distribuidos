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

async function start() {
  await connectMongo();
  const connection = await amqp.connect("amqp://rabbitmq:5672");
  const channel = await connection.createChannel();
  const queue = "lotes_de_dados";

  await channel.assertQueue(queue, { durable: false });
  console.log("🎧 Aguardando mensagens na fila:", queue);

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const dados = JSON.parse(msg.content.toString());
      console.log("📥 Mensagem recebida:", dados);
      try {
        await new Voto(dados).save();
        console.log("✅ Salvo no MongoDB");
      } catch (err) {
        console.error("❌ Erro ao salvar no Mongo:", err.message);
      }
      channel.ack(msg);
    }
  });
}
start();