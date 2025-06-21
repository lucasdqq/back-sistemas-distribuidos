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
exports.MessageSender = void 0;
const amqp = __importStar(require("amqplib"));
const app_config_1 = require("../config/app.config");
class MessageSender {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.queue = app_config_1.config.core.queue;
    }
    async connect() {
        try {
            const url = `amqps://${app_config_1.config.rabbitmq.username}:${app_config_1.config.rabbitmq.password}@${app_config_1.config.rabbitmq.host}:${app_config_1.config.rabbitmq.port}/${app_config_1.config.rabbitmq.virtualHost}`;
            this.connection = await amqp.connect(url);
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue(this.queue, { durable: true });
            console.log("✅ Conectado ao RabbitMQ");
        }
        catch (error) {
            console.error("❌ Erro ao conectar ao RabbitMQ:", error);
            throw error;
        }
    }
    async sendMessage(message) {
        try {
            if (!this.channel) {
                await this.connect();
            }
            const messageBuffer = Buffer.from(JSON.stringify(message));
            this.channel.sendToQueue(this.queue, messageBuffer);
            console.log("📤 Mensagem enviada com sucesso");
        }
        catch (error) {
            console.error("❌ Falha ao enviar mensagem:", error);
            throw error;
        }
    }
    async disconnect() {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
            console.log("🔌 Desconectado do RabbitMQ");
        }
        catch (error) {
            console.error("❌ Erro ao desconectar do RabbitMQ:", error);
        }
    }
}
exports.MessageSender = MessageSender;
//# sourceMappingURL=MessageSender.js.map