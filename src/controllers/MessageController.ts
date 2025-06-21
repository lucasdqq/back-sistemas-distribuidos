import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { MessageSender } from "../core/MessageSender";
import { Message, PayloadCore, VotoRequest } from "../types/message.types";

export class MessageController {
  private readonly sender: MessageSender;

  constructor(sender: MessageSender) {
    this.sender = sender;
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

  // Rota de teste
  async healthCheck(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: "Backend de votação funcionando!",
      timestamp: new Date().toISOString(),
    });
  }
}
