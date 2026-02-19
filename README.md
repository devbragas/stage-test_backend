# Stage Flow – Backend

Backend da aplicação de mapeamento e visualização da cadeia de processos organizacionais.

Desenvolvido com NestJS + Prisma + PostgreSQL, seguindo uma arquitetura modular robusta.

## 1. Objetivo do Backend

Fornecer uma API REST responsável por:

- Gerenciamento de Áreas
- Gerenciamento de Processos e Subprocessos
- Estrutura hierárquica de processos
- Estatísticas por área
- Paginação e filtros avançados
- Garantia de integridade relacional

O foco das API's se baseiam nos seguintes aspectos:

- Organização modular
- Separação clara de responsabilidades
- Escalabilidade
- Consistência nas respostas
- Tratamento adequado de erros

---

## 2. Ferramentas Utilizadas

- NestJS
- Prisma ORM
- PostgreSQL
- Swagger
- ValidationPipe global
- Exception Filters globais
- UUID como identificador primário

---

## 3. Arquitetura do Projeto

Estrutura modular baseada em domínio:

### Separação de Camadas

- Controllers → Camada HTTP
- Services → Regra de negócio
- DTOs → Contrato de entrada/saída
- PrismaService → Acesso ao banco
- Exception Filters → Tratamento centralizado de erros

## 4. Funcionalidades

### Áreas

- Criar área
- Listar áreas (com busca por nome)
- Buscar por ID
- Atualizar
- Remover
- Contagem de processos por área
- Validação de duplicidade via constraint + filtro Prisma

### Processos

- Criar processo
- Atualizar processo
- Remover processo (bloqueado se possuir filhos)
- Listagem com:
  - Paginação
  - Filtro por área
  - Filtro por nome
- Busca por ID
- Listagem por área
- Estrutura em árvore por área
- Estatísticas por área:
  - Total de processos
  - Processos ativos
  - Quantidade por tipo
  - Profundidade máxima

## 5. Documentação das API's

Todos os endpoints podem ser devidamente testados pelo Swagger em:

```bash
http://localhost:3333/api
```

A documentação é gerada automaticamente via decorators do NestJS.

## 6. Como Rodar o Projeto

Clone o repositório:

```bash
git clone https://github.com/devbragas/stage_test-backend.git
cd stage_test-backend
```

Instale as dependências com o seguinte comando no terminal:

```bash
npm install
```

### Configuração do Banco de Dados

Este projeto utiliza PostgreSQL como banco de dados.

#### Pré-requisitos

- PostgreSQL instalado e rodando localmente
- Usuário e senha configurados

Antes de rodar as migrations, crie o banco manualmente.

Você pode usar:

- DBeaver
- PgAdmin
- Ou o terminal

Exemplo via terminal:

```bash
createdb process_map
```

Feito isso, basta criar um arquivo .env na raíz do projeto com a seguinte linha, utilizando a senha de acesso do seu Postgres:

```bash
DATABASE_URL="postgresql://postgres:suasenha@localhost:5432/process_map?schema=public"
```

Depois, execute as migrations e gere o prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

Inicie a aplicação:

```bash
npm run start:dev
```

A aplicação estará disponível em: [http://localhost:3333](http://localhost:3333) .
