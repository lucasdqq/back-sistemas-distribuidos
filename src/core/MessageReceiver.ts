import * as amqp from "amqplib";
import { config } from "../config/app.config";
import { PayloadCore } from "../types/message.types";
import { WebSocketHandler } from "../websocket/WebSocketHandler";

export class MessageReceiver {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private readonly responseQueue = "backend-response-queue";
  private readonly webSocketHandler: WebSocketHandler;

  constructor(webSocketHandler: WebSocketHandler) {
    this.webSocketHandler = webSocketHandler;
  }

  async connect(): Promise<void> {
    try {
      const url = `amqps://${config.rabbitmq.username}:${config.rabbitmq.password}@${config.rabbitmq.host}:${config.rabbitmq.port}/${config.rabbitmq.virtualHost}`;

      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();

      if (this.channel) {
        await this.channel.assertQueue(this.responseQueue, { durable: true });
        console.log("✅ MessageReceiver conectado ao RabbitMQ");

        this.startListening();
      }
    } catch (error) {
      console.error("❌ Erro ao conectar MessageReceiver ao RabbitMQ:", error);
      throw error;
    }
  }

  private startListening(): void {
    if (!this.channel) {
      console.error("❌ Canal não disponível para escutar mensagens");
      return;
    }

    this.channel.consume(this.responseQueue, (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString()) as PayloadCore;
          console.log("📥 Resposta recebida do core:", content);

          // Envia para todos os clientes WebSocket
          this.webSocketHandler.broadcastMessage(JSON.stringify(content));

          // Confirma o processamento da mensagem
          if (this.channel) {
            this.channel.ack(msg);
          }
        } catch (error) {
          console.error("❌ Erro ao processar mensagem:", error);
          // Rejeita a mensagem em caso de erro
          if (this.channel) {
            this.channel.nack(msg);
          }
        }
      }
    });

    console.log("👂 MessageReceiver escutando na fila:", this.responseQueue);
  }

  async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log("🔌 MessageReceiver desconectado do RabbitMQ");
    } catch (error) {
      console.error(
        "❌ Erro ao desconectar MessageReceiver do RabbitMQ:",
        error
      );
    }
  }
}
