import 'dotenv/config';
import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';

let client;
let database;

export async function connectDb() {
	try {
		client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 3000 });
		await client.connect();
		database = client.db();
		console.log(`MongoDB connected: ${database.databaseName}`);
		return database;
	} catch (error) {
		await client?.close().catch(() => {});
		client = undefined;
		if (error.code === 18 || /authentication failed|bad auth/i.test(error.message)) {
			console.error('MongoDB authentication failed. Check the database username, password, and encoded special characters in MONGODB_URI.');
		} else {
			console.warn(`MongoDB unavailable: ${error.message}`);
		}
		console.warn('The API is running with its temporary in-memory store.');
		return null;
	}
}

export function getDb() {
	if (!database) throw new Error('MongoDB is not connected');
	return database;
}

export async function closeDb() {
	if (client) await client.close();
}