import mongoose from 'mongoose';

export const connect = async () => {
  try {
    const url = 'mongodb+srv://kugon_2001:minhHiep1009@cluster0.ggrhtyq.mongodb.net/tiktok_dev';
    await mongoose.connect(url);
    console.log('connect success');
  } catch (e) {
    console.log('connect failed', e);
  }
};
