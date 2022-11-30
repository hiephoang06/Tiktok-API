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
    const dateTime = Date.now() + '.gif';
    const profileId = req.user._id;
    if (file.mimetype === 'video/mp4') {
      new ffmpeg({ source: videosDestination + file.filename })
        .withAspect('16:9')
        .withFps(90)
        .setDuration(2)
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
      author: mongodb.ObjectId(profileId)
    });
    res.json(file);
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

  getPostedVideo = async (req, res) => {
    const user = req.user;
    const result = await VideoModel.aggregate([
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
      { $match: { author: mongoose.Types.ObjectId(user._id) } }
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
