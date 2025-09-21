import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    description: 'Nome de usuário',
    example: 'admin'
  })
  @IsString({ message: 'Username deve ser uma string' })
  username: string;

  @ApiProperty({ 
    description: 'Senha do usuário',
    example: 'password123'
  })
  @IsString({ message: 'Password deve ser uma string' })
  @MinLength(6, { message: 'Password deve ter pelo menos 6 caracteres' })
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({ 
    description: 'Token JWT para autenticação',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  access_token: string;

  @ApiProperty({ 
    description: 'Tipo do token',
    example: 'Bearer'
  })
  token_type: string;

  @ApiProperty({ 
    description: 'Tempo de expiração em segundos',
    example: 86400
  })
  expires_in: number;
}
