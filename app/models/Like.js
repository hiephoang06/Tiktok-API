import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Like = new Schema(
  {
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }
  },
  {
    timestamps: {
      createdAt: 'created_at'
    }
  }
);

export default mongoose.model('Like', Like);
