<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="./diagrams/title.png" width="100%" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center"><a href="https://github.com/nestjs/nest" target="_blank">NestJS</a> a progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>

## Description

Nest (TypeScript) repository API Finance Manager.

```bash
# Works around bank transactions, monitoring expenses by categories, send webhooks, etc...
# Used: NestJs, TypeORM 0.3, PostgreSQL, pgAdmin, Docker, unit/e2e tests by Jest/Supertest
```

## Installation | Docker main App image Installation

```bash
$ npm install | $ docker build --tag nestjs-api .
```

## Running the app | Docker running the App as container

```bash
# development
$ npm run start | $ docker-compose:dev

# watch mode
$ npm run start:dev | $ docker-compose:dev

# production mode
$ npm run start:prod | $ docker-compose:prod
```

## DB Initialization, migration

```bash
# delevolpment, testing, production (in all cases you need migration run after DB started in container)
$ npm run migration:run
```

## Test | Docker run tests

```bash
# unit tests
$ npm run test | $ docker-compose:test

# e2e tests (you need Docker DB container runing & run e2e test on the same environment)
# run your test in container terminal or | by docker command
$ npm run test:e2e | $ docker-compose:test-e2e

# test coverage, available after run at the [link](http://127.0.0.1:5500/coverage/lcov-report/index.html)
$ npm run test:cov | $ docker-compose:test-cov
```

## API Extensions (while Docker containers running)

- APP: available on the next [local link](http://localhost:3000/api/)
- TEST Coverage:, after tests, coverage available at the [link](http://127.0.0.1:5500/coverage/lcov-report/index.html) or in terminal
- WEBHOOK Testing: check web-hook (when sending POST transaction request to API) on the [next link](https://webhook.site/#!/8b0713df-5030-4a5c-a089-12839b77d3e0)
- Use [Postman](https://www.postman.com/) for testing CRUD operations or by local Swagger API-doc, see below the API Documentation
- PgAdmin4: administrative application interface for PostgreSQL, available on the [local link](http://localhost:8080)
  ```bash
  # config PgAdmin4
  1. Open up PgAdmin 4, and use credential data from docker-compose.yml to login: email & pass
  2. Create new server and add next config:
     General section: name: `pgadmin`
     Connection section: Host name/address: `db`, Port: `5432`, databasa: `postgres`, Username: `postgres`, Password: `postgres`
     Push 'Save' button.
  3. You've connected to DB. Done! GJ :)
  ```

## API Documentation

### for local environment, pls run your app

- local. Swagger API. Doc - [localhost:3000/api/doc](http://localhost:3000/api/doc)
- local. Swagger JSON Doc - [localhost:3000/api/doc-json](http://localhost:3000/api/doc-jon)
- local. Swagger YAML Doc - [localhost:3000/api/doc-yaml](http://localhost:3000/api/doc-yaml)

### for external, available static pages

- External Swagger Doc - [static github page](https://mme83.github.io/nestjs-app-fm/index.html)
- External Doc - [static github page 2](https://mme83.github.io/nestjs-app-fm/docs/index.html)
