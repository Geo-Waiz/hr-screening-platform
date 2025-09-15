import { Router, Request, Response } from 'express';
//import { prisma } from '../lib/database';
//import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';
//import { authLimiter } from '../middleware/rateLimiter.middleware';
//import { UserRole } from '@prisma/client';
//import jwt from 'jsonwebtoken';
//import bcrypt from 'bcryptjs';
//import { z } from 'zod';

const router = Router();

router.get('/test', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Minimal auth routes working!',
    timestamp: new Date().toISOString()
  });
});

export default router;

// Validation schemas
const createCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(100, 'Company name too long'),
  domain: z.string().min(1, 'Domain is required').max(100, 'Domain too long'),
  adminEmail: z.string().email('Invalid email format'),
  adminPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  adminFirstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  adminLastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Apply rate limiting to auth routes
router.use(authLimiter);

// Create company and admin user
router.post('/create-company', async (req: Request, res: Response) => {
  try {
    const validatedData = createCompanySchema.parse(req.body);
    
    // Check if company domain already exists
    const existingCompany = await prisma.company.findUnique({
      where: { domain: validatedData.domain }
    });
    
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        error: { message: 'Company with this domain already exists' }
      });
    }

    // Check if admin email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.adminEmail }
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { message: 'User with this email already exists' }
      });
    }

    // Create company and admin user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create company first
      const company = await tx.company.create({
        data: {
          name: validatedData.name,
          domain: validatedData.domain,
        }
      });

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.adminPassword, 12);

      // Create admin user
      const adminUser = await tx.user.create({
        data: {
          email: validatedData.adminEmail,
          password: hashedPassword,
          firstName: validatedData.adminFirstName,
          lastName: validatedData.adminLastName,
          companyId: company.id,
          role: UserRole.ADMIN,
        }
      });

      return { company, adminUser };
    });

    // Generate tokens
    const accessToken = jwt.sign(
      {
        userId: result.adminUser.id,
        email: result.adminUser.email,
        role: result.adminUser.role,
        companyId: result.adminUser.companyId,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: result.adminUser.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: result.adminUser.id,
        expiresAt,
      }
    });

    const { password, ...sanitizedUser } = result.adminUser;

    res.status(201).json({
      success: true,
      message: 'Company and admin user created successfully',
      data: {
        company: result.company,
        user: sanitizedUser,
        accessToken,
        refreshToken,
      }
    });
  } catch (error) {
    console.error('Create company error:', error);
    
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            domain: true,
            isActive: true,
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials' }
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials' }
      });
    }

    // Check if user and company are active
    if (!user.isActive || !user.company.isActive) {
      return res.status(401).json({
        success: false,
        error: { message: 'Account is deactivated' }
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generate tokens
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      }
    });

    const { password: userPassword, ...sanitizedUser } = user;
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: sanitizedUser,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Get current user profile
router.get('/profile', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            domain: true,
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    const { password, ...sanitizedUser } = user;
    
    res.json({
      success: true,
      data: { user: sanitizedUser }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Test route
router.get('/test', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Auth routes working!',
    timestamp: new Date().toISOString()
  });
});

export default router;
