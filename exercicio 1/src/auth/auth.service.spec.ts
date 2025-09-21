import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('Serviço de Autenticação', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('validar usuário', () => {
    it('deve retornar dados do usuário quando credenciais são válidas', async () => {
      const result = await service.validateUser('admin', 'password123');

      expect(result).toBeDefined();
      expect(result.username).toBe('admin');
      expect(result.password).toBeUndefined();
    });

    it('deve retornar null quando credenciais são inválidas', async () => {
      const result = await service.validateUser('admin', 'wrongpassword');

      expect(result).toBeNull();
    });

    it('deve retornar null quando usuário não existe', async () => {
      const result = await service.validateUser('nonexistent', 'password123');

      expect(result).toBeNull();
    });
  });

  describe('fazer login', () => {
    it('deve retornar token de acesso e informações do token', async () => {
      const user = { id: 1, username: 'admin' };
      const mockToken = 'mock-jwt-token';

      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(user);

      expect(result).toEqual({
        access_token: mockToken,
        token_type: 'Bearer',
        expires_in: 86400,
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        username: user.username,
        sub: user.id,
      });
    });
  });

  describe('validar token', () => {
    it('deve retornar dados do usuário quando payload do token é válido', async () => {
      const payload = { sub: 1, username: 'admin' };

      const result = await service.validateToken(payload);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.username).toBe('admin');
      expect(result.password).toBeUndefined();
    });

    it('deve retornar null quando usuário não existe', async () => {
      const payload = { sub: 999, username: 'nonexistent' };

      const result = await service.validateToken(payload);

      expect(result).toBeNull();
    });
  });
});
