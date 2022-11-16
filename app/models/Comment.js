import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Comment = new Schema(
  {
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    message: String,
    replies: [this] | undefined
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export default mongoose.model('Comment', Comment);
