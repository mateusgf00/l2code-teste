import { Controller, Post, Body, UseGuards, HttpStatus } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiBody 
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PackagingService } from '../services/packaging.service';
import { 
  PackagingRequestDto, 
  PackagingResponseDto 
} from '../dto/packaging.dto';

@ApiTags('Packaging')
@Controller('api/packaging')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class PackagingController {
  constructor(private readonly packagingService: PackagingService) {}

  @Post('process')
  @ApiOperation({ 
    summary: 'Processar pedidos para empacotamento',
    description: 'Recebe uma lista de pedidos com produtos e suas dimensões, retorna o empacotamento otimizado em caixas disponíveis'
  })
  @ApiBody({ 
    type: PackagingRequestDto,
    description: 'Lista de pedidos para processar',
    examples: {
      exemplo1: {
        summary: 'Exemplo com múltiplos pedidos',
        value: {
          pedidos: [
            {
              pedido_id: 1,
              produtos: [
                {
                  produto_id: "PS5",
                  dimensoes: { altura: 40, largura: 10, comprimento: 25 }
                },
                {
                  produto_id: "Volante",
                  dimensoes: { altura: 40, largura: 30, comprimento: 30 }
                }
              ]
            },
            {
              pedido_id: 2,
              produtos: [
                {
                  produto_id: "Joystick",
                  dimensoes: { altura: 15, largura: 20, comprimento: 10 }
                }
              ]
            }
          ]
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pedidos processados com sucesso',
    type: PackagingResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Dados de entrada inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Token de autenticação inválido ou ausente' 
  })
  @ApiResponse({ 
    status: HttpStatus.INTERNAL_SERVER_ERROR, 
    description: 'Erro interno do servidor' 
  })
  processOrders(@Body() packagingRequest: PackagingRequestDto): PackagingResponseDto {
    return this.packagingService.processOrders(packagingRequest.pedidos);
  }
}
