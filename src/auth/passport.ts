const passport = require('passport');
const { logger } = require('./../utils/logger');
const ERRORS = require('restify-errors');
const auth = require('./auth');
const facebookTokenStrategy = require('passport-facebook-token');
const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = require('./../common/env');

import { User } from './../models/user';

class JwtStrategy extends passport.Strategy {
  authenticate(req: any): any {
    let token = req.headers.authorization;
    if (token === undefined) {
      this.error(new ERRORS.UnauthorizedError('Invalid access token'));
      return;
    }

    token = token.replace('Bearer ', '');
    auth.verify(token).then((user) => {
      this.success(user);
    }).catch(() => this.error(new ERRORS.UnauthorizedError('Invalid access token')));
  }
}

/**
 * Facebook Login Strategy
 */
const strategy = new JwtStrategy();
const facebookStrategy = new facebookTokenStrategy(
  {
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
  },
  async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    if (profile === null || profile === undefined) {
      return done(new Error('invalid facebook login'));
    }
    let user = await User.findOne({
      facebook_id: profile.id,
    });
    if (user === null) {
      user = new User({
        username: profile.displayName,
        facebook_id: profile.id,
      });
      try {
        await user.save();
      } catch (error) {
        logger.error(error.message);
        logger.error(error.stack);
        return done(error);
      }
    }

    return done(null, user);
  });

passport.use('jwt', strategy);
passport.use('facebook', facebookStrategy);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
