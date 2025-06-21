"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVotacaoRoutes = createVotacaoRoutes;
const express_1 = require("express");
const MessageController_1 = require("../controllers/MessageController");
const MessageSender_1 = require("../core/MessageSender");
function createVotacaoRoutes() {
    const router = (0, express_1.Router)();
    const sender = new MessageSender_1.MessageSender();
    const controller = new MessageController_1.MessageController(sender);
    router.get("/", (req, res) => controller.healthCheck(req, res));
    router.post("/candidato/:id", (req, res) => controller.votar(req, res));
    return router;
}
//# sourceMappingURL=votacao.routes.js.map