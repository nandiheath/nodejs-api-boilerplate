const Promise = require('bluebird');
const jwt = Promise.promisifyAll(require('jsonwebtoken'));
const { JWT_SECRET } = require('../common/env');

function sign(user) {
  return jwt.sign({ id: user.id, mobile: user.mobile, username: user.username }, JWT_SECRET);
}

async function verify(token) {
  const payload = await jwt.verifyAsync(token, JWT_SECRET);
  return payload;
}

module.exports = {
  sign,
  verify
};
