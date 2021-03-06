import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'asdf';

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';
  
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // build a jwt payload: { id, email }
  const payload = {
    id: id || mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };

  // create jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build session object: { jwt: MY_JWT }
  const session = { jwt: token };

  // turn the session into JSON
  const sessionJSON = JSON.stringify(session);

  // encode JSON into base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return string with encoded data
  return [`express:sess=${base64}`];
};