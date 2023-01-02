import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import ProfileModel from '../models/Profile.js';
import { makeId } from './StrategyFB.js';

const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

export const generateToken = async (payload, secretSignature, tokenLife) => {
  try {
    return await sign(
      {
        payload
      },
      secretSignature,
      {
        algorithm: 'HS256',
        expiresIn: tokenLife
      }
    );
  } catch (error) {
    console.log(`Error in generate access token:  + ${error}`);
    return null;
  }
};

export const verifyToken = async (token, secretKey) => {
  try {
    return await verify(token, secretKey);
  } catch (error) {
    console.log(`Error in verify access token:  + ${error}`);
    return null;
  }
};

export const decodeToken = async (token, secretKey) => {
  try {
    return await verify(token, secretKey, {
      ignoreExpiration: true
    });
  } catch (error) {
    console.log(`Error in decode token:  + ${error}`);
    return null;
  }
};

export const isAuth = async (req, res, next) => {
  try {
    const accessTokenFromHeader = req.headers.authorization.split(' ')[1];

    if (!accessTokenFromHeader) return res.status(401).send({ message: 'Không tìm thấy access token' });

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    const verified = await verifyToken(accessTokenFromHeader, accessTokenSecret);

    if (!verified) return res.status(401).send({ message: 'Bạn không đủ quyền truy cập vào tính năng này' });

    const userID = verified.payload.userID;

    const checkExist = await ProfileModel.findOne({ userID });

    req.user = checkExist;
    return next();
  } catch (error) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
};

export const loginToken = async (req, res, next) => {
  const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const user = req?.user;

  const dataForAccessToken = {
    nickName: user.nickName,
    userID: user.userID
  };

  const accessToken = await generateToken(dataForAccessToken, accessTokenSecret, accessTokenLife);

  return res.json({ accessToken });
};

export const postInfo = async (req, res, next) => {
  // SECRET decode => compare
  const { userID, name: displayName, imgURL, provider } = req.body;

  const checkExist = await ProfileModel.findOne(
    { userID: userID },
    { avatarLarger: 1, nickName: 1, userID: 1, bio: 1, uniqueId: 1 }
  );
  const dataForAccessToken = {
    nickName: displayName,
    userID: userID
  };

  const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const accessToken = await generateToken(dataForAccessToken, accessTokenSecret, accessTokenLife);

  if (!checkExist) {
    const uniqueName = 'user' + makeId(11);
    const result = await ProfileModel.create({
      userID,
      avatarLarger: imgURL,
      nickName: displayName,
      uniqueId: uniqueName,
      provider
    });

    return res.json({ accessToken, profile: result });
  }

  return res.json({ accessToken, profile: checkExist });
};
