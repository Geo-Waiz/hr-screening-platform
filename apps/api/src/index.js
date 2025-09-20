const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

// Updated CORS configuration to allow your frontend
app.use(cors({
  origin: [
    'https://app.waiz.cl',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('combined'));
app.use(express.json());

// Import routes
try {
  const authRoutes = require('./routes/auth');
  const candidateRoutes = require('./routes/candidates');
  const socialProfileRoutes = require('./routes/socialProfiles');
  const screeningRoutes = require('./routes/screenings');
  
  app.use('/api/auth', authRoutes);
  app.use('/api/candidates', candidateRoutes);
  app.use('/api/social-profiles', socialProfileRoutes);
  app.use('/api/screenings', screeningRoutes);
  
  console.log('All routes loaded successfully');
} catch (error) {
  console.log('Route loading error:', error);
}

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

app.get('/api/models', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const companyCount = await prisma.company.count();
    const userCount = await prisma.user.count();
    const candidateCount = await prisma.candidate.count();
    const socialProfileCount = await prisma.socialProfile.count();
    const screeningCount = await prisma.screening.count();
    
    res.json({
      success: true,
      tables: {
        companies: companyCount,
        users: userCount,
        candidates: candidateCount,
        socialProfiles: socialProfileCount,
        screenings: screeningCount
      },
      message: 'Database schema is working'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/', (req, res) => {
  res.json({
    message: 'HR Screening API is running!',
    version: '2.0.0',
    endpoints: {
      health: '/health',
      models: '/api/models',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      candidates: {
        list: 'GET /api/candidates',
        create: 'POST /api/candidates',
        get: 'GET /api/candidates/:id',
        update: 'PUT /api/candidates/:id',
        delete: 'DELETE /api/candidates/:id'
      },
      socialProfiles: {
        getForCandidate: 'GET /api/social-profiles/candidate/:candidateId',
        create: 'POST /api/social-profiles/candidate/:candidateId',
        update: 'PUT /api/social-profiles/:profileId',
        delete: 'DELETE /api/social-profiles/:profileId'
      },
      screenings: {
        analyze: 'POST /api/screenings/candidate/:candidateId/analyze',
        getForCandidate: 'GET /api/screenings/candidate/:candidateId',
        getDetails: 'GET /api/screenings/:screeningId'
      }
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { message: 'Route not found' }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
