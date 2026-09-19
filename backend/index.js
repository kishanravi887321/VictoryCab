import { connectDb } from './src/db/connectDb.js';
import app from './src/app.js';

const PORT = process.env.PORT || 5000;

await connectDb();

app.listen(PORT, () => {
	console.log(`QuickTrip API running on port ${PORT}`);
});