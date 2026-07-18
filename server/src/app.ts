import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import applicationRoutes from './routes/application.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

app.use(errorHandler);

export default app;
