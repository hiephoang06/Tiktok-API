import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Follow = new Schema(
  {
    followerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    followingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }
  },
  {
    timestamps: {
      createdAt: 'created_at'
    }
  }
);

export default mongoose.model('Follow', Follow);
