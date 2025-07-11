export interface Message {
    type: string;
    objectIdentifier: string;
    valor: number;
    datetime: string;
}
export interface PayloadCore {
    batchId: string;
    sourceNodeId: string;
    dataPoints: Message[];
}
export interface VotoRequest {
    type: string;
    objectIdentifier: string;
    valor: number;
    datetime: string;
}
//# sourceMappingURL=message.types.d.ts.map