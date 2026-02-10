# Inventory Management System

Sistema de gerenciamento de estoque desenvolvido para controle de matérias-primas e produtos, com cálculo automático de plano de produção baseado no estoque disponível.

## 📋 Requisitos

- **Java 21** (JDK 21)
- **Node.js** (versão 18 ou superior)
- **Docker** e **Docker Compose**
- **IntelliJ IDEA** (recomendado) ou outra IDE Java
- **Git**

## 🚀 Como Executar o Projeto

### 1. Backend (Spring Boot)

#### 1.1. Clonar o Repositório

```bash
git clone https://github.com/warleyramires/autoflex.git
cd teste_tecnico
```

#### 1.2. Configurar o Banco de Dados

Antes de executar o backend, é necessário iniciar o banco de dados usando Docker Compose:

```bash
cd backend/inventory
docker compose up -d
```

Isso irá iniciar o banco de dados PostgreSQL (ou outro configurado) em segundo plano.

**Verificar se o container está rodando:**
```bash
docker ps
```

#### 1.3. Executar o Backend

1. Abra o projeto no **IntelliJ IDEA**:
   - File → Open → Selecione a pasta `backend/inventory`

2. Configure o JDK 21:
   - File → Project Structure → Project → SDK: Java 21
   - File → Project Structure → Modules → Language Level: 21

3. Execute o projeto:
   - Localize a classe principal
   - Clique com botão direito → Run
   - Ou use o atalho `Shift + F10`

4. Verifique se o servidor está rodando:
   - O backend deve estar disponível em `http://localhost:8080`
   - Acesse `http://localhost:8080/api` para verificar

#### 1.4. Testar as Rotas da API

A API está disponível em `http://localhost:8080/api`. Abaixo estão exemplos de requisições para testar:

##### Raw Materials (Matérias-Primas)

**Criar Matéria-Prima:**
```bash
POST http://localhost:8080/api/raw-materials
Content-Type: application/json

{
  "code": "RM001",
  "name": "Aço Inoxidável",
  "stockQuantity": 1000.50
}
```

**Listar Todas as Matérias-Primas:**
```bash
GET http://localhost:8080/api/raw-materials
```

**Buscar Matéria-Prima por Código:**
```bash
GET http://localhost:8080/api/raw-materials/code/RM001
```

**Buscar Matéria-Prima por ID:**
```bash
GET http://localhost:8080/api/raw-materials/1
```

**Atualizar Matéria-Prima:**
```bash
PUT http://localhost:8080/api/raw-materials/RM001
Content-Type: application/json

{
  "code": "RM001",
  "name": "Aço Inoxidável Premium",
  "stockQuantity": 1500.75
}
```

**Deletar Matéria-Prima:**
```bash
DELETE http://localhost:8080/api/raw-materials/RM001
```

##### Products (Produtos)

**Criar Produto:**
```bash
POST http://localhost:8080/api/products
Content-Type: application/json

{
  "code": "PROD001",
  "name": "Produto Exemplo",
  "price": 299.99,
  "rawMaterials": [
    {
      "rawMaterialCode": "RM001",
      "quantity": 2.5
    },
    {
      "rawMaterialCode": "RM002",
      "quantity": 1.0
    }
  ]
}
```

**Listar Todos os Produtos:**
```bash
GET http://localhost:8080/api/products
```

**Buscar Produto por Código:**
```bash
GET http://localhost:8080/api/products/code/PROD001
```

**Atualizar Produto:**
```bash
PUT http://localhost:8080/api/products/PROD001
Content-Type: application/json

{
  "code": "PROD001",
  "name": "Produto Exemplo Atualizado",
  "price": 349.99,
  "rawMaterials": [
    {
      "rawMaterialCode": "RM001",
      "quantity": 3.0
    }
  ]
}
```

**Deletar Produto:**
```bash
DELETE http://localhost:8080/api/products/PROD001
```

##### Production Plan (Plano de Produção)

**Gerar Plano de Produção:**
```bash
GET http://localhost:8080/api/production
```

