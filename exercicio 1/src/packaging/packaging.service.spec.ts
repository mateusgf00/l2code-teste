import { Test, TestingModule } from '@nestjs/testing';
import { PackagingService } from './packaging.service';

describe('Serviço de Empacotamento', () => {
  let service: PackagingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackagingService],
    }).compile();

    service = module.get<PackagingService>(PackagingService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('processar pedidos', () => {
    it('deve empacotar produtos que cabem nas caixas disponíveis', () => {
      const orders = [
        {
          pedido_id: 1,
          produtos: [
            {
              produto_id: 'Produto1',
              dimensoes: { altura: 10, largura: 10, comprimento: 10 }
            }
          ]
        }
      ];

      const result = service.processOrders(orders);

      expect(result.pedidos).toHaveLength(1);
      expect(result.pedidos[0].pedido_id).toBe(1);
      expect(result.pedidos[0].caixas).toHaveLength(1);
      expect(result.pedidos[0].caixas[0].caixa_id).toBe('Caixa 1');
      expect(result.pedidos[0].caixas[0].produtos).toContain('Produto1');
    });

    it('deve lidar com produtos que não cabem em nenhuma caixa', () => {
      const orders = [
        {
          pedido_id: 1,
          produtos: [
            {
              produto_id: 'ProdutoGigante',
              dimensoes: { altura: 200, largura: 200, comprimento: 200 }
            }
          ]
        }
      ];

      const result = service.processOrders(orders);

      expect(result.pedidos).toHaveLength(1);
      expect(result.pedidos[0].caixas).toHaveLength(1);
      expect(result.pedidos[0].caixas[0].caixa_id).toBeNull();
      expect(result.pedidos[0].caixas[0].observacao).toBe('Produto não cabe em nenhuma caixa disponível.');
    });

    it('deve otimizar o empacotamento usando múltiplos produtos em uma caixa', () => {
      const orders = [
        {
          pedido_id: 1,
          produtos: [
            {
              produto_id: 'Produto1',
              dimensoes: { altura: 5, largura: 5, comprimento: 5 }
            },
            {
              produto_id: 'Produto2',
              dimensoes: { altura: 5, largura: 5, comprimento: 5 }
            }
          ]
        }
      ];

      const result = service.processOrders(orders);

      expect(result.pedidos[0].caixas).toHaveLength(1);
      expect(result.pedidos[0].caixas[0].produtos).toHaveLength(2);
      expect(result.pedidos[0].caixas[0].produtos).toContain('Produto1');
      expect(result.pedidos[0].caixas[0].produtos).toContain('Produto2');
    });

    it('deve usar múltiplas caixas quando produtos não cabem em uma', () => {
      const orders = [
        {
          pedido_id: 1,
          produtos: [
            {
              produto_id: 'Monitor',
              dimensoes: { altura: 50, largura: 60, comprimento: 20 }
            },
            {
              produto_id: 'Webcam',
              dimensoes: { altura: 7, largura: 10, comprimento: 5 }
            }
          ]
        }
      ];

      const result = service.processOrders(orders);

      expect(result.pedidos[0].caixas.length).toBeGreaterThanOrEqual(1);
      
      const allProducts = result.pedidos[0].caixas.flatMap(caixa => caixa.produtos);
      expect(allProducts).toContain('Monitor');
      expect(allProducts).toContain('Webcam');
    });

    it('deve processar múltiplos pedidos', () => {
      const orders = [
        {
          pedido_id: 1,
          produtos: [
            {
              produto_id: 'Produto1',
              dimensoes: { altura: 10, largura: 10, comprimento: 10 }
            }
          ]
        },
        {
          pedido_id: 2,
          produtos: [
            {
              produto_id: 'Produto2',
              dimensoes: { altura: 15, largura: 15, comprimento: 15 }
            }
          ]
        }
      ];

      const result = service.processOrders(orders);

      expect(result.pedidos).toHaveLength(2);
      expect(result.pedidos[0].pedido_id).toBe(1);
      expect(result.pedidos[1].pedido_id).toBe(2);
    });

    it('deve lidar com lista de produtos vazia', () => {
      const orders = [
        {
          pedido_id: 1,
          produtos: []
        }
      ];

      const result = service.processOrders(orders);

      expect(result.pedidos).toHaveLength(1);
      expect(result.pedidos[0].caixas).toHaveLength(0);
    });
  });
});
