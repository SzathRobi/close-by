import { MongoClient } from 'mongodb';

const URI = process.env.MONGO_URI;
const options = {};

if (!URI)
	throw new Error('Please add the database URI to the env file variables');

let client = new MongoClient(URI, options);
let clientPromise;

if (process.env.NODE_ENV !== 'production') {
	if (!global._mongoClientPromise) {
		global._mongoClientPromise = client.connect();
	}

	clientPromise = global._mongoClientPromise;
} else {
	clientPromise = client.connect();
}

export default clientPromise;
