import { Router } from "express";
import { VotacaoController } from "../controllers/VotacaoController";
import { MessageSender } from "../core/MessageSender";
import { WebSocketHandler } from "@/websocket/WebSocketHandler";

export function createVotacaoRoutes(
  webSocketHandler: WebSocketHandler
): Router {
  const router = Router();
  const sender = new MessageSender();
  const controller = new VotacaoController(sender, webSocketHandler);

  router.get("/", (req, res) => controller.healthCheck(req, res));

  router.post("/candidato", (req, res) => controller.votar(req, res));
  router.get("/votos", (req, res) => controller.buscarVotos(req, res));

  router.post("/update-from-no-agregador", (req, res) =>
    controller.update(req, res)
  );

  return router;
}
