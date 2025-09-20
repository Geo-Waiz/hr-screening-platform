import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import testRoutes from './routes/test.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - FIXED for credentials
const corsOptions = {
  origin: [
    'https://app.waiz.cl',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With', 
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control'
  ],
  exposedHeaders: ['set-cookie']
};

app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.waiz.cl"]
    }
  }
}));

app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/auth', authRoutes);
app.use('/api/test', testRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    cors: 'enabled'
  });
});

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'HR Screening API is running!',
    version: '2.0.0',
    endpoints: {
      health: '/health',
      auth: '/auth/*',
      test: '/api/test/db-test'
    },
    cors: 'configured for app.waiz.cl'
  });
});

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: { message: 'Route not found' }
  });
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: { message: 'Internal server error' }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 CORS enabled for: ${corsOptions.origin.join(', ')}`);
});

export default app;
