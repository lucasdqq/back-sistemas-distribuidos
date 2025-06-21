import { Router } from "express";
import { MessageController } from "../controllers/MessageController";
import { MessageSender } from "../core/MessageSender";

export function createVotacaoRoutes(): Router {
  const router = Router();
  const sender = new MessageSender();
  const controller = new MessageController(sender);

  // Rota de health check
  router.get("/", (req, res) => controller.healthCheck(req, res));

  // Rota para votar em um candidato
  router.post("/candidato/:id", (req, res) => controller.votar(req, res));

  return router;
}
