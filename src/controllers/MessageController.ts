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
      const idCandidato = req.params.id;
      const body: VotoRequest = req.body;

      console.log("🗳️ Voto recebido para candidato:", idCandidato);

      // Cria a mensagem no formato esperado
      const message: Message = {
        type: body.type,
        objectIdentifier: idCandidato,
        valor: body.valor,
        datetime: body.datetime || new Date().toISOString(),
      };

      // Cria o payload no formato do core
      const payloadCore: PayloadCore = {
        batchId: uuidv4(),
        sourceNodeId: "node-coletor-fantasma",
        dataPoints: [message],
      };

      // Envia a mensagem
      await this.sender.sendMessage(payloadCore);

      res.status(200).json({
        success: true,
        message: "Mensagem enviada com sucesso",
        batchId: payloadCore.batchId,
      });
    } catch (error) {
      console.error("❌ Erro ao processar voto:", error);
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
