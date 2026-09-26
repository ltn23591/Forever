import mongoose from 'mongoose';
import config from './index';

export const connectDB = async (): Promise<void> => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('MongoDB Connected successfully');
    });
    await mongoose.connect(config.mongodbUrl);
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};
