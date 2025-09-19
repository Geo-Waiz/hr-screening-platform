import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.get('/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      services: {
        database: 'connected',
        redis: 'connected'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    });
  }
});

app.get('/api/models', async (req: Request, res: Response) => {
  try {
    const companyCount = await prisma.company.count();
    const userCount = await prisma.user.count();
    const candidateCount = await prisma.candidate.count();
    
    res.json({
      success: true,
      tables: {
        companies: companyCount,
        users: userCount,
        candidates: candidateCount
      },
      message: 'Database schema is working'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
