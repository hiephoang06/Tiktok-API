import passport from 'passport';
import { Strategy } from 'passport-facebook';
import jwt from 'jsonwebtoken';
import ProfileModel from '../models/Profile.js';
import os from 'os';
export const strategyFB = () => {
  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });

  passport.use(
    new Strategy(
      {
        clientID: process.env.API_KEY,
        clientSecret: process.env.API_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        profileFields: ['id', 'displayName', 'photos', 'email']
      },
      async function (accessToken, refreshToken, profile, done) {
        const { _json, provider, id, displayName } = profile;
        const checkExist = await ProfileModel.findOne({ userID: id }, { avatarLarger: 1, nickName: 1, userID: 1 });
        if (!checkExist) {
          const uniqueName = 'user' + makeId(11);
          const result = await ProfileModel.create({
            userID: id,
            avatarLarger: _json.picture.data.url,
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

export function makeId(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
