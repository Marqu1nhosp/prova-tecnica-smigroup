# Latinhas LLC - Sistema de Gestão de Demandas
Projeto desenvolvido como prova técnica da SMI Group.

Sistema completo de gestão de demandas de produção desenvolvido como projeto de portfólio. A aplicação permite gerenciar demandas de produção com seus respectivos itens, incluindo planejamento, acompanhamento e controle de status.

## 📋 Descrição do Projeto

O **Latinhas LLC** é uma aplicação full-stack que oferece uma solução para gestão de demandas de produção industrial. O sistema permite:

- **Criar e gerenciar demandas** com informações de SKU, datas, quantidades planejadas e status
- **Gerenciar itens** que compõem cada demanda (relacionamento 1:N)
- **Acompanhar o progresso** através de status (PLANEJAMENTO, EM_ANDAMENTO, CONCLUÍDO)
- **Interface moderna e responsiva** para visualização e edição de dados

A aplicação é composta por uma **API REST** desenvolvida com Fastify e TypeScript, e um **front-end** desenvolvido com React, TypeScript e Vite.

## 🏗️ Arquitetura

### Estrutura do Projeto

```
prova-tecnica-smigroup/
│
├── latinhas-llc-api/          # Backend (API REST)
│   ├── src/
│   │   ├── lib/
│   │   │   └── prisma.ts      # Cliente Prisma (ORM)
│   │   ├── routes/            # Rotas da API
│   │   │   ├── create-demand.ts
│   │   │   ├── get-demands.ts
│   │   │   ├── get-demand-id.ts
│   │   │   ├── edit-demandt.ts
│   │   │   ├── delete-demand.ts
│   │   │   ├── create-item.ts
│   │   │   ├── edit-item.ts
│   │   │   ├── delete-item.ts
│   │   │   └── ping.ts
│   │   ├── utils/
│   │   │   └── generate-sku.ts
│   │   └── server.ts          # Servidor Fastify
│   ├── prisma/
│   │   ├── schema.prisma      # Schema do banco de dados
│   │   ├── migrations/        # Migrações do banco
│   │   └── dev.db             # Banco SQLite
│   ├── Dockerfile.api
│   ├── package.json
│   └── tsconfig.json
│
├── latinhas-llc-web/          # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Demands/       # Componentes de demandas
│   │   │   │   ├── DemandsTable.tsx
│   │   │   │   ├── DemandRow.tsx
│   │   │   │   ├── DemandModal.tsx
│   │   │   │   ├── DemandModalCreate.tsx
│   │   │   │   ├── DemandModalEdit.tsx
│   │   │   │   └── StatusBadge.tsx
│   │   │   └── Header.tsx
│   │   ├── page/
│   │   │   └── Demand.tsx     # Página principal
│   │   ├── services/
│   │   │   └── api.ts         # Cliente HTTP (Axios)
│   │   ├── types/
│   │   │   └── demandTypes.ts # Tipos TypeScript
│   │   ├── utils/
│   │   │   ├── formatDate.ts
│   │   │   └── formatDateEdit.ts
│   │   ├── assets/
│   │   ├── global.css
│   │   └── main.tsx
│   ├── Dockerfile.frontend
│   ├── package.json
│   └── vite.config.ts
│
└── docker-compose.yml         # Orquestração dos containers
```

### Diagrama de Arquitetura

```
┌─────────────────┐
│   Frontend      │
│   (React)       │
│   Porta: 5173   │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│   Backend       │
│   (Fastify)     │
│   Porta: 3333   │
└────────┬────────┘
         │
┌────────▼────────┐
│   Database      │
│   (SQLite)      │
│   Prisma ORM    │
└─────────────────┘
```

### Modelo de Dados

O sistema utiliza dois modelos principais:

- **Demand**: Representa uma demanda de produção
  - `id`: UUID único
  - `sku`: Identificador único da demanda
  - `startDate`: Data de início
  - `endDate`: Data de término
  - `plannedTotal`: Total planejado (toneladas)
  - `plannedProduced`: Total produzido (toneladas)
  - `status`: Status da demanda
  - `items`: Relacionamento 1:N com Item

- **Item**: Representa um item que compõe uma demanda
  - `id`: UUID único
  - `sku`: SKU do produto
  - `description`: Descrição do produto
  - `plannedTotal`: Quantidade planejada (toneladas)
  - `plannedProduced`: Quantidade produzida (toneladas)
  - `demandId`: Referência à demanda pai

## 🛠️ Tecnologias Utilizadas

### Backend

- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Fastify** - Framework web rápido e eficiente
- **Prisma** - ORM moderno para TypeScript
- **SQLite** - Banco de dados relacional
- **Zod** - Validação de schemas
- **fastify-type-provider-zod** - Integração Zod com Fastify
- **@fastify/cors** - Middleware CORS

### Frontend

- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utility-first
- **Axios** - Cliente HTTP
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones
- **Sonner** - Notificações toast

### DevOps

- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers

## 🎯 Padrões de Software Aplicados

### 1. **Arquitetura em Camadas (Layered Architecture)**
   - Separação clara entre rotas, lógica de negócio e acesso a dados
   - Organização modular por responsabilidade

### 2. **Repository Pattern (via Prisma)**
   - Abstração do acesso a dados através do Prisma Client
   - Centralização da lógica de banco de dados em `lib/prisma.ts`

### 3. **Schema Validation (Zod)**
   - Validação de dados de entrada e saída
   - Type-safety em tempo de execução e compilação
   - Mensagens de erro padronizadas

### 4. **RESTful API**
   - Endpoints seguindo convenções REST
   - Verbos HTTP apropriados (GET, POST, PATCH, DELETE)
   - Códigos de status HTTP semânticos

### 5. **Type Safety (TypeScript)**
   - Tipagem estática em todo o projeto
   - Redução de erros em tempo de execução
   - Melhor experiência de desenvolvimento (autocomplete, refactoring)

### 6. **Component-Based Architecture (Frontend)**
   - Componentes React reutilizáveis
   - Separação de responsabilidades (presentation vs logic)
   - Composição de componentes

### 7. **Service Layer Pattern**
   - Camada de serviços para comunicação com API (`services/api.ts`)
   - Isolamento da lógica de requisições HTTP

### 8. **Single Responsibility Principle**
   - Cada rota/componente tem uma responsabilidade única
   - Funções pequenas e focadas

### 9. **Error Handling**
   - Tratamento de erros centralizado
   - Mensagens de erro consistentes
   - Validação de dados antes de processamento

### 10. **Environment Configuration**
   - Uso de variáveis de ambiente
   - Configuração separada por ambiente (dev/prod)

## 🚀 Como Iniciar o Projeto

### Pré-requisitos

- **Node.js** 18+ instalado
- **npm** ou **yarn** instalado
- **Docker** 28.3.0 e **Docker Compose** (opcional, para execução via containers)

### Opção 1: Execução Local (Desenvolvimento)

#### Backend

1. Navegue até a pasta do backend:
```bash
cd latinhas-llc-api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (crie um arquivo `.env` na raiz do backend):
```env
PORT=3333
DATABASE_URL="file:./prisma/dev.db"
```

4. Execute as migrações do Prisma:
```bash
npx prisma migrate dev --name init
```

5. Gere o Prisma Client:
```bash
npx prisma generate
```

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O backend estará rodando em `http://localhost:3333`

#### Frontend

1. Navegue até a pasta do frontend:
```bash
cd latinhas-llc-web
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a URL da API (se necessário, edite `src/services/api.ts`):
```typescript
baseURL: 'http://localhost:3333'
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

### Opção 2: Execução com Docker (Produção)

1. Na raiz do projeto (pasta `prova-tecnica-smigroup`), execute:
```bash
docker-compose up --build -d
```

2. Acesse:
   - **Frontend**: `http://localhost:5173`
   - **Backend**: `http://localhost:3333`

Para parar os containers:
```bash
docker-compose down
```

## 📡 Endpoints da API

### Demandas

- `GET /demands` - Lista todas as demandas
- `GET /demands/:id` - Busca uma demanda por ID
- `POST /demands` - Cria uma nova demanda
- `PATCH /demands/:id` - Atualiza uma demanda
- `DELETE /demands/:id` - Remove uma demanda

### Itens

- `POST /items` - Cria um novo item
- `PATCH /items/:id` - Atualiza um item
- `DELETE /items/:id` - Remove um item

### Utilitários

- `GET /ping` - Health check da API

## 🔧 Scripts Disponíveis

### Backend

- `npm run dev` - Inicia o servidor em modo desenvolvimento com hot-reload

### Frontend

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 📝 Notas Adicionais

- O banco de dados SQLite é criado automaticamente na primeira execução
- As migrações do Prisma são executadas automaticamente no Docker
- O CORS está configurado para aceitar requisições de qualquer origem (ajuste para produção)
- O projeto utiliza TypeScript strict mode para maior segurança de tipos

## 📄 Licença

Este projeto foi desenvolvido como prova técnica para a SMI Group.

---

**Desenvolvido com ❤️ usando TypeScript, React e Fastify**

