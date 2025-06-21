import * as amqp from "amqplib";
import { AppConfig } from "../config/app.config";
import { PayloadCore } from "../types/message.types";

export class MessageSender {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private readonly queue: string;

  constructor() {
    this.queue = AppConfig.core.queue;
  }

  async connect(): Promise<void> {
    try {
      const url = `amqps://${AppConfig.rabbitmq.username}:${AppConfig.rabbitmq.password}@${AppConfig.rabbitmq.host}:${AppConfig.rabbitmq.port}/${AppConfig.rabbitmq.virtualHost}`;

      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();

      await this.channel.assertQueue(this.queue, { durable: true });
      console.log("Conectado ao RabbitMQ");
    } catch (error) {
      console.error("Erro ao conectar ao RabbitMQ:", error);
      throw error;
    }
  }

  async sendMessage(message: PayloadCore): Promise<void> {
    try {
      if (!this.channel) {
        await this.connect();
      }

      const messageBuffer = Buffer.from(JSON.stringify(message));

      this.channel!.sendToQueue(this.queue, messageBuffer);
      console.log("Mensagem enviada com sucesso para o no-agregador");
      console.log(message);
    } catch (error) {
      console.error("Falha ao enviar mensagem:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log("Desconectado do RabbitMQ");
    } catch (error) {
      console.error("Erro ao desconectar do RabbitMQ:", error);
    }
  }
}
