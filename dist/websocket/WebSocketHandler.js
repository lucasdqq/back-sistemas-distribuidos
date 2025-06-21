"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketHandler = void 0;
const ws_1 = require("ws");
class WebSocketHandler {
    constructor(server) {
        this.sessions = new Set();
        this.wss = new ws_1.WebSocketServer({ server });
        this.setupWebSocket();
    }
    setupWebSocket() {
        this.wss.on("connection", (ws, request) => {
            console.log("🟢 Cliente WebSocket conectado");
            this.sessions.add(ws);
            ws.on("message", (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    console.log("📨 Mensagem recebida via WebSocket:", message);
                    this.broadcastMessage(data.toString());
                }
                catch (error) {
                    console.error("❌ Erro ao processar mensagem WebSocket:", error);
                }
            });
            ws.on("close", () => {
                console.log("🔴 Cliente WebSocket desconectado");
                this.sessions.delete(ws);
            });
            ws.on("error", (error) => {
                console.error("❌ Erro no WebSocket:", error);
                this.sessions.delete(ws);
            });
        });
        console.log("🚀 WebSocket Server iniciado");
    }
    broadcastMessage(message) {
        this.sessions.forEach((session) => {
            if (session.readyState === ws_1.WebSocket.OPEN) {
                try {
                    session.send(message);
                }
                catch (error) {
                    console.error("❌ Erro ao enviar mensagem via WebSocket:", error);
                    this.sessions.delete(session);
                }
            }
            else {
                this.sessions.delete(session);
            }
        });
    }
    getConnectedClientsCount() {
        return this.sessions.size;
    }
    close() {
        this.wss.close();
        console.log("🔌 WebSocket Server fechado");
    }
}
exports.WebSocketHandler = WebSocketHandler;
//# sourceMappingURL=WebSocketHandler.js.map