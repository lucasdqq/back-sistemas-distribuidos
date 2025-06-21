"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const uuid_1 = require("uuid");
class MessageController {
    constructor(sender) {
        this.sender = sender;
    }
    async votar(req, res) {
        try {
            const idCandidato = req.params.id;
            const body = req.body;
            console.log("🗳️ Voto recebido para candidato:", idCandidato);
            const message = {
                type: body.type,
                objectIdentifier: idCandidato,
                valor: body.valor,
                datetime: body.datetime || new Date().toISOString(),
            };
            const payloadCore = {
                batchId: (0, uuid_1.v4)(),
                sourceNodeId: "node-coletor-fantasma",
                dataPoints: [message],
            };
            await this.sender.sendMessage(payloadCore);
            res.status(200).json({
                success: true,
                message: "Mensagem enviada com sucesso",
                batchId: payloadCore.batchId,
            });
        }
        catch (error) {
            console.error("❌ Erro ao processar voto:", error);
            res.status(500).json({
                success: false,
                message: "Erro interno do servidor",
                error: error instanceof Error ? error.message : "Erro desconhecido",
            });
        }
    }
    async healthCheck(req, res) {
        res.status(200).json({
            success: true,
            message: "Backend de votação funcionando!",
            timestamp: new Date().toISOString(),
        });
    }
}
exports.MessageController = MessageController;
//# sourceMappingURL=MessageController.js.map