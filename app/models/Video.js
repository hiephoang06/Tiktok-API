import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Video = new Schema(
  {
    videoUrl: String,
    gifUrl: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    desc: String | undefined
  },
  {
    timestamps: {
      createdAt: 'created_at'
    }
  }
);

export default mongoose.model('Video', Video);
