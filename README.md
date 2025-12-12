# Sobre O Projeto
Este projeto consiste em uma solução completa para gestão de pagamentos e operações financeiras, desenvolvida para o Cartório do 1º Ofício de Notas e Registro de Imóveis de Santarém–PA. A plataforma foi construída com backend em Nest.js/TypeScript, frontend em Next.js, banco MySQL e toda a infraestrutura containerizada via Docker Compose.
O sistema permite registrar, atualizar, consultar e excluir pagamentos, anexar comprovantes e gerar relatórios filtrados por período. Toda a arquitetura segue princípios sólidos de organização por camadas, validações consistentes e testes automatizados, garantindo segurança, estabilidade e manutenção simplificada.

---
Para baixar
``` 
git clone https://github.com/AndreChavs/desafio-tecnico 
cd desafio-tecnico
```

# Requisitos Técnicos
## Frontend:
  - **Tecnologias:** Next.js, React, TypeScript e Tailwind.

## Backend (challenger-server):
  - **Tecnologias:** Nest.js, Typescript, Express, Prisma, Zod, @nestjs/swagger e Multer.
  - **Porque usei o Nest.js ao invés do Node.js como foi sugerido no desafio técnico?**
  `Embora o desafio recomendasse a utilização de Node.js com Express, escolhi NestJS por oferecer uma estrutura mais robusta e padronizada para projetos reais. A decisão foi técnica, não estética. NestJS entrega benefícios que aceleram o desenvolvimento e elevam a qualidade da solução (especialmente quando o objetivo é entregar algo profissional, organizado e escalável).`

## Banco de Dados (MySQL):
  - **Tecnologias:** Prisma, Zod, Migrations e MySQL
  - **Porque optei por Prisma em vez de TypeORM?**
  `A escolha pelo Prisma foi intencional e técnica. O TypeORM funciona? Funciona. Mas o Prisma entrega uma experiência muito mais moderna, segura e produtiva — especialmente quando o foco é velocidade, clareza de código e previsibilidade no desenvolvimento.`

## Dockerização
  - **Tecnologias:** Docker e Docker Compose

## Testes Automatizados
  - **Tecnologias:** Jest

## Validação
  - **Tecnologias:** Zod
  - **Porque escolhi Zod em vez de Celebrate/Joi?**
  `Preferi Zod por oferecer validação e tipagem integradas, sintaxe mais simples e uma experiência de desenvolvimento muito superior em projetos TypeScript-first. Enquanto Celebrate/Joi exige mais camadas e duplicação de tipos, o Zod mantém tudo centralizado, seguro e muito mais fácil de manter.`

## Documentação (API)
  - **Tecnologias:** Swagger


# Execução Docker Compose

Certifique-se de ter o Docker instalado e em execução em sua máquina.
Navegue até a raiz do projeto onde o arquivo `docker-compose.yml` está localizado e execute o seguinte comando no terminal:

```bash
docker-compose up -d
```

``
Aplique as Migrações do Banco de Dados (Importante!):
Após os containers subirem, o banco de dados estará vazio. Você precisa rodar o comando do Prisma para criar as tabelas.
Abra outro terminal (Git Bash) na raiz
``

```bash
docker-compose exec nestjs-api npx prisma migrate deploy --schema=./prisma/schema.prisma
```

## Testes:
  Para rodar testes
```
npm run test
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).