import mongoose from 'mongoose';

export const connect = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/tiktok_dev');
    console.log('connect success');
  } catch (e) {
    console.log('connect failed', e);
  }
};
