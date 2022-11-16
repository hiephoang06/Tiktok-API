import VideoModel from '../models/Video.js';
import CommentModel from '../models/Comment.js';
import ProfileModel from '../models/Profile.js';
import LikeModel from '../models/Like.js';
import mongodb from 'mongodb';
class VideoController {
  getVideos = async (req, res) => {
    const videos = await VideoModel.aggregate([
      {
        $lookup: {
          from: 'profiles',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'videoId',
          as: 'likes'
        }
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'videoId',
          as: 'comments'
        }
      },
      {
        $project: {
          videoUrl: 1,
          author: 1,
          likeCount: {
            $size: '$likes'
          },
          commentCount: {
            $size: '$comments'
          }
        }
      },
      { $sample: { size: 10 } }
    ]);

    res.json(videos);
  };

  uploadVideo = async (req, res) => {
    const file = req.file;
    const profileId = req.user._id;
    const result = await VideoModel.create({ videoUrl: file.filename, author: mongodb.ObjectId(profileId) });
    res.json(result);
  };

  likeVideo = async (req, res) => {
    const videoId = req.params.id;
    const profileId = req.user._id;
    const isLiked = await LikeModel.findOne({ videoId, profileId });
    if (isLiked) {
      await LikeModel.deleteOne({ _id: isLiked._id });
      return res.json({ status: 'unlike' });
    }
    await LikeModel.create({ videoId, profileId });
    res.json({ status: 'like' });
  };

  getLikedVideos = async (req, res) => {
    const user = req.user;
    // const likedvideos = await LikeModel.find({ profileId: user._id });
    const result = await LikeModel.aggregate([
      {
        $lookup: {
          from: 'videos',
          localField: 'videoId',
          foreignField: '_id',
          as: 'videoId'
        }
      },
      { $unwind: '$videoId' },
      {
        $match: { profileId: user._id }
      }
    ]);
    res.json(result);
  };
}
export default new VideoController();
