const amqp = require('amqplib');
const chalk = require('chalk');
const ora = require('ora');

const queue = 'core.votos'; // nome da fila usado pelo core

async function enviarVoto(voto, grupo = "grupoX") {
  const spinner = ora.default(`Enviando voto ${voto}...`).start();
  try {
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

    spinner.succeed(chalk.green("✅ Voto enviado com sucesso!"));
    console.log(chalk.cyan(JSON.stringify(mensagem, null, 2)));

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    spinner.fail(chalk.red("❌ Falha ao enviar voto"));
    console.error(error.message);
    process.exit(1);
  }
}

// Enviar voto 1 ou 2 via argumento de terminal
const args = process.argv.slice(2);
const voto = parseInt(args[0]);
if (![1, 2].includes(voto)) {
  console.error(chalk.yellow("⚠️  Use: node coletor-voto-visual.js <1|2>"));
  process.exit(1);
}

enviarVoto(voto);