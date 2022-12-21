import VideoModel from '../models/Video.js';
import CommentModel from '../models/Comment.js';
import ProfileModel from '../models/Profile.js';
import LikeModel from '../models/Like.js';
import mongodb from 'mongodb';
import ffmpeg from 'fluent-ffmpeg';
import mongoose from 'mongoose';

const videosDestination = './public/videos/';
const gifsDestination = './public/gifs/';
class VideoController {
  getVideos = async (req, res) => {
    const page = req.query.page || 1;
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
          gifUrl: 1,
          author: 1,
          desc: 1,
          likeCount: {
            $size: '$likes'
          },
          commentCount: {
            $size: '$comments'
          }
        }
      },
      { $sample: { size: 50 } },
      { $skip: page * 5 },
      { $limit: 5 }
    ]);

    res.json(videos);
  };

  uploadVideo = async (req, res) => {
    const file = req.file;
    const desc = req.body.desc;
    const dateTime = Date.now() + '.gif';
    const profileId = req.user._id;
    if (file.mimetype === 'video/mp4') {
      new ffmpeg({ source: videosDestination + file.filename })
        .withAspect('16:9')
        .withFps(90)
        .setDuration(1)
        .toFormat('gif')
        .on('error', (err) => console.log('error', err))
        .on('end', (err) => {
          if (!err) return console.log('conversion done');
        })
        .saveToFile(gifsDestination + dateTime);
    }
    await VideoModel.create({
      videoUrl: file.filename,
      gifUrl: dateTime,
      desc: desc,
      author: mongodb.ObjectId(profileId)
    });
    res.json({ status: 'success' });
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
    const user = req.user._id;

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
        $match: { profileId: user }
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'videoId.author',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      {
        $lookup: {
          from: 'likes',
          localField: 'videoId._id',
          foreignField: 'videoId',
          as: 'likes'
        }
      },
      {
        $lookup: {
          from: 'comments',
          localField: 'videoId._id',
          foreignField: 'videoId',
          as: 'comments'
        }
      },
      {
        $group: {
          _id: '$videoId._id',
          videoUrl: { $first: '$videoId.videoUrl' },
          gifUrl: { $first: '$videoId.gifUrl' },
          author: { $first: '$author' },
          likes: { $first: '$likes' },
          comments: { $first: '$comments' },
          updatedAt: { $first: '$updatedAt' }
        }
      },
      {
        $sort: { updatedAt: -1 }
      },
      {
        $project: {
          _id: 1,
          videoUrl: 1,
          gifUrl: 1,
          author: 1,
          updatedAt: 1,
          likeCount: {
            $size: '$likes'
          },
          commentCount: {
            $size: '$comments'
          }
        }
      }
    ]);

    res.json(result);
  };

  getPostedVideo = async (req, res) => {
    const id = req.user._id;
    const result = await VideoModel.aggregate([
      { $match: { author: mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'profiles',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
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
      { $unwind: '$author' },
      {
        $project: {
          _id: 1,
          videoUrl: 1,
          gifUrl: 1,
          author: 1,
          likeCount: {
            $size: '$likes'
          },
          commentCount: {
            $size: '$comments'
          }
        }
      }
    ]);

    res.json(result);
  };

  getOtherVideos = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'profile invalid' });
    const profile = await VideoModel.aggregate([
      {
        $lookup: {
          from: 'profiles',
          localField: 'author',
          foreignField: '_id',
          as: 'video'
        }
      },
      {
        $project: {
          gifUrl: 1,
          author: 1
        }
      },
      { $match: { author: mongoose.Types.ObjectId(id) } }
    ]);
    res.json(profile);
  };
}
export default new VideoController();
