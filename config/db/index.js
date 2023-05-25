import mongoose from 'mongoose';

export const connect = async () => {
  try {
    const url = 'mongodb://127.0.0.1:27017/tiktok_dev';
    await mongoose.connect(url);
    console.log('connect success');
  } catch (e) {
    console.log('connect failed', e);
  }
};
