import mongodb, { ObjectId } from 'mongodb';
import ProfileModel from '../models/Profile.js';
import FollowModel from '../models/Follow.js';
import ChatModel from '../models/Chat.js';
class ChatController {
  getListUser = async (req, res) => {
    const id = req.user._id;
    const followingId = await FollowModel.distinct('followerId', { followingId: id });
    const following = await ProfileModel.find({ _id: { $in: followingId } });

    const result = await Promise.all(
      following.map(async (profile) => {
        const isFollowMe = (await FollowModel.count({ followerId: id, followingId: profile._id })) == 1;
        const isFollowing = (await FollowModel.count({ followerId: profile._id, followingId: id })) == 1;
        if (isFollowMe === isFollowing) return profile;
      })
    );
    res.json(result.filter((n) => n));
  };

  sendMessage = async (req, res) => {
    const senderId = req.user._id;
    const receiverId = req.body.id;
    const message = req.body.message;
    await ChatModel.create({ message, senderId, receiverId });
    res.json({ status: 'success' });
  };
}
export default new ChatController();
