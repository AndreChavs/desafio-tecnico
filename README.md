# Desafio Técnico – Desenvolvedor(a) Node.js / Next.js

Bem-vindo(a) ao desafio técnico do Cartório do 1º Ofício de Notas e Registro de Imóveis de Santarém - PA. 

O objetivo deste teste é avaliar sua capacidade de **modelar dados**, **implementar uma API REST** com boas práticas, **garantir regras de negócio simples**, e criar um **frontend em Next.js** para consumir essa API.

---

## Contexto

Você deverá implementar um **controle de pagamentos e transferências**, permitindo o cadastro, edição, listagem e exclusão de lançamentos financeiros.

Cada lançamento representará um **pagamento** ou **transferência**, associado a um tipo de pagamento pré-cadastrado.


## Objetivo do desafio

Implementar um **CRUD completo** (Create, Read, Update, Delete) para **pagamentos/transferências**, com:

- API em **Node.js + TypeScript** usando:
  - **Express**
  - **TypeORM**
  - **celebrate/Joi** (validação)
  - **Multer** (caso implemente upload de comprovante)
- Banco de dados relacional (preferencialmente **MySQL**).
- Frontend em **Next.js** consumindo a API.
- Organização do código em camadas (controllers, services, repositories, etc.).


## Modelo de dados

Você deverá implementar, no mínimo, as seguintes entidades:

### 1. Payment (ou Transaction, ou equivalente)

Campos obrigatórios:

- `id` – Identificador único
- `date` – Data do pagamento/transferência
- `paymentTypeId` – Referência ao tipo de pagamento (FK)
- `description` – Descrição do pagamento/transferência
- `amount` – Valor do pagamento/transferência
- `createdAt` / `updatedAt` – Datas de criação/atualização (padrão de auditoria)

Opcional (caso implemente upload):

- `receiptPath` (ou similar) – Caminho/URL do comprovante de pagamento

### 2. PaymentType (tabela auxiliar)

Campos sugeridos:

- `id` – Identificador único
- `name` – Nome do tipo de pagamento (ex.: "Folha de pagamento")
- `createdAt` / `updatedAt`

Valores iniciais sugeridos (seed ou script de inserção):

- Folha de pagamento  
- Combustível  
- Estorno  
- Manutenção predial  


## Regras de negócio

### Tipos de pagamento

- Os **tipos de pagamento** devem ser mantidos em uma **tabela auxiliar** (`PaymentType`).
- Cada pagamento/transferência deve estar vinculado a um `PaymentType` válido.

### Pagamentos duplicados

Não deve ser permitido cadastrar **pagamentos duplicados**.

Para este desafio, considere um pagamento **duplicado** quando já existir um registro com a mesma combinação de:

- `date` (mesmo dia)
- `paymentTypeId`
- `amount`
- `description`

Ao tentar criar um pagamento duplicado, a API deve retornar um erro apropriado (por exemplo, `400 Bad Request`) com uma mensagem clara.


## API – Requisitos mínimos

Você é livre para estruturar as rotas como achar melhor, mas uma sugestão é:

### Rotas de tipos de pagamento (`/payment-types`)

- `GET /payment-types`  
  Lista todos os tipos de pagamento.

- `POST /payment-types`  
  Cria um novo tipo de pagamento.

### Rotas de pagamentos (`/payments`)

- `POST /payments`  
  Cria um novo pagamento/transferência.

  **Body (exemplo):**
  ```json
  {
    "date": "2025-01-20",
    "paymentTypeId": 1,
    "description": "Pagamento de folha - janeiro/2025",
    "amount": 15000.50
  }
  ```

- `GET /payments`  
  Lista pagamentos/transferências com possibilidade de filtros simples, por exemplo:
  - `paymentTypeId`
  - intervalo de datas (`startDate`, `endDate`)

- `GET /payments/:id`  
  Retorna os detalhes de um pagamento específico.

