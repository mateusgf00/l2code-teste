import { Test, TestingModule } from '@nestjs/testing';
import { PackagingController } from './packaging.controller';
import { PackagingService } from './packaging.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('Controlador de Empacotamento', () => {
  let controller: PackagingController;
  let service: PackagingService;

  const mockPackagingService = {
    processOrders: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackagingController],
      providers: [
        {
          provide: PackagingService,
          useValue: mockPackagingService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<PackagingController>(PackagingController);
    service = module.get<PackagingService>(PackagingService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('processar pedidos', () => {
    it('deve processar pedidos e retornar resultado do empacotamento', () => {
      const mockRequest = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: 'PS5',
                dimensoes: { altura: 40, largura: 10, comprimento: 25 }
              }
            ]
          }
        ]
      };

      const mockResponse = {
        pedidos: [
          {
            pedido_id: 1,
            caixas: [
              {
                caixa_id: 'Caixa 1',
                produtos: ['PS5']
              }
            ]
          }
        ]
      };

      mockPackagingService.processOrders.mockReturnValue(mockResponse);

      const result = controller.processOrders(mockRequest);

      expect(service.processOrders).toHaveBeenCalledWith(mockRequest.pedidos);
      expect(result).toEqual(mockResponse);
    });

    it('deve processar múltiplos pedidos', () => {
      const mockRequest = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: 'PS5',
                dimensoes: { altura: 40, largura: 10, comprimento: 25 }
              }
            ]
          },
          {
            pedido_id: 2,
            produtos: [
              {
                produto_id: 'Xbox',
                dimensoes: { altura: 35, largura: 15, comprimento: 30 }
              }
            ]
          }
        ]
      };

      const mockResponse = {
        pedidos: [
          {
            pedido_id: 1,
            caixas: [{ caixa_id: 'Caixa 1', produtos: ['PS5'] }]
          },
          {
            pedido_id: 2,
            caixas: [{ caixa_id: 'Caixa 2', produtos: ['Xbox'] }]
          }
        ]
      };

      mockPackagingService.processOrders.mockReturnValue(mockResponse);

      const result = controller.processOrders(mockRequest);

      expect(service.processOrders).toHaveBeenCalledWith(mockRequest.pedidos);
      expect(result).toEqual(mockResponse);
      expect(result.pedidos).toHaveLength(2);
    });
  });
});
