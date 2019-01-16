import passport from 'passport';
import { asyncMiddleware } from './async_middleware';

const {
  passportAuthenicate
} = require('./utils/api_helper');

// controllers
const authController = require('./controllers/auth_controller');

module.exports = {
  route: (server) => {
    // auth
    server.post('/auth/local', asyncMiddleware(authController.login));
    server.post('/auth/register', asyncMiddleware(authController.register));
    server.get('/me', passport.authenticate('jwt'), asyncMiddleware(authController.me));
    server.post('/auth/facebook', passportAuthenicate('facebook'), asyncMiddleware(authController.facebookLogin));

    server.get('/', (req, res) => {
      res.send({
        hello: 'world'
      });
    });
  }
};
