import { Request, Response } from "express";
import { MessageSender } from "../core/MessageSender";
export declare class MessageController {
    private readonly sender;
    constructor(sender: MessageSender);
    votar(req: Request, res: Response): Promise<void>;
    healthCheck(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=MessageController.d.ts.map