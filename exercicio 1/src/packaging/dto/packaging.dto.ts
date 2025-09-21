import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DimensionsDto {
  @ApiProperty({ 
    description: 'Altura do produto em centímetros',
    example: 40,
    minimum: 0.1
  })
  @IsNumber({}, { message: 'Altura deve ser um número' })
  @Min(0.1, { message: 'Altura deve ser maior que 0' })
  altura: number;

  @ApiProperty({ 
    description: 'Largura do produto em centímetros',
    example: 10,
    minimum: 0.1
  })
  @IsNumber({}, { message: 'Largura deve ser um número' })
  @Min(0.1, { message: 'Largura deve ser maior que 0' })
  largura: number;

  @ApiProperty({ 
    description: 'Comprimento do produto em centímetros',
    example: 25,
    minimum: 0.1
  })
  @IsNumber({}, { message: 'Comprimento deve ser um número' })
  @Min(0.1, { message: 'Comprimento deve ser maior que 0' })
  comprimento: number;
}

export class ProductDto {
  @ApiProperty({ 
    description: 'Identificador único do produto',
    example: 'PS5'
  })
  @IsString({ message: 'ID do produto deve ser uma string' })
  produto_id: string;

  @ApiProperty({ 
    description: 'Dimensões do produto',
    type: DimensionsDto
  })
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensoes: DimensionsDto;
}

export class OrderDto {
  @ApiProperty({ 
    description: 'Identificador único do pedido',
    example: 1
  })
  @IsNumber({}, { message: 'ID do pedido deve ser um número' })
  @Min(1, { message: 'ID do pedido deve ser maior que 0' })
  pedido_id: number;

  @ApiProperty({ 
    description: 'Lista de produtos do pedido',
    type: [ProductDto]
  })
  @IsArray({ message: 'Produtos deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  produtos: ProductDto[];
}

export class PackagingRequestDto {
  @ApiProperty({ 
    description: 'Lista de pedidos para processar',
    type: [OrderDto]
  })
  @IsArray({ message: 'Pedidos deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => OrderDto)
  pedidos: OrderDto[];
}


export class PackedBoxResponseDto {
  @ApiProperty({ 
    description: 'Identificador da caixa utilizada',
    example: 'Caixa 1',
    nullable: true
  })
  caixa_id: string | null;

  @ApiProperty({ 
    description: 'Lista de produtos empacotados nesta caixa',
    example: ['PS5', 'Volante']
  })
  produtos: string[];

  @ApiProperty({ 
    description: 'Observação sobre o empacotamento',
    example: 'Produto não cabe em nenhuma caixa disponível.',
    required: false
  })
  observacao?: string;
}

export class OrderResponseDto {
  @ApiProperty({ 
    description: 'Identificador do pedido',
    example: 1
  })
  pedido_id: number;

  @ApiProperty({ 
    description: 'Lista de caixas utilizadas no pedido',
    type: [PackedBoxResponseDto]
  })
  caixas: PackedBoxResponseDto[];
}

export class PackagingResponseDto {
  @ApiProperty({ 
    description: 'Lista de pedidos processados',
    type: [OrderResponseDto]
  })
  pedidos: OrderResponseDto[];
}
