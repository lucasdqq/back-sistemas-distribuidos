import { WebSocket, WebSocketServer } from "ws";
import { IncomingMessage } from "http";

export class WebSocketHandler {
  private wss: WebSocketServer;
  private sessions: Set<WebSocket> = new Set();

  constructor(server: any) {
    this.wss = new WebSocketServer({ server });
    this.setupWebSocket();
  }

  private setupWebSocket(): void {
    this.wss.on("connection", (ws: WebSocket, request: IncomingMessage) => {
      console.log("Conectou no websocket");
      this.sessions.add(ws);

      ws.on("message", (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          console.log("Mensagem recebida via WebSocket:", message);

          // Retransmite para todos os clientes conectados
          this.broadcastMessage(data.toString());
        } catch (error) {
          console.error("Erro ao processar mensagem WebSocket:", error);
        }
      });

      ws.on("close", () => {
        console.log("Cliente WebSocket desconectado");
        this.sessions.delete(ws);
      });

      ws.on("error", (error) => {
        console.error("Erro no WebSocket:", error);
        this.sessions.delete(ws);
      });
    });

    console.log("WebSocket Server iniciado");
  }

  public broadcastMessage(message: string): void {
    this.sessions.forEach((session) => {
      if (session.readyState === WebSocket.OPEN) {
        try {
          session.send(message);
        } catch (error) {
          console.error("Erro ao enviar mensagem via WebSocket:", error);
          this.sessions.delete(session);
        }
      } else {
        // Remove sessões fechadas
        this.sessions.delete(session);
      }
    });
  }

  public getConnectedClientsCount(): number {
    return this.sessions.size;
  }

  public close(): void {
    this.wss.close();
    console.log("WebSocket Server fechado");
  }
}
