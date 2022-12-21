import CommentModel from '../models/Comment.js';
import mongodb, { ObjectId } from 'mongodb';
class CommentController {
  postComment = async (req, res) => {
    const videoId = req.params.id;
    const message = req.body.message;
    const profileId = req.user._id;
    CommentModel.create({ message, videoId, profileId });
    res.json({ status: true });
  };

  getComments = async (req, res) => {
    const videoId = req.params.id;
    const comments = await CommentModel.aggregate([
      {
        $match: { videoId: ObjectId(videoId) }
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'profileId',
          foreignField: '_id',
          as: 'author',
          pipeline: [
            {
              $project: {
                avatarLarger: 1,
                nickName: 1
              }
            }
          ]
        }
      },
      { $unwind: '$author' }
    ]);

    res.json(comments);
  };
}
export default new CommentController();
