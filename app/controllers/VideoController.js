import Video from '../models/Video.js';
import VideoModel from '../models/Video.js';
import mongodb from 'mongodb';
class VideoController {
  getVideos = async (req, res) => {
    // const videos = await VideoModel.find();
    const videos = await VideoModel.aggregate([
      {
        $lookup: {
          from: 'profiles',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' }
    ]);
    res.json(videos);
  };

  uploadVideo = async (req, res) => {
    const file = req.file;
    // const {profileId} = req.user.id
    const profileId = '635cf134cfacab44d2de095c';
    // const videos = await VideoModel.find();
    const result = await VideoModel.create({ videoUrl: file.filename, author: mongodb.ObjectId(profileId) });
    res.json(result);
  };
}
export default new VideoController();
