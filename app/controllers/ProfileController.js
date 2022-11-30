import ProfileModel from '../models/Profile.js';
import VideoModel from '../models/Video.js';
import FollowModel from '../models/Follow.js';
import LikeModel from '../models/Like.js';
import mongoose from 'mongoose';
import Like from '../models/Like.js';
class ProfileController {
  getProfiles = async (req, res) => {
    const profiles = await ProfileModel.find();
    res.json(profiles);
  };

  getProfile = async (req, res) => {
    const id = req.params?.id;
    const [profile, following, follower, totalLikes] = await Promise.all([
      ProfileModel.findById(id),
      FollowModel.count({ followingId: id }),
      FollowModel.count({ followerId: id }),
      LikeModel.count({ videoId: { $in: await VideoModel.distinct('_id', { author: id }) } })
    ]);
    if (!profile) return res.status(400).json({ error: 'not found' });
    res.json({ profile, following, follower, totalLikes });
  };

  getMyProfile = async (req, res) => {
    const user = req.user._id;

    const [profile, following, follower, totalLikes] = await Promise.all([
      ProfileModel.findById(user),
      FollowModel.count({ followingId: user }),
      FollowModel.count({ followerId: user }),
      LikeModel.count({ videoId: { $in: await VideoModel.distinct('_id', { author: user }) } })
    ]);

    res.json({ profile, following, follower, totalLikes });
  };

  followUser = async (req, res) => {
    const followerId = req.params.id;
    const followingId = req.user._id;
    const isFollowed = await FollowModel.findOne({ followingId, followerId });
    if (isFollowed) {
      await FollowModel.deleteOne({ _id: isFollowed._id });
      return res.json({ status: 'unfollow' });
    }
    await FollowModel.create({ profileId, userId });
    res.json({ status: 'follow' });
  };

  getFollowingAuth = async (req, res) => {
    const id = req.user._id;
    const following = await FollowModel.distinct('followerId', { followingId: id });
    const result = await ProfileModel.find({ _id: { $in: following } });

    res.json(result);
  };

  getFollowerAuth = async (req, res) => {
    const id = req.user._id;
    const follower = await FollowModel.distinct('followingId', { followerId: id });
    const result = await ProfileModel.find({ _id: { $in: follower } });

    res.json(result);
  };

  // getLikesVideoAuth = async (req, res) => {
  //   const id = req.user._id;
  //   const videos = await VideoModel.find({ author: mongoose.Types.ObjectId('63661a114a730c0df8228458') });

  //   const result = await Promise.all(
  //     videos.map(async (v) => {
  //       return {
  //         _id: v._id,
  //         like: await Like.count({ videoId: v._id })
  //       };
  //     })
  //   );
  //   res.json(result);
  // };

  editProfile = async (req, res) => {
    const id = req.user._id;
    const { avatarLarger, nickName, uniqueId } = req.body;

    await ProfileModel.findOneAndUpdate({ _id: id }, { avatarLarger, nickName, uniqueId });

    res.json({ status: true });
  };
}
export default new ProfileController();
