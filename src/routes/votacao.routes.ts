import { Router } from "express";
import { MessageController } from "../controllers/MessageController";
import { MessageSender } from "../core/MessageSender";

export function createVotacaoRoutes(): Router {
  const router = Router();
  const sender = new MessageSender();
  const controller = new MessageController(sender);

  router.get("/", (req, res) => controller.healthCheck(req, res));

  router.post("/candidato/:id", (req, res) => controller.votar(req, res));
  router.get("/votos", (req, res) => controller.buscarVotos(req, res));

  return router;
}
