import oauth2orize from 'oauth2orize';
import * as web from 'express-decorators';
import crypto from 'crypto';
import { isClientAuthenticated } from '../policy/oAuth';
import { Token, User, Refresh } from '../models';
import app from '../../bootstrap';


const server = oauth2orize.createServer();

@web.basePath('/oauth2')
class oAuth2Controller {
  constructor() {
    server.exchange(oauth2orize.exchange.password(async (client, email, password, scope, done) => {
      const user = await User.findOne({ email, status: 'active' });

      if (!user) {
        return done(null, false);
      }
      if (!await user.verifyPassword(password)) {
        return done(null, false);
      }

      await Refresh.remove({ userId: user._id, clientId: client.id });

      const tokenStr = crypto.randomBytes(32).toString('base64');
      const refreshTokenStr = crypto.randomBytes(32).toString('base64');

      await (new Token({
        token: tokenStr,
        clientId: client.id,
        userId: user._id,
      })).save();

      await (new Refresh({
        token: refreshTokenStr,
        clientId: client.id,
        userId: user._id,
      })).save();

      return done(null, tokenStr, refreshTokenStr, {
        expires_in: app.config.security.token_life,
        scope: '*',
      });
    }));

    server.exchange(oauth2orize.exchange.refreshToken(async (client, refreshToken, scope, done) => {
      const refresh = await Refresh.findOne({ token: refreshToken });

      if (!refresh) {
        return done(null, false);
      }

      const user = await User.findById(refresh.userId);
      if (!user) {
        return done(null, false);
      }
      await Refresh.remove({
        userId: user._id,
        clientId: client.id,
      });

      const tokenStr = crypto.randomBytes(32).toString('base64');
      const refreshTokenStr = crypto.randomBytes(32).toString('base64');


      await (new Token({
        token: tokenStr,
        clientId: client.id,
        userId: user._id,
      })).save();

      await (new Refresh({
        token: refreshTokenStr,
        clientId: client.id,
        userId: user._id,
      })).save();

      return done(null, tokenStr, refreshTokenStr, {
        expires_in: app.config.security.token_life,
        scope: '*',
      });
    }));
  }

  @web.post('/token', [
    isClientAuthenticated,
    server.token(),
  ])
  token(req, res, next) {
    server.errorHandler()(req, res, next);
  }
}

module.exports = oAuth2Controller;
