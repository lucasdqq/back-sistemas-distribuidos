declare module "amqplib" {
  export interface Connection {
    createChannel(): Promise<Channel>;
    close(): Promise<void>;
  }

  export interface Channel {
    assertQueue(queue: string, options?: any): Promise<any>;
    sendToQueue(queue: string, content: Buffer, options?: any): boolean;
    consume(
      queue: string,
      callback: (msg: Message | null) => void,
      options?: any
    ): Promise<any>;
    ack(message: Message): void;
    nack(message: Message): void;
    close(): Promise<void>;
  }

  export interface Message {
    content: Buffer;
    fields: any;
    properties: any;
  }

  export function connect(url: string): Promise<Connection>;
}
