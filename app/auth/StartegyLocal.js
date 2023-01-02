import passport from 'passport';
import { Strategy } from 'passport-local';
export const strategyLocal = () => {
  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });

  passport.use(
    new Strategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: ''
      },
      function (req, email, password, done) {
        console.log(email);
        done(null, { email, password });
      }
    )
  );
};

function makeId(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
