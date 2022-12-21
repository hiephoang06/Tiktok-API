import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Chat = new Schema(
  {
    message: String,
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }
  },
  {
    timestamps: {
      createdAt: 'created_at'
    }
  }
);

export default mongoose.model('Chat', Chat);
