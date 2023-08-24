## Client repo

- Follow slearninglab client repo - [github](https://github.com/minhtrifit/slearninglab-client)

## Install postgresql

- Follow website - [postgresql](https://www.postgresql.org)

## Config .env file in root dir

```bash
CLIENT_URL=yourclienturl
DB_HOST=yourdbhost
DB_PORT=yourdbport
DB_USERNAME=yourdbusername
DB_PASSWORD=yourdbpassword
DB_NAME=youdatabasename
JWT_KEY_SECRET=yourjwtkey
JWT_ACCESS_KEY=youraccesskey
JWT_REFRESH_KEY=yourrefreshkey
AUTH_EMAIL_USER=youremail@gmail.com
AUTH_EMAIL_PASSWORD=youremailpassword
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Run with Dockerfile

```bash
$ docker run -p 5500:5500 slearninglab-api:1.0.0
```

## Stay in touch

- Author - [minhtrifit](https://kamilmysliwiec.com)
- Github - [https://github.com/minhtrifit](https://github.com/minhtrifit)