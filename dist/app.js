"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = require("http");
const app_config_1 = require("./config/app.config");
const votacao_routes_1 = require("./routes/votacao.routes");
const WebSocketHandler_1 = require("./websocket/WebSocketHandler");
const MessageReceiver_1 = require("./core/MessageReceiver");
const MessageSender_1 = require("./core/MessageSender");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.server = (0, http_1.createServer)(this.app);
        this.messageSender = new MessageSender_1.MessageSender();
        this.webSocketHandler = new WebSocketHandler_1.WebSocketHandler(this.server);
        this.messageReceiver = new MessageReceiver_1.MessageReceiver(this.webSocketHandler);
        this.setupMiddleware();
        this.setupRoutes();
    }
    setupMiddleware() {
        this.app.use((0, cors_1.default)({
            origin: ["http://localhost:8080", "http://localhost:8081"],
            credentials: true,
        }));
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
            next();
        });
    }
    setupRoutes() {
        this.app.use("/api/votar", (0, votacao_routes_1.createVotacaoRoutes)());
        this.app.get("/", (req, res) => {
            res.json({
                message: "Sistema de Votação Distribuído",
                version: "1.0.0",
                timestamp: new Date().toISOString(),
            });
        });
        this.app.use((err, req, res, next) => {
            console.error("❌ Erro na aplicação:", err);
            res.status(500).json({
                success: false,
                message: "Erro interno do servidor",
                error: process.env.NODE_ENV === "development"
                    ? err.message
                    : "Erro interno",
            });
        });
    }
    async start() {
        try {
            await this.messageSender.connect();
            await this.messageReceiver.connect();
            this.server.listen(app_config_1.config.server.port, () => {
                console.log(`🚀 Servidor rodando na porta ${app_config_1.config.server.port}`);
                console.log(`📡 WebSocket disponível em ws://localhost:${app_config_1.config.server.port}`);
                console.log(`🌐 API disponível em http://localhost:${app_config_1.config.server.port}`);
            });
            process.on("SIGINT", async () => {
                console.log("\n🛑 Recebido SIGINT, encerrando aplicação...");
                await this.shutdown();
            });
            process.on("SIGTERM", async () => {
                console.log("\n🛑 Recebido SIGTERM, encerrando aplicação...");
                await this.shutdown();
            });
        }
        catch (error) {
            console.error("❌ Erro ao iniciar aplicação:", error);
            process.exit(1);
        }
    }
    async shutdown() {
        try {
            await this.messageSender.disconnect();
            await this.messageReceiver.disconnect();
            this.webSocketHandler.close();
            this.server.close(() => {
                console.log("✅ Aplicação encerrada com sucesso");
                process.exit(0);
            });
        }
        catch (error) {
            console.error("❌ Erro ao encerrar aplicação:", error);
            process.exit(1);
        }
    }
}
const app = new App();
app.start().catch((error) => {
    console.error("❌ Falha ao iniciar aplicação:", error);
    process.exit(1);
});
//# sourceMappingURL=app.js.map