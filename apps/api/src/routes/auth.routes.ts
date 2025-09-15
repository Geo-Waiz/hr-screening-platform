import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { prisma } from '../lib/database';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter.middleware';
import { 
  registerSchema, 
  loginSchema, 
  refreshTokenSchema, 
  createCompanySchema 
} from '../validators/auth.validator';
import { UserRole } from '@prisma/client';

const router = Router();
const authService = new AuthService();

// Apply rate limiting to auth routes
router.use(authLimiter);

// Create company and admin user (for initial setup)
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

    // Create company and admin user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create company
      const company = await tx.company.create({
        data: {
          name: validatedData.name,
          domain: validatedData.domain,
        }
      });

      // Register admin user
      const adminUser = await authService.register({
        email: validatedData.adminEmail,
        password: validatedData.adminPassword,
        firstName: validatedData.adminFirstName,
        lastName: validatedData.adminLastName,
        companyId: company.id,
        role: UserRole.ADMIN,
      });

      return { company, adminUser };
    });

    res.status(201).json({
      success: true,
      message: 'Company and admin user created successfully',
      data: {
        company: result.company,
        user: result.adminUser.user,
        accessToken: result.adminUser.accessToken,
        refreshToken: result.adminUser.refreshToken,
      }
    });
  } catch (error) {
    console.error('Create company error:', error);
    
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        error: { message: error.message }
      });
    }
    
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Register new user (requires existing company)
router.post('/register', async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    // Verify company exists
    const company = await prisma.company.findUnique({
      where: { id: validatedData.companyId }
    });
    
    if (!company || !company.isActive) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid or inactive company' }
      });
    }

    const result = await authService.register(validatedData);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        error: { message: error.message }
      });
    }
    
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.login(validatedData);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof Error) {
      return res.status(401).json({
        success: false,
        error: { message: error.message }
      });
    }
    
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Refresh token
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);
    const result = await authService.refreshToken(refreshToken);
    
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: result
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    
    res.status(401).json({
      success: false,
      error: { message: 'Invalid refresh token' }
    });
  }
});

// Logout
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);
    await authService.logout(refreshToken);
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Logout from all devices
router.post('/logout-all', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await authService.logoutAll(req.user!.userId);
    
    res.json({
      success: true,
      message: 'Logged out from all devices successfully'
    });
  } catch (error) {
    console.error('Logout all error:', error);
    
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

// Test protected route
router.get('/test-protected', authenticate, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    message: 'Protected route accessed successfully',
    data: {
      user: req.user,
      timestamp: new Date().toISOString()
    }
  });
});

export default router;
