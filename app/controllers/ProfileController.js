import ProfileModel from '../models/Profile.js';
import VideoModel from '../models/Video.js';
import FollowModel from '../models/Follow.js';
import LikeModel from '../models/Like.js';
import mongoose from 'mongoose';
import Like from '../models/Like.js';
import { ObjectId } from 'mongodb';
class ProfileController {
  getProfiles = async (req, res) => {
    const profiles = await ProfileModel.find();
    res.json(profiles);
  };

  getProfileAuth = async (req, res) => {
    const id = req.params?.id;
    const user = req.user._id;
    const [profile, following, follower, totalLikes, isFollowed] = await Promise.all([
      ProfileModel.findById(id),
      FollowModel.count({ followingId: id }),
      FollowModel.count({ followerId: id }),
      LikeModel.count({ videoId: { $in: await VideoModel.distinct('_id', { author: id }) } }),
      FollowModel.find({
        followingId: { $in: await ProfileModel.distinct('_id', { _id: user }) },
        followerId: { $in: await ProfileModel.distinct('_id', { _id: id }) }
      }).count()
    ]);
    if (!profile) return res.status(400).json({ error: 'not found' });
    res.json({ profile, following, follower, totalLikes, isFollowed: isFollowed === 0 ? false : true });
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
    await FollowModel.create({ followingId, followerId });
    res.json({ status: 'follow' });
  };

  getFollowingAuth = async (req, res) => {
    const id = req.user._id;
    const followingId = await FollowModel.distinct('followerId', { followingId: id });
    const following = await ProfileModel.find({ _id: { $in: followingId } });

    const result = await Promise.all(
      following.map(async (p) => {
        return {
          profile: p,
          isFollowMe: (await FollowModel.count({ followerId: id, followingId: p._id })) == 1,
          isFollowing: (await FollowModel.count({ followerId: p._id, followingId: id })) == 1
        };
      })
    );

    res.json(result);
  };

  getFollowing = async (req, res) => {
    const profileId = req.params.id;
    const id = req.user.id;
    const followingsId = await FollowModel.distinct('followerId', { followingId: profileId });
    const following = await ProfileModel.find({ _id: { $in: followingsId } });

    const result = await Promise.all(
      following.map(async (p) => {
        return {
          profile: p,
          isFollowMe: (await FollowModel.count({ followerId: id, followingId: p._id })) == 1,
          isFollowing: (await FollowModel.count({ followerId: p._id, followingId: id })) == 1
        };
      })
    );

    res.json(result);
  };

  getFollowerAuth = async (req, res) => {
    const id = req.user.id;
    const followersId = await FollowModel.distinct('followingId', { followerId: id });
    const followers = await ProfileModel.find({ _id: { $in: followersId } });

    const result = await Promise.all(
      followers.map(async (p) => {
        return {
          profile: p,
          isFollowMe: (await FollowModel.count({ followerId: id, followingId: p._id })) == 1,
          isFollowing: (await FollowModel.count({ followerId: p._id, followingId: id })) == 1
        };
      })
    );

    res.json(result);
  };

  getFollower = async (req, res) => {
    const profileId = req.params.id;
    const id = req.user.id;
    const followersId = await FollowModel.distinct('followingId', { followerId: profileId });
    const followers = await ProfileModel.find({ _id: { $in: followersId } });

    const result = await Promise.all(
      followers.map(async (p) => {
        return {
          profile: p,
          isFollowMe: (await FollowModel.count({ followerId: id, followingId: p._id })) == 1,
          isFollowing: (await FollowModel.count({ followerId: p._id, followingId: id })) == 1
        };
      })
    );

    res.json(result);
  };

  editProfile = async (req, res) => {
    const id = req.user._id;
    const { nickName, uniqueId, bio } = req.body;

    await ProfileModel.findOneAndUpdate({ _id: id }, { nickName, uniqueId, bio });

    res.json({ status: true });
  };

  editAvatar = async (req, res) => {
    const file = req.file;
    const id = req.user._id;

    await ProfileModel.findOneAndUpdate({ _id: id }, { avatarLarger: file.filename });
    res.json({ status: true });
  };
}
export default new ProfileController();
