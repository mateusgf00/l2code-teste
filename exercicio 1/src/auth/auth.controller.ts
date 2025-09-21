import { Controller, Post, Body, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody 
} from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto, AuthResponseDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ 
    summary: 'Fazer login na API',
    description: 'Autentica o usuário e retorna um token JWT para acesso aos endpoints protegidos'
  })
  @ApiBody({ 
    type: LoginDto,
    description: 'Credenciais de login',
    examples: {
      admin: {
        summary: 'Login como administrador',
        value: {
          username: 'admin',
          password: 'password123'
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login realizado com sucesso',
    type: AuthResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Credenciais inválidas' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Dados de entrada inválidos' 
  })
  async login(@Request() req, @Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(req.user);
  }
}
