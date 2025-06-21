import { WebSocketHandler } from "../websocket/WebSocketHandler";
export declare class MessageReceiver {
    private connection;
    private channel;
    private readonly responseQueue;
    private readonly webSocketHandler;
    constructor(webSocketHandler: WebSocketHandler);
    connect(): Promise<void>;
    private startListening;
    disconnect(): Promise<void>;
}
//# sourceMappingURL=MessageReceiver.d.ts.map