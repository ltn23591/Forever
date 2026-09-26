import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  mongodbUrl: process.env.MONGODB_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@forever.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_SECRET_KEY || '',
  },
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  currency: 'inr',
  deliveryCharge: 10,
};

export default config;