- `PUT /payments/:id`  
  Atualiza os dados do pagamento/transferência.

- `DELETE /payments/:id`  
  Remove um pagamento/transferência.

### Validações

- Utilize **celebrate/Joi** para validar os dados de entrada das rotas.
- Todas as rotas que recebem body/query params devem ser validadas.
- Retorne erros de forma consistente e com mensagens claras.


## Frontend (Next.js)

Implemente um frontend simples em **Next.js** que consuma a API criada.

Requisitos mínimos sugeridos:

- Página para **listagem de pagamentos**:
  - Tabela com: data, tipo, descrição, valor.
  - Filtros simples (por data inicial/final e/ou tipo de pagamento).
- Formulário para **criação/edição de pagamento**:
  - Campos: data, tipo de pagamento (select), descrição, valor.
- Uso de **TypeScript** no frontend também.

O foco aqui não é layout perfeito, mas sim:

- Organização do código.
- Boas práticas básicas.
- Integração correta com a API.


## Diferenciais (opcionais)

Não são obrigatórios, mas serão considerados **pontos extras**:

1. **Docker / docker-compose**
   - Arquivo `docker-compose.yml` orquestrando:
     - API
     - Banco de dados
     - Frontend
   - Instruções claras de como subir o ambiente com um comando.

2. **Relatório por período**
   - Endpoint e/ou página para gerar relatório entre `data início` e `data fim`, exibindo:
     - Lista de pagamentos no período.
     - Total pago no período.
   - Exemplo de endpoint:
     - `GET /payments/report?startDate=...&endDate=...`

3. **Upload de comprovante**
   - Uso de **Multer** para upload de arquivo (ex.: PDF/JPEG/PNG) como comprovante de pagamento.
   - Associação do comprovante ao pagamento.
   - Campo adicional no modelo (`receiptPath` ou similar).
   - Rota(s) para upload e para download/visualização do comprovante.

4. **Testes automatizados**
   - Testes unitários ou de integração para pelo menos algumas partes da API.


## Stack e requisitos técnicos

Obrigatório:

- **Node.js**
- **TypeScript**
- **Express**
- **TypeORM**
- **celebrate/Joi**
- **Next.js**
- Banco relacional (preferencialmente **MySQL**)

Opcionais (diferenciais):

- **Multer** (se implementar upload de comprovante)
- **Docker** e **docker-compose**


## O que será avaliado

- Modelagem de dados e compreensão do domínio.
- Organização do código (separação em camadas, estrutura de pastas).
- Uso correto de TypeScript.
- Validações e tratamento de erros.
- Implementação das regras de negócio (tabela auxiliar e não permitir duplicados).
- Qualidade dos endpoints (clareza, coerência de nomes, uso de HTTP status codes).
- Qualidade geral do frontend (mesmo que simples).
- Documentação e facilidade para rodar o projeto.
- Diferenciais implementados (docker, relatório, upload, testes).


## Como entregar

1. Faça um **fork** deste repositório para a sua conta no GitHub.
2. Implemente a solução no seu fork.
3. Atualize o `README.md` do seu projeto com:
   - Instruções claras de instalação e execução (backend e frontend).
   - Como configurar o banco de dados.
   - Como rodar com Docker (se aplicável).
   - Exemplos de requisições (pode ser via cURL, Insomnia, Postman, etc.).
4. Envie o **link do seu repositório** para nós no e-mail contato@cartorio1santarem.com.br com o assunto: "Desafio técnico - Dev full stack."


## Prazo para entrega

Este desafio deverá ser entregue até às 23h59 do dia 12/12/2025.

Envie o link do repositório público para o e-mail: contato@cartorio1santarem.com.br

Sabemos que cada pessoa tem seu ritmo e outros compromissos, então, se não conseguir fazer tudo, **priorize o básico bem feito** e, no `README`, explique:

- O que foi implementado.
- O que você faria se tivesse mais tempo.

Boa sorte! 🚀