Esta rota retorna uma lista de produtos que podem ser produzidos com as matérias-primas disponíveis em estoque, ordenados por maior valor, incluindo:
- Quantidade possível de cada produto
- Valor unitário e total
- Valor total geral (grandTotalValue)

**Exemplo de Resposta:**
```json
{
  "items": [
    {
      "productId": 1,
      "productCode": "PROD001",
      "productName": "Produto Exemplo",
      "quantityProssible": 10,
      "unitValue": 299.99,
      "totalValue": 2999.90
    }
  ],
  "grandTotalValue": 2999.90
}
```

---

### 2. Frontend (React + TypeScript + Vite)

#### 2.1. Navegar para a Pasta do Frontend

```bash
cd teste_tecnico/frontend/inventory-front
```

#### 2.2. Instalar Dependências

```bash
npm install
```

**Nota:** Se você encontrar erros relacionados ao Material-UI, instale as dependências necessárias:

```bash
npm install @mui/material @emotion/react @emotion/styled
```

#### 2.3. Executar o Frontend

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173` (ou outra porta indicada no terminal).

#### 2.4. Acessar a Aplicação

Abra seu navegador e acesse:
```
http://localhost:5173
```

A aplicação possui as seguintes páginas:

- **Home** (`/`) - Página inicial com cards de navegação
- **Raw Materials** (`/raw-materials`) - CRUD de matérias-primas
- **Products** (`/products`) - CRUD de produtos
- **Production Plan** (`/production`) - Visualização do plano de produção

---

## 🛠️ Tecnologias Utilizadas

### Backend
- Java 21
- Spring Boot
- Spring Data JPA
- PostgreSQL (via Docker)
- Maven/Gradle

### Frontend
- React 18
- TypeScript
- Vite
- Material-UI (MUI)
- React Router
- Axios

---

## 📁 Estrutura do Projeto

```
teste_tecnico/
├── backend/
│   └── inventory/          # Projeto Spring Boot
│       ├── src/
│       ├── docker-compose.yml
│       └── pom.xml (ou build.gradle)
│
└── frontend/
    └── inventory-front/     # Projeto React
        ├── src/
        │   ├── api/        # Chamadas à API
        │   ├── components/ # Componentes React
        │   ├── hooks/      # Custom hooks
        │   ├── layout/     # Layout principal
        │   ├── page/       # Páginas da aplicação
        │   ├── routes/     # Configuração de rotas
        │   └── types/      # Tipos TypeScript
        ├── package.json
        └── vite.config.ts
```

---

## 🔧 Configurações Importantes

### Backend
- **Porta:** 8080
- **Base URL da API:** `http://localhost:8080/api`
- **Banco de Dados:** Configurado via `docker-compose.yml`

### Frontend
- **Porta:** 5173 (padrão do Vite)
- **API Base URL:** `http://localhost:8080/api` (configurado em `src/api/axios.ts`)

**Para alterar a URL da API no frontend:**
Edite o arquivo `src/api/axios.ts` e modifique a propriedade `baseURL`.

---

## 🐛 Troubleshooting

### Backend não inicia
- Verifique se o Docker está rodando: `docker ps`
- Verifique se o banco de dados está ativo: `docker compose ps`
- Verifique as configurações de conexão no `application.properties` ou `application.yml`

### Frontend não conecta com o backend
- Verifique se o backend está rodando em `http://localhost:8080`
- Verifique a URL da API em `src/api/axios.ts`
- Verifique o console do navegador para erros de CORS

### Erros de dependências no frontend
- Delete a pasta `node_modules` e o arquivo `package-lock.json`
- Execute `npm install` novamente
- Se persistir, instale manualmente: `npm install @mui/material @emotion/react @emotion/styled`

---

## 📝 Notas

- O sistema prioriza produtos de maior valor ao gerar o plano de produção
- Uma matéria-prima pode ser utilizada em múltiplos produtos
- O cálculo de produção considera o estoque disponível e as quantidades necessárias

---

## 👨‍💻 Desenvolvido por

Warley Ramires

---

## 📄 Licença

Este projeto foi desenvolvido como teste técnico.
