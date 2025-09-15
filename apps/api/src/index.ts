import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDatabase } from './lib/database';
import { connectRedis } from './lib/redis';
import authRoutes from './routes/auth.routes';
import candidateRoutes from './routes/candidate.routes';
import { generalLimiter } from './middleware/rateLimiter.middleware';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://api.waiz.cl', 'https://waiz.cl'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Apply general rate limiting
app.use(generalLimiter);

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  let dbStatus = false;
  let redisStatus = false;

  try {
    const { prisma } = await import('./lib/database');
    await prisma.$connect();
    dbStatus = true;
  } catch (error) {
    console.log('Database check failed:', error instanceof Error ? error.message : 'Unknown error');
  }

  try {
    const { redis } = await import('./lib/redis');
    await redis.ping();
    redisStatus = true;
  } catch (error) {
    console.log('Redis check failed:', error instanceof Error ? error.message : 'Unknown error');
  }
  
  res.json({ 
    status: dbStatus && redisStatus ? 'OK' : 'PARTIAL',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    services: {
      database: dbStatus ? 'connected' : 'disconnected',
      redis: redisStatus ? 'connected' : 'disconnected'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'HR Screening API is running!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      candidates: '/api/candidates'
    }
  });
});

// Error handling
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: { message: 'Route not found', path: req.path }
  });
});

// Global error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: { 
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    }
  });
});

async function startServer() {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Database URL: ${process.env.DATABASE_URL}`);
    console.log(`🔗 Redis URL: ${process.env.REDIS_URL}`);
    
    connectDatabase().catch(err => {
      console.log('Database connection failed, but server still running');
    });
    
    connectRedis().catch(err => {
      console.log('Redis connection failed, but server still running');
    });
  });
}

startServer();
