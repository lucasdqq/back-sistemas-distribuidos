import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from "http";
import { AppConfig } from "./config/app.config";
import { createVotacaoRoutes } from "./routes/votacao.routes";
import { WebSocketHandler } from "./websocket/WebSocketHandler";
import { MessageReceiver } from "./core/MessageReceiver";
import { MessageSender } from "./core/MessageSender";

class App {
  private app: express.Application;
  private server: any;
  private webSocketHandler: WebSocketHandler;
  private messageReceiver: MessageReceiver;
  private messageSender: MessageSender;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.messageSender = new MessageSender();
    this.webSocketHandler = new WebSocketHandler(this.server);
    this.messageReceiver = new MessageReceiver(this.webSocketHandler);

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(
      cors({
        origin: ["http://localhost:8080", "http://localhost:8081"],
        credentials: true,
      })
    );

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // Middleware de logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  private setupRoutes(): void {
    this.app.use("/api/votar", createVotacaoRoutes());

    // Rota de teste geral
    this.app.get("/", (req, res) => {
      res.json({
        message: "Sistema de Votação Distribuído",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
      });
    });
  }

  async start(): Promise<void> {
    try {
      // Conecta no RabbitMQ
      await this.messageSender.connect();
      await this.messageReceiver.connect();

      this.server.listen(AppConfig.server.port, () => {
        console.log(`Servidor rodando na porta ${AppConfig.server.port}`);
        console.log(
          `WebSocket disponível em ws://localhost:${AppConfig.server.port}`
        );
        console.log(
          `API disponível em http://localhost:${AppConfig.server.port}`
        );
      });

      process.on("SIGINT", async () => {
        console.log("\nencerrando backend...");
        await this.shutdown();
      });
    } catch (error) {
      console.error("Erro ao iniciar aplicação:", error);
      process.exit(1);
    }
  }

  private async shutdown(): Promise<void> {
    try {
      await this.messageSender.disconnect();
      await this.messageReceiver.disconnect();
      this.webSocketHandler.close();
      this.server.close(() => {
        console.log("backend encerrado");
        process.exit(0);
      });
    } catch (error) {
      console.error("Erro ao encerrar aplicação:", error);
      process.exit(1);
    }
  }
}

const app = new App();
app.start().catch((error) => {
  console.error("Falha ao iniciar aplicação:", error);
  process.exit(1);
});
