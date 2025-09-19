const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication to all candidate routes
router.use(authenticateToken);

// Get all candidates for the authenticated company
router.get('/', async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({
      where: { companyId: req.companyId },
      include: {
        screenings: {
          select: {
            id: true,
            status: true,
            riskLevel: true,
            overallScore: true,
            createdAt: true
          }
        },
        _count: {
          select: { socialProfiles: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: candidates
    });
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve candidates'
    });
  }
});

// Create new candidate
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, position, notes } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !position) {
      return res.status(400).json({
        success: false,
        error: 'First name, last name, email, and position are required'
      });
    }

    // Check if candidate already exists for this company
    const existingCandidate = await prisma.candidate.findFirst({
      where: {
        email,
        companyId: req.companyId
      }
    });

    if (existingCandidate) {
      return res.status(400).json({
        success: false,
        error: 'Candidate with this email already exists'
      });
    }

    const candidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        position,
        notes,
        companyId: req.companyId,
        status: 'PENDING'
      }
    });

    res.status(201).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    console.error('Create candidate error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create candidate'
    });
  }
});

// Get specific candidate
router.get('/:id', async (req, res) => {
  try {
    const candidate = await prisma.candidate.findFirst({
      where: {
        id: req.params.id,
        companyId: req.companyId
      },
      include: {
        socialProfiles: true,
        screenings: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found'
      });
    }

    res.json({
      success: true,
      data: candidate
    });
  } catch (error) {
    console.error('Get candidate error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve candidate'
    });
  }
});

// Update candidate
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, position, notes, status } = req.body;

    const candidate = await prisma.candidate.findFirst({
      where: {
        id: req.params.id,
        companyId: req.companyId
      }
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found'
      });
    }

    const updatedCandidate = await prisma.candidate.update({
      where: { id: req.params.id },
      data: {
        firstName,
        lastName,
        email,
        phone,
        position,
        notes,
        status
      }
    });

    res.json({
      success: true,
      data: updatedCandidate
    });
  } catch (error) {
    console.error('Update candidate error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update candidate'
    });
  }
});

// Delete candidate
router.delete('/:id', async (req, res) => {
  try {
    const candidate = await prisma.candidate.findFirst({
      where: {
        id: req.params.id,
        companyId: req.companyId
      }
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found'
      });
    }

    await prisma.candidate.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'Candidate deleted successfully'
    });
  } catch (error) {
    console.error('Delete candidate error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete candidate'
    });
  }
});

module.exports = router;
