import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URL must be defined');
  }
  
  try {
    await natsWrapper.connect('ticketing', 'asdf', 'http://nats-srv:4222');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  } catch(err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000')
  })
}

start();