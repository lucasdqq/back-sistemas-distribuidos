export interface Message {
  type: string;
  objectIdentifier: string;
  valor: number;
  datetime: string; // ISO string format
}

export interface PayloadCore {
  batchId: string;
  sourceNodeId: string;
  dataPoints: Message[];
}

export interface VotoRequest {
  objectIdentifier: string;
}

export interface DadosAgregados {
  dadosAgregados: DadoAgregado[];
}

export interface DadoAgregado {
  type: string;
  lista: Item[];
}

export interface Item {
  objectIdentifier: string;
  media: number;
  mediana: number;
  somatorio: number;
  contagem: number;
  porcentagem: number;
}
