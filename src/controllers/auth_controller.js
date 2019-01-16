const Errors = require('restify-errors');
// const { logger } = require('./../utils/logger');
const { validate } = require('./../utils/validator');
const User = require('./../models/user');
const { sign } = require('./../auth/auth');
const { formatResponse, getUserFromReq } = require('../utils/api_helper');

/**
 * POST /auth/login
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function login(req, res, next) {
  validate(req, { password: 'string' });
  const query = {};
  if (req.body.mobile) {
    query.mobile = req.body.mobile;
  } else if (req.body.username) {
    query.username = req.body.username;
  }

  const user = await User.findOne(query).exec();
  let authenticated = false;
  if (user !== null) {
    authenticated = await user.verifyPassword(req.body.password);
  }

  if (!authenticated) {
    throw new Errors.UnauthorizedError('password incorrect');
  } else {
    const token = await sign(user);
    res.send(formatResponse({ user, token }));
    return next();
  }
}

/**
 * POST /auth/register
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function register(req, res, next) {
  validate(req, { username: 'string', password: 'string', mobile: 'string' });
  const { username, password, mobile } = req.body;
  const passwordHash = await User.hashPassword(password);
  const user = new User({
    username,
    mobile,
    password_hash: passwordHash
  });
  await user.save();
  const token = await sign(user);
  res.send(formatResponse({
    user,
    token
  }));
  return next();
}


/**
 *
 * @api {post} /auth/facebook Facebook Login
 * @apiName FacebookLogin
 * @apiGroup auth
 * @apiVersion  1.0.0
 * @apiHeader (AuthHeader) {String} Content-Type application/json
 * @apiParamExample {json} Request Example:
                   {
                     access_token: ''
                   }
 * @apiSuccessExample {type} Success-Response:
 * {
 *     success: true,
 *     data: {
 *        user: {
 *            id: String,
 *            username: String
 *        },
 *        token: String
 *      }
 * }
 */
async function facebookLogin(req, res, next) {
  const user = await getUserFromReq(req);
  const token = await sign(user);
  res.send(formatResponse({ user, token }));
  return next();
}


async function me(req, res, next) {
  const user = await getUserFromReq(req);
  res.send(formatResponse({
    user
  }));
  return next();
}

module.exports = {
  login,
  register,
  facebookLogin,
  me
};
