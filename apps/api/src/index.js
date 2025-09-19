const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Import routes
try {
  const authRoutes = require('./routes/auth');
  const candidateRoutes = require('./routes/candidates');
  
  app.use('/api/auth', authRoutes);
  app.use('/api/candidates', candidateRoutes);
} catch (error) {
  console.log('Some routes not available yet:', error.message);
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
