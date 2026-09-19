import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import apiRoutes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.get('/api/health', (request, response) => response.json({ success: true, message: 'QuickTrip API is healthy' }));
app.use('/api', apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;