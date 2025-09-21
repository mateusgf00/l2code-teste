# L2Code Packaging API

API para automatizar o processo de embalagem de pedidos da loja de jogos do Seu Manoel.

## Como Executar

### Com Docker

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd l2code-teste
```

2. Execute com Docker Compose:
```bash
docker compose up --build
```

A API estará disponível em `http://localhost:3000`

### Sem Docker

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd l2code-teste
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Execute a aplicação:
```bash
npm run start:dev
```

## Documentação

Acesse a documentação da API em: `http://localhost:3000/api/docs`

## Autenticação

Para testar a API, use as credenciais:
- **Admin**: `admin` / `password123`
