export declare class WebSocketHandler {
    private wss;
    private sessions;
    constructor(server: any);
    private setupWebSocket;
    broadcastMessage(message: string): void;
    getConnectedClientsCount(): number;
    close(): void;
}
//# sourceMappingURL=WebSocketHandler.d.ts.map