import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import apiRoutes from './api';
import { errorHandler } from './middleware/error.middleware';

const app: Application = express();

// HTTP Request Logger
app.use(morgan('dev'));

// CORS Configuration
app.use(cors());

// Express Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('API is healthy');
});

// API Routes (Mounted under /api)
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
