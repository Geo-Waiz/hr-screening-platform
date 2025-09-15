import { Router, Request, Response } from 'express';
import { CandidateService } from '../services/candidate.service';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth.middleware';
import { generalLimiter } from '../middleware/rateLimiter.middleware';
import {
  createCandidateSchema,
  updateCandidateSchema,
  candidateFiltersSchema,
  candidateIdSchema
} from '../validators/candidate.validator';
import { UserRole } from '@prisma/client';

const router = Router();
const candidateService = new CandidateService();

// Apply authentication to all routes
router.use(authenticate);

// Apply rate limiting
router.use(generalLimiter);

// Create new candidate
router.post('/', authorize(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.RECRUITER), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = createCandidateSchema.parse(req.body);
    
    const candidate = await candidateService.createCandidate({
      ...validatedData,
      companyId: req.user!.companyId
    });

    res.status(201).json({
      success: true,
      message: 'Candidate created successfully',
      data: { candidate }
    });
  } catch (error) {
    console.error('Create candidate error:', error);
    
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

// Get all candidates with filters and pagination
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const filters = candidateFiltersSchema.parse(req.query);
    
    const result = await candidateService.getCandidates(req.user!.companyId, filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get candidates error:', error);
    
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

// Get candidate statistics
router.get('/stats', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await candidateService.getCandidateStats(req.user!.companyId);

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get candidate stats error:', error);
    
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Get single candidate by ID
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = candidateIdSchema.parse(req.params);
    
    const candidate = await candidateService.getCandidateById(id, req.user!.companyId);

    res.json({
      success: true,
      data: { candidate }
    });
  } catch (error) {
    console.error('Get candidate error:', error);
    
    if (error instanceof Error) {
      return res.status(404).json({
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

// Update candidate
router.put('/:id', authorize(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.RECRUITER), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = candidateIdSchema.parse(req.params);
    const validatedData = updateCandidateSchema.parse(req.body);
    
    const candidate = await candidateService.updateCandidate(id, req.user!.companyId, validatedData);

    res.json({
      success: true,
      message: 'Candidate updated successfully',
      data: { candidate }
    });
  } catch (error) {
    console.error('Update candidate error:', error);
    
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

// Archive candidate (soft delete)
router.patch('/:id/archive', authorize(UserRole.ADMIN, UserRole.HR_MANAGER), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = candidateIdSchema.parse(req.params);
    
    const candidate = await candidateService.archiveCandidate(id, req.user!.companyId);

    res.json({
      success: true,
      message: 'Candidate archived successfully',
      data: { candidate }
    });
  } catch (error) {
    console.error('Archive candidate error:', error);
    
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

// Delete candidate (hard delete - only for empty candidates)
router.delete('/:id', authorize(UserRole.ADMIN), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = candidateIdSchema.parse(req.params);
    
    const result = await candidateService.deleteCandidate(id, req.user!.companyId);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Delete candidate error:', error);
    
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

export default router;
