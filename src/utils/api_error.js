const Errors = require('restify-errors');


const ERROR_INTERNAL = 500;
// 1xxxx: auth related
const ERROR_USER_NOT_FOUND = 10000;


// 2xxxx: db/server related
const ERROR_ENTITY_NOT_FOUND = 20000;
const ERROR_SERVER_EXCEPTION = 20001;
const ERROR_ENTITY_ALREADY_EXISTS = 20002;
const ERROR_ENTITY_DUPLICATED = 20003;

module.exports = {
  ERROR_SERVER_EXCEPTION,
  entityNotFound: () => new Errors.BadRequestError({ code: ERROR_ENTITY_NOT_FOUND }, 'entity not found'),
  unauthoirzedRequest: () => new Errors.UnauthorizedError({ code: ERROR_USER_NOT_FOUND }, 'user not found'),
  dbConnectionFailed: () => new Errors.InternalServerError({ code: ERROR_SERVER_EXCEPTION }, 'server exception'),
  entityAlreadyExists: () => new Errors.InternalServerError({ code: ERROR_ENTITY_ALREADY_EXISTS }, 'entity already exists'),
  duplicatedEntry: () => new Errors.BadRequestError({ code: ERROR_ENTITY_DUPLICATED }, 'entity already exists'),
  internalError: err => new Errors.InternalServerError({ code: ERROR_INTERNAL }, err.message),
};
