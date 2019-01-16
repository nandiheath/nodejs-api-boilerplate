module.exports = {
  ENV: process.env.ENV || 'dev',
  JWT_SECRET: process.env.JWT_SECRET || 'random_secret',
  LOGGER_LEVEL: process.env.LOGGER_LEVEL || 'debug',
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  MONGODB_HOST: process.env.MONGODB_HOST || '',
  MONGODB_DATABASE: process.env.MONGODB_DATABASE || 'oibs-store',
  MONGODB_USER: process.env.MONGODB_USER || '',
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD || '',
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || '',
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET || '',
};
