import { BadRequestError } from './utils/api_error';
import { join } from 'path';
import * as Joi from 'joi';
import logger from './utils/logger';

export function validate(key) {
  return (req, res, next) => {

    const validator = validators[key];
    if (validator) {
      const { error } = Joi.validate(req.body, validator);
      if (error) {
        return next(BadRequestError(error.message));
      }
    }
    next();
  };
}

const validators = {
  '/auth/register': Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email({ minDomainAtoms: 2 }),
  }).required(),
};
