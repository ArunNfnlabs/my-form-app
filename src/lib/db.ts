import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const options = {};

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const client = new MongoClient(uri, options);
const clientPromise = client.connect();

export default clientPromise;