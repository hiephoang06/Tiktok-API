import ProfileModel from '../models/Profile.js';
import { loginToken } from '../auth/auth.method.js';
class LoginController {
  login = async (req, res, next) => {
    const { userID, name, imgURL, provider } = req.body;
    const checkExist = await ProfileModel.findOne({ userID }, { avatarLarger: 1, nickName: 1, userID: 1 });
    if (!checkExist) {
      const uniqueName = 'user' + makeId(11);
      const result = await ProfileModel.create({
        userID,
        avatarLarger: imgURL,
        nickName: name,
        uniqueId: uniqueName,
        provider
      });
    }
  };
}

function makeId(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default new LoginController();
