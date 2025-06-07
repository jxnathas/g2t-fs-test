# Desafio Fullstack - Gestão de Usuários
Sistema completo para cadastro e gerenciamento de usuários com diferentes níveis de permissão (Admin, Gerente, Usuário Comum), implementando autenticação JWT e controle de acesso com CASL.

## Instalação e Execução
Pré-requisitos
Node.js 16+

PostgreSQL

npm/yarn/pnpm

* Backend
```
cd backend
npm install
cp .env.example .env
# Configure as variáveis no .env
npm run migration:run
npm run start:dev
```
* Frontend
```
cd frontend
npm install
cp .env.local.example .env.local
# Configure as variáveis no .env.local
npm run dev
```

## Variáveis de Ambiente
* Backend
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=senha
DATABASE_NAME=user_management
JWT_SECRET=seuSegredoMuitoSecreto
JWT_EXPIRES_IN=1h
```
* Frontend
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Estrutura de Pastas
* Backend
```
/src
  /auth           # Lógica de autenticação (JWT)
  /users          # CRUD de usuários
  /casl           # Configuração de permissões
  /migrations     # Migrações do banco de dados
  /dto            # Data Transfer Objects
  /entities       # Entidades do banco de dados
  /filters        # Filtros globais de exceção
  /interceptors   # Interceptadores
  /tests          # Testes automatizados
```
* Frontend
```
/src
  /app
    /(auth)       # Rotas públicas (login, registro)
    /(protected)  # Rotas privadas
  /components
    /auth         # Componentes de autenticação
    /users        # Componentes de gestão de usuários
    /ui           # Componentes UI reutilizáveis
  /contexts       # Contextos React
  /hooks          # Hooks customizados
  /lib            # Configurações (API, etc.)
  /types          # Tipos TypeScript
  /utils          # Utilitários
```

## Tecnologias Utilizadas
* Backend
NestJS: Framework Node.js para construção eficiente de APIs

PostgreSQL: Banco de dados relacional

TypeORM: ORM para interação com o banco de dados

JWT: Autenticação stateless com tokens

CASL: Controle de permissões granulares

Bcrypt: Criptografia de senhas

* Frontend
Next.js: Framework React com roteamento integrado

Tailwind CSS: Estilização utilitária

React Hook Form + Zod: Validação de formulários

TanStack Query: Gerenciamento de estado e cache de API

CASL: Controle de permissões no frontend

## Testes Automatizados
 
 ```
 # Backend
cd backend
npm test

# Frontend
cd frontend
npm test
 ```

 ## Endpoints da API
Autenticação
POST /auth/login - Login de usuário

POST /auth/register - Registro de novo usuário (apenas role USER)

Usuários
GET /users - Listar usuários (Admin/Gerente)

POST /users - Criar usuário (Admin)

GET /users/:id - Detalhes do usuário

PATCH /users/:id - Atualizar usuário

DELETE /users/:id - Excluir usuário (Admin)
