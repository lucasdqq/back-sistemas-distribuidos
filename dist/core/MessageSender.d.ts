import { PayloadCore } from "../types/message.types";
export declare class MessageSender {
    private connection;
    private channel;
    private readonly queue;
    constructor();
    connect(): Promise<void>;
    sendMessage(message: PayloadCore): Promise<void>;
    disconnect(): Promise<void>;
}
//# sourceMappingURL=MessageSender.d.ts.map