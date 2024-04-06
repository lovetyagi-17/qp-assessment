import mongoose from 'mongoose';
import config from '../config';


mongoose.connection.on('error', err => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

mongoose.connection.on('connected', () => {
  console.info('MongoDB Connected...');
});

const connectMongo = () => {


  if (config.NODE_ENV == 'development') {
    mongoose.set('debug', true);
    mongoose.connect(config.MONGO_URI);
  } else {
    mongoose.connect(
      `mongodb://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_HOST}:${config.MONGO_PORT}/${config.MONGO_NAME}?authSource=admin`
    );
  }

  return mongoose.connection;
};

export default connectMongo;
