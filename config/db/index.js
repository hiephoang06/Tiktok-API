import mongoose from 'mongoose';

export const connect = () => {
  try {
    const url = 'mongodb+srv://kugon_2001:minhHiep1009@cluster0.ggrhtyq.mongodb.net/tiktok_dev?retryWrites=true&w=majority';
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('connect success');
  } catch (e) {
    console.log('connect failed', e);
  }
};
