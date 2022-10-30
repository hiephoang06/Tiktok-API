import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Video = new Schema({
  videoUrl: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }
});

export default mongoose.model('Video', Video);
