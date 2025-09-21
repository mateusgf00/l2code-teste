export interface Box {
  id: string;
  name: string;
  dimensions: {
    altura: number;
    largura: number;
    comprimento: number;
  };
  volume: number;
}

export interface Product {
  produto_id: string;
  dimensoes: {
    altura: number;
    largura: number;
    comprimento: number;
  };
  volume: number;
}

export interface PackedBox {
  caixa_id: string | null;
  produtos: string[];
  observacao?: string;
}

export interface PackingResult {
  pedido_id: number;
  caixas: PackedBox[];
}
