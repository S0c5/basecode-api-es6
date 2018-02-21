
// Load required packages
import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { Strategy as ClientPasswordStrategy } from 'passport-oauth2-client-password';
import { User, Client, Token } from '../models';


passport.use(new BasicStrategy(((clientId, clientSecret, done) => Client.findOne({ id: clientId }, (err, client) => {
  if (err) {
    return done(err);
  }
  if (!client) {
    return done(null, false);
  }
  if (client.secret !== clientSecret) {
    return done(null, false);
  }
  done(null, client);
}))));
passport.use(new ClientPasswordStrategy(((clientId, clientSecret, done) => {
  Client.findOne({ id: clientId }, (err, client) => {
    if (err) {
      done(err);
    }
    if (!client) {
      return done(null, false);
    }
    if (client.secret !== clientSecret) {
      return done(null, false);
    }
    done(null, client);
  })
})));

passport.use(new BearerStrategy(((token, done) => Token.findOne({ token }, (err, accessToken) => {
  if (err) return done(err);
  if (!accessToken) {
    return done(null, false);
  }
  if (accessToken.expires <= new Date()) {
    return Token.remove({ token }, (err) => {
      if (err) return done(err);
      return done(null, false, { message: 'Token expired' });
    });
  }
  User.findById(accessToken.userId, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'User not found' });
    return done(null, user, { scope: '*' });
  });
}))));


module.exports = {
  isClientAuthenticated: passport.authenticate(['oauth2-client-password'], { session: false }),
  isAuthBearer: passport.authenticate('bearer', { session: false }),
  isAuth: passport.authenticate(['basic', 'bearer'], { session: false }),
};

