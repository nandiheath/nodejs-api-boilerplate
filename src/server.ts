const restify = require('restify');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const { ERROR_SERVER_EXCEPTION } = require('./utils/api_error');

// Get the env variables
dotenv.config();

const { logger } = require('./utils/logger');
const { route } = require('./route');
const {
  MONGODB_HOST, MONGODB_DATABASE, MONGODB_USER, MONGODB_PASSWORD, LOGGER_LEVEL,
} = require('./common/env');

// use the passport
require('./auth/passport');

// Set up default mongoose connection
const mongoDB = `mongodb://${MONGODB_HOST}/${MONGODB_DATABASE}`;
const opt = {
  useNewUrlParser: true,
  user: null,
  pass: null,
  auth: null,
};

if (MONGODB_USER !== '') {
  opt.user = MONGODB_USER;
  opt.pass = MONGODB_PASSWORD;
  opt.auth = {
    authdb: 'admin',
  };
}

mongoose.connect(mongoDB, opt);
mongoose.Promise = require('bluebird');

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0',
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(passport.initialize());

//
if (LOGGER_LEVEL === 'debug') {
  server.use((req, res, next) => {
    logger.debug(req);
    next();
  });
}

route(server);

// Catch the errors and format the response
server.on('restifyError', (req, res, err, callback) => {
  logger.debug(err.message);
  logger.debug(err.stack);
  err.toJSON = function customToJSON() {
    return {
      success: false,
      error_code: err.code || ERROR_SERVER_EXCEPTION,
      error_message: err.message,
    };
  };
  err.toString = function customToString() {
    return {
      success: false,
      error_code: err.code || ERROR_SERVER_EXCEPTION,
      error_message: 'Internal Server Error',
    };
  };
  return callback();
});

server.listen(1337, () => {
  logger.info(`${server.name} listening at ${server.url}`);
});

export default server;
