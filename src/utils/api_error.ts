import * as RestifyErrors from 'restify-errors';

const ERROR_INTERNAL = 500;
// 1xxxx: auth related
export const ERROR_USER_ALREADY_EXISTS = 10000;
export const ERROR_WRONG_CREDENTIAL = 10001;
export const ERROR_TOKEN_EXPIRED = 10002;

// 2xxxx: db/server related
export const ERROR_ENTITY_NOT_FOUND = 20000;
export const ERROR_SERVER_EXCEPTION = 20001;
export const ERROR_ENTITY_ALREADY_EXISTS = 20002;
export const ERROR_ENTITY_DUPLICATED = 20003;
export const ERROR_ENTITY_INVALID_REQUEST = 20004;

export const UnthenticatedRequestError = () => new RestifyErrors.UnauthorizedError({ code: ERROR_WRONG_CREDENTIAL }, 'not authenicated');

export const UserAlreadyExistsError = () => new RestifyErrors.BadRequestError({ code: ERROR_USER_ALREADY_EXISTS }, 'user already exists');

export const EntityNotFoundError = () => new RestifyErrors.BadRequestError({ code: ERROR_ENTITY_NOT_FOUND }, 'entity not found');

export const EntityAlreadyExistsError = () => new RestifyErrors.BadRequestError({ code: ERROR_ENTITY_ALREADY_EXISTS }, 'entity already exists');

// Error when trying to login to a non-exist user
export const UserNotFoundError = () => new RestifyErrors.BadRequestError({ code: ERROR_WRONG_CREDENTIAL }, 'incorrect username/password');

// Error when trying to login with wrong password
export const InvalidCredentialError = () => new RestifyErrors.UnauthorizedError({ code: ERROR_WRONG_CREDENTIAL }, 'incorrect username/password');

// Error when incorrect payload fields
export const InvalidRequestError = (msg: string) => new RestifyErrors.BadRequestError({ code: ERROR_ENTITY_INVALID_REQUEST }, msg);

export const InternalError = err => new RestifyErrors.InternalServerError({ code: ERROR_INTERNAL }, err.message);

export const BadRequestError = message => new RestifyErrors.BadRequestError({ code: ERROR_INTERNAL }, message);
