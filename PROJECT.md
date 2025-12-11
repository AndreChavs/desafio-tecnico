# Projeto Monorepo (Frontend + Backend + MySQL)


<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description
Este repositório contém uma aplicação monorepo que orquestra um frontend Next.js, um backend NestJS e um banco de dados MySQL usando Docker Compose.
  ```
  git clone [URL_DO_SEU_REPOSITORIO]

  ```
## Pré-requisitos
Antes de começar, certifique-se de ter instalado em sua máquina:
Docker (Inclui o Docker Compose)
Node.js e NPM
Git Bash (Recomendado para usuários Windows, para facilitar a execução de comandos Docker/Shell)

## 1. Estrutura do Projeto
A estrutura de pastas está organizada da seguinte forma:
```
/meu-projeto-monorepo
├── /backend             # Aplicação NestJS (challenger-server)
├── /frontend            # Aplicação Next.js
├── docker-compose.yml   # Arquivo de orquestração principal
├── .env.production      # Variáveis de ambiente compartilhadas
└── .dockerignore        # Regras de ignorar arquivos para o Docker
```
## 2. Configuração e Instalação
a. Configure o Arquivo .env.production
Certifique-se de que o arquivo .env.production na raiz do monorepo esteja configurado corretamente com as variáveis de ambiente necessárias para todos os serviços:
ini
``.env.production``

### Backend (NestJS API)
```
NODE_ENV=production
DATABASE_URL="mysql://root:admin123@db:3306/cartorio"
PORT=8000
HOST=localhost
```
### Frontend (Next.js) - Variáveis de acesso (público)
`NEXT_PUBLIC_API_URL=http://localhost:8000`

## 🛠️ Tecnologias e Ferramentas Utilizadas

Este projeto utiliza uma combinação de ferramentas robustas para gerenciamento de dados, documentação de API e manipulação de requisições:

### Ferramentas e Descrições

#### Prisma
Utilizado como ORM (Object-Relational Mapper) e toolkit de banco de dados. Facilita a interação com o MySQL de forma segura e tipada, gera consultas eficientes e automatiza migrações de schema.

#### MySQL
Sistema de gerenciamento de banco de dados relacional (SGBD) utilizado para armazenar e gerenciar os dados da aplicação. O projeto utiliza a versão **8.x** do MySQL.

#### Swagger
Responsável por gerar automaticamente a documentação interativa da API. Ajuda desenvolvedores (front-end, mobile, etc.) a entender os endpoints disponíveis, parâmetros exigidos e modelos de resposta.

#### Multer
Middleware utilizado para upload de arquivos (imagens, documentos etc.). Processa dados `multipart/form-data` enviados via requisições HTTP.

#### Zod
Biblioteca para declaração e validação de schemas em TypeScript. Garante que os dados recebidos — payloads, parâmetros e queries — estejam corretos antes de serem processados pela lógica de negócios ou armazenados no banco.



## 3. Execução Docker Compose

Certifique-se de ter o Docker instalado e em execução em sua máquina.

Navegue até a raiz do projeto onde o arquivo `docker-compose.yml` está localizado e execute o seguinte comando no terminal:

```bash
docker-compose up -d
docker-compose exec nestjs-api npx prisma migrate deploy --schema=./prisma/schema.prisma
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
