import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { MessageSender } from "../core/MessageSender";
import {
  Message,
  PayloadAgregadoCore,
  PayloadCore,
  VotoRequest,
} from "../types/message.types";
import { DadoAgregadoModel } from "../model/DadoAgregado.model";
import { WebSocketHandler } from "@/websocket/WebSocketHandler";

export class MessageController {
  private readonly sender: MessageSender;
  private readonly webSocketHandler: WebSocketHandler;

  constructor(sender: MessageSender, webSocketHandler: WebSocketHandler) {
    this.sender = sender;
    this.webSocketHandler = webSocketHandler;
  }

  async votar(req: Request, res: Response): Promise<void> {
    try {
      const body: VotoRequest = req.body;

      console.log("Voto recebido");

      const message: Message = {
        type: "melhor-filme-2025",
        objectIdentifier: body.objectIdentifier,
        valor: 1,
        datetime: new Date().toISOString(),
      };

      const payloadCore: PayloadCore = {
        batchId: uuidv4(),
        sourceNodeId: "node-coletor-fantasma",
        dataPoints: [message],
      };

      await this.sender.sendMessage(payloadCore);

      res.status(200).json({
        success: true,
        message: "Mensagem enviada com sucesso",
        batchId: payloadCore.batchId,
      });
    } catch (error) {
      console.error("Erro ao processar voto:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  async buscarVotos(req: Request, res: Response): Promise<void> {
    try {
      const votos = await DadoAgregadoModel.find().lean();

      res.status(200).json({
        success: true,
        dadosAgregados: votos,
      });
    } catch (e) {
      console.error("Erro ao buscar votos:", e);
      res.status(500).json({
        success: false,
        message: "Erro ao buscar dados agregados",
        error: e instanceof Error ? e.message : "Erro desconhecido",
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const body: PayloadAgregadoCore = req.body;

      console.log("Resposta recebida do no-agregadir:", JSON.stringify(body));

      this.webSocketHandler.broadcastMessage(JSON.stringify(body));
      console.log("enviou mensagem para o front");

      res.status(200).json({
        success: true,
        message: "Dados agregados enviados via websocket",
        dadosAgregados: body.dadosAgregados,
      });
    } catch (error) {
      console.error("Erro ao processar voto:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Rota de teste
  async healthCheck(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: "Backend de votação funcionando!",
      timestamp: new Date().toISOString(),
    });
  }
}
