"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageReceiver = void 0;
const amqp = __importStar(require("amqplib"));
const app_config_1 = require("../config/app.config");
class MessageReceiver {
    constructor(webSocketHandler) {
        this.connection = null;
        this.channel = null;
        this.responseQueue = "backend-response-queue";
        this.webSocketHandler = webSocketHandler;
    }
    async connect() {
        try {
            const url = `amqps://${app_config_1.config.rabbitmq.username}:${app_config_1.config.rabbitmq.password}@${app_config_1.config.rabbitmq.host}:${app_config_1.config.rabbitmq.port}/${app_config_1.config.rabbitmq.virtualHost}`;
            this.connection = await amqp.connect(url);
            this.channel = await this.connection.createChannel();
            if (this.channel) {
                await this.channel.assertQueue(this.responseQueue, { durable: true });
                console.log("✅ MessageReceiver conectado ao RabbitMQ");
                this.startListening();
            }
        }
        catch (error) {
            console.error("❌ Erro ao conectar MessageReceiver ao RabbitMQ:", error);
            throw error;
        }
    }
    startListening() {
        if (!this.channel) {
            console.error("❌ Canal não disponível para escutar mensagens");
            return;
        }
        this.channel.consume(this.responseQueue, (msg) => {
            if (msg) {
                try {
                    const content = JSON.parse(msg.content.toString());
                    console.log("📥 Resposta recebida do core:", content);
                    this.webSocketHandler.broadcastMessage(JSON.stringify(content));
                    if (this.channel) {
                        this.channel.ack(msg);
                    }
                }
                catch (error) {
                    console.error("❌ Erro ao processar mensagem:", error);
                    if (this.channel) {
                        this.channel.nack(msg);
                    }
                }
            }
        });
        console.log("👂 MessageReceiver escutando na fila:", this.responseQueue);
    }
    async disconnect() {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
            console.log("🔌 MessageReceiver desconectado do RabbitMQ");
        }
        catch (error) {
            console.error("❌ Erro ao desconectar MessageReceiver do RabbitMQ:", error);
        }
    }
}
exports.MessageReceiver = MessageReceiver;
//# sourceMappingURL=MessageReceiver.js.map