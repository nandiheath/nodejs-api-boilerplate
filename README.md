# Boilderplate for nodejs API


## Stacks

This API server is using the following stack:

- nodejs
- typescript
- tslint
- docker
- mongodb (with mongose)
- passport.js for authentication
- mocha + chai (chai-http) for testing
- ci: travis

### Nodejs with typescript

Typescript introduce types to javascript and greatly enchance both the readability and stabality. Especaiily in medium or large size nodejs project it would get benefits for using typescript.

Typescripts are transpiled to javascript files(ECMA version is configurable via tsconfig.json) and execute as normal javascript files. For development we use `nodemon` with `tsc` to monitor the changes in .ts files and trigger the build and restart the server.

### tslint

Linting enforce standards when writing codes. And it would probably reduce the typo/syntax errors when writing javascript/typescript when there is no compiler. In this project we use standards from [airbnb](https://github.com/airbnb/javascript) as default.

### docker

Dockerize the applications bring portalablity and convenience for deployment. We use `pm2-docker` to setup the docker image to ensure the liveness of the application.

### mongodb

For simplicity we pick mongodb as the database. Just pick your database for your own need.

### passport.js

To enhance the security we pick passport as the authenication provider. It serves as the middleware for different requests. A `jwt-token` is issued for logged in users.

It is easy to config which endpoints you would like to protect in `src/route.ts` by using the passport middleware or not.

And this project has already implemented facebook login as well.

### mocha + chai

For unit testing we use mocha with chai. And we also included chai-http to serve the integration needs for the apis. Please be remind that you should provide the `.env-test` or config through `package.json` to allow integration test run on an individual mongodb database as it would create/delete collections for every integration test.

## How to run

### Before you start

```bash
# instal dependencies
npm install
```

### Development using nodemon with tsc

```bash
# development
npm run dev
```

### Production

```bash
# run the unit tests and integration tests
npm run test

# build the javascript to ./built folder
npm run compile
```