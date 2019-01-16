const Errors = require('restify-errors');

module.exports = {
  validate: (req, expected) => {
    for (const key of Object.keys(expected)) {
      if (req.body[key] === undefined) {
        throw new Errors.BadRequestError(`${key} not defined`);
      }
    }
  }
};
