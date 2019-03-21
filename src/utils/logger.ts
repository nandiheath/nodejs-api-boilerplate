import * as winston from 'winston';
const { LOGGER_LEVEL } = require('./../common/env');

const logger = winston.createLogger({
  level: LOGGER_LEVEL,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: LOGGER_LEVEL,
      format: winston.format.simple(),
    }),
  ],
});

export default logger;
