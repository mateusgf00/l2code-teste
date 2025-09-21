import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('L2Code Packaging API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    await app.init();


    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'password123'
      });

    authToken = loginResponse.body.access_token;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('L2Code Packaging API is running! 📦');
    });
  });

  describe('Authentication', () => {
    it('/api/auth/login (POST) - deve autenticar usuário e retornar token', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'password123'
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
          expect(res.body.token_type).toBe('Bearer');
          expect(res.body.expires_in).toBe(86400);
        });
    });

    it('/api/auth/login (POST) - deve falhar com credenciais inválidas', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'errouuu'
        })
        .expect(401);
    });
  });

  describe('Packaging', () => {
    it('/api/packaging/process (POST) - deve processar pedidos e retornar resultado do empacotamento', () => {
      const testData = {
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
          }
        ]
      };

      return request(app.getHttpServer())
        .post('/api/packaging/process')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testData)
        .expect(201)
        .expect((res) => {
          expect(res.body.pedidos).toBeDefined();
          expect(res.body.pedidos).toHaveLength(1);
          expect(res.body.pedidos[0].pedido_id).toBe(1);
          expect(res.body.pedidos[0].caixas).toBeDefined();
        });
    });

    it('/api/packaging/process (POST) - deve rejeitar requisições não autenticadas', () => {
      const testData = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: "PS5",
                dimensoes: { altura: 40, largura: 10, comprimento: 25 }
              }
            ]
          }
        ]
      };

      return request(app.getHttpServer())
        .post('/api/packaging/process')
        .send(testData)
        .expect(401);
    });

    it('/api/packaging/process (POST) - should validate input data', () => {
      const invalidData = {
        pedidos: [
          {
            pedido_id: "invalid",
            produtos: []
          }
        ]
      };

      return request(app.getHttpServer())
        .post('/api/packaging/process')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);
    });
  });
});
