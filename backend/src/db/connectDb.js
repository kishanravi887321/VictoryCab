import 'dotenv/config';
import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/victorycab';
const dbName = process.env.MONGODB_DB;

let client;
let database;

export async function connectDb() {
  try {
    client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 3000 });
    await client.connect();
    database = client.db(dbName);
    console.log(`MongoDB connected: ${database.databaseName}`);
    return database;
  } catch (error) {
    await client?.close().catch(() => {});
    client = undefined;
    if (error.code === 18 || /authentication failed|bad auth/i.test(error.message)) {
      console.error('MongoDB authentication failed. Check the database username, password, and encoded special characters in MONGODB_URI.');
    } else {
      console.error(`MongoDB unavailable: ${error.message}`);
    }
    throw error;
  }
}

export function getDb() {
  if (!database) throw new Error('MongoDB is not connected');
  return database;
}

export async function closeDb() {
  if (client) await client.close();
}
