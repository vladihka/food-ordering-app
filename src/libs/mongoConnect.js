import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URL;
if (!uri) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URL"');
}

const options = {};
let clientPromise;

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
