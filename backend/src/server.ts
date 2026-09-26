import app from './app';
import config from './config';
import { connectDB } from './config/db.config';
import { connectCloudinary } from './config/cloudinary.config';

const startServer = async () => {
  try {
    await connectDB();
    connectCloudinary();

    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port} [${config.env}]`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
