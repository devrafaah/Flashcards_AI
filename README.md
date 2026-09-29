# Flashcards AI

Envie um PDF e a IA (Claude) extrai os conceitos-chave e gera um baralho de
flashcards pronto para estudo.

- **Backend:** Node.js + TypeScript, Express, Prisma (SQLite), autenticação
  JWT, geração de flashcards via [Claude](https://www.anthropic.com/) (`@langchain/anthropic`).
- **Frontend:** React 18 + Vite + Tailwind CSS.

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou superior
- Uma chave de API da Anthropic — crie em [console.anthropic.com](https://console.anthropic.com)
  (Settings → API Keys). **Importante:** a chave precisa estar vinculada a um
  workspace específico, senão a API retorna erro pedindo o header de workspace.

## 1. Clonar o projeto

```bash
git clone <url-do-repositorio>
cd flashcards-ai
```

## 2. Configurar e rodar o backend

```bash
cd backend
npm install
```

Copie o `.env.example` para `.env` e preencha sua chave da Anthropic:

```bash
cp .env.example .env
```

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="troque-por-uma-string-aleatoria-longa"
ANTHROPIC_API_KEY="sua-chave-aqui"
```

Crie o banco de dados (aplica as migrations do Prisma):

```bash
npx prisma generate
npx prisma migrate deploy
```

Suba o servidor:

```bash
npm run dev
```

O backend fica disponível em `http://localhost:3333`. Teste com:

```bash
curl http://localhost:3333/health
```

## 3. Configurar e rodar o frontend

Em outro terminal:

```bash
cd frontend
npm install
```

Copie o `.env.example` — o valor padrão já aponta para o backend local:

```bash
cp .env.example .env
```

Suba o frontend:

```bash
npm run dev
```

Acesse `http://localhost:5173`, crie uma conta e envie um PDF.

## Estrutura do projeto

```
backend/    API REST (Express + Prisma + Claude)
frontend/   Aplicação React (Vite + Tailwind)
```

## Scripts úteis

| Local      | Comando              | O que faz                              |
| ---------- | -------------------- | --------------------------------------- |
| `backend`  | `npm run dev`         | Sobe a API com hot-reload (nodemon)     |
| `frontend` | `npm run dev`         | Sobe o app em modo desenvolvimento      |
| `frontend` | `npm run build`       | Type-check + build de produção          |
| `backend`  | `npx prisma studio`   | Interface visual para ver o banco SQLite |

## Variáveis de ambiente

**`backend/.env`**

| Variável            | Obrigatória | Descrição                                                   |
| ------------------- | ----------- | ------------------------------------------------------------ |
| `DATABASE_URL`      | Sim         | Caminho do banco SQLite (padrão `file:./dev.db`)              |
| `JWT_SECRET`        | Sim         | String secreta usada para assinar os tokens de login          |
| `ANTHROPIC_API_KEY` | Sim         | Chave da API da Anthropic (Claude), vinculada a um workspace  |
| `CLAUDE_MODEL`      | Não         | Sobrescreve o modelo padrão (`claude-sonnet-5`)                |

**`frontend/.env`**

| Variável        | Obrigatória | Descrição                          |
| --------------- | ----------- | ------------------------------------ |
| `VITE_API_URL`  | Sim         | URL do backend (padrão `http://localhost:3333`) |

## Limitações conhecidas

- Não há upload de arquivo persistente: o PDF é processado em memória e descartado após gerar o baralho.
- Título do baralho e sessões de estudo (acertos/erros) não são salvos no backend — vivem só no frontend durante a navegação.
