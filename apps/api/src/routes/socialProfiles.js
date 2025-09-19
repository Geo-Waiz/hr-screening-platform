const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticateToken);

// Get all social profiles for a candidate
router.get('/candidate/:candidateId', async (req, res) => {
  try {
    // Verify candidate belongs to the authenticated company
    const candidate = await prisma.candidate.findFirst({
      where: {
        id: req.params.candidateId,
        companyId: req.companyId
      }
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found'
      });
    }

    const profiles = await prisma.socialProfile.findMany({
      where: { candidateId: req.params.candidateId },
      orderBy: { platform: 'asc' }
    });

    res.json({
      success: true,
      data: profiles
    });
  } catch (error) {
    console.error('Get social profiles error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve social profiles'
    });
  }
});

// Add social media profile to candidate
router.post('/candidate/:candidateId', async (req, res) => {
  try {
    const { platform, profileUrl, username } = req.body;

    if (!platform || !profileUrl) {
      return res.status(400).json({
        success: false,
        error: 'Platform and profile URL are required'
      });
    }

    // Verify candidate belongs to the authenticated company
    const candidate = await prisma.candidate.findFirst({
      where: {
        id: req.params.candidateId,
        companyId: req.companyId
      }
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found'
      });
    }

    // Check if profile for this platform already exists
    const existingProfile = await prisma.socialProfile.findUnique({
      where: {
        candidateId_platform: {
          candidateId: req.params.candidateId,
          platform: platform
        }
      }
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        error: `${platform} profile already exists for this candidate`
      });
    }

    const profile = await prisma.socialProfile.create({
      data: {
        platform,
        profileUrl,
        username,
        candidateId: req.params.candidateId
      }
    });

    res.status(201).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Create social profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create social profile'
    });
  }
});

// Update social media profile
router.put('/:profileId', async (req, res) => {
  try {
    const { profileUrl, username, isActive } = req.body;

    // Verify profile belongs to a candidate in the authenticated company
    const profile = await prisma.socialProfile.findFirst({
      where: {
        id: req.params.profileId,
        candidate: {
          companyId: req.companyId
        }
      }
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Social profile not found'
      });
    }

    const updatedProfile = await prisma.socialProfile.update({
      where: { id: req.params.profileId },
      data: {
        profileUrl,
        username,
        isActive
      }
    });

    res.json({
      success: true,
      data: updatedProfile
    });
  } catch (error) {
    console.error('Update social profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update social profile'
    });
  }
});

// Delete social media profile
router.delete('/:profileId', async (req, res) => {
  try {
    // Verify profile belongs to a candidate in the authenticated company
    const profile = await prisma.socialProfile.findFirst({
      where: {
        id: req.params.profileId,
        candidate: {
          companyId: req.companyId
        }
      }
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Social profile not found'
      });
    }

    await prisma.socialProfile.delete({
      where: { id: req.params.profileId }
    });

    res.json({
      success: true,
      message: 'Social profile deleted successfully'
    });
  } catch (error) {
    console.error('Delete social profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete social profile'
    });
  }
});

module.exports = router;
