import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import ProfileModel from '../models/Profile.js';
export const strategyGG = () => {
  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });

  passport.deserializeUser((id, done) => {
    done(null, id);
  });

  passport.use(
    new Strategy(
      {
        clientID: process.env.API_KEY_GOOGLE,
        clientSecret: process.env.API_SECRET_GOOGLE,
        callbackURL: process.env.CALLBACK_URL_GOOGLE,
        scope: ['profile', 'email']
      },
      async function (accessToken, refreshToken, profile, done) {
        const { _json, provider, id, displayName } = profile;
        const checkExist = await ProfileModel.findOne({ userID: id }, { avatarLarger: 1, nickName: 1, userID: 1 });
        if (!checkExist) {
          const uniqueName = 'user' + makeId(11);
          const result = await ProfileModel.create({
            userID: id,
            avatarLarger: _json.picture,
            nickName: displayName,
            uniqueId: uniqueName,
            provider
          });
          return done(null, result);
        }
        return done(null, checkExist);
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
