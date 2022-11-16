import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userProfile = new Schema({
  avatarLarger: String,
  nickName: String,
  uniqueId: String,
  userID: String,
  provider: String
});

export default mongoose.model('Profile', userProfile);
