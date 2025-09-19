const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticateToken);

// Start screening analysis for a candidate
router.post('/candidate/:candidateId/analyze', async (req, res) => {
  try {
    // Verify candidate belongs to the authenticated company
    const candidate = await prisma.candidate.findFirst({
      where: {
        id: req.params.candidateId,
        companyId: req.companyId
      },
      include: {
        socialProfiles: {
          where: { isActive: true }
        }
      }
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found'
      });
    }

    if (candidate.socialProfiles.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No active social profiles found for this candidate'
      });
    }

    // Create new screening record
    const screening = await prisma.screening.create({
      data: {
        candidateId: req.params.candidateId,
        status: 'IN_PROGRESS'
      }
    });

    // Simulate AI analysis (in production, this would be async processing)
    const analysisResults = await performAIAnalysis(candidate.socialProfiles);

    // Update screening with results
    const completedScreening = await prisma.screening.update({
      where: { id: screening.id },
      data: {
        status: 'COMPLETED',
        riskLevel: analysisResults.riskLevel,
        overallScore: analysisResults.overallScore,
        summary: analysisResults.summary,
        findings: analysisResults.findings,
        aiAnalysis: analysisResults.aiAnalysis,
        completedAt: new Date()
      },
      include: {
        candidate: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            position: true
          }
        }
      }
    });

    // Update social profiles with last scanned timestamp
    await prisma.socialProfile.updateMany({
      where: {
        candidateId: req.params.candidateId,
        isActive: true
      },
      data: {
        lastScanned: new Date()
      }
    });

    res.status(201).json({
      success: true,
      data: completedScreening
    });
  } catch (error) {
    console.error('Screening analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform screening analysis'
    });
  }
});

// Get screening results for a candidate
router.get('/candidate/:candidateId', async (req, res) => {
  try {
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

    const screenings = await prisma.screening.findMany({
      where: { candidateId: req.params.candidateId },
      orderBy: { createdAt: 'desc' },
      include: {
        candidate: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            position: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: screenings
    });
  } catch (error) {
    console.error('Get screenings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve screenings'
    });
  }
});

// Get specific screening details
router.get('/:screeningId', async (req, res) => {
  try {
    const screening = await prisma.screening.findFirst({
      where: {
        id: req.params.screeningId,
        candidate: {
          companyId: req.companyId
        }
      },
      include: {
        candidate: {
          include: {
            socialProfiles: true
          }
        }
      }
    });

    if (!screening) {
      return res.status(404).json({
        success: false,
        error: 'Screening not found'
      });
    }

    res.json({
      success: true,
      data: screening
    });
  } catch (error) {
    console.error('Get screening error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve screening'
    });
  }
});

// AI Analysis simulation function
async function performAIAnalysis(socialProfiles) {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock AI analysis results based on profile data
  const findings = [];
  let riskScore = 0;
  const platforms = socialProfiles.map(p => p.platform);

  // Platform-specific analysis
  for (const profile of socialProfiles) {
    const platformAnalysis = {
      platform: profile.platform,
      profileUrl: profile.profileUrl,
      username: profile.username,
      contentAnalysis: generateContentAnalysis(profile.platform),
      riskFactors: generateRiskFactors(profile.platform),
      professionalScore: Math.floor(Math.random() * 40) + 60 // 60-100
    };

    findings.push(platformAnalysis);
    riskScore += calculateRiskScore(platformAnalysis);
  }

  const avgRiskScore = Math.floor(riskScore / socialProfiles.length);
  const riskLevel = avgRiskScore >= 80 ? 'LOW' : avgRiskScore >= 60 ? 'MEDIUM' : avgRiskScore >= 40 ? 'HIGH' : 'CRITICAL';

  return {
    riskLevel,
    overallScore: avgRiskScore,
    summary: generateSummary(platforms, riskLevel, avgRiskScore),
    findings: { platforms: findings },
    aiAnalysis: {
      processingTime: '2.3 seconds',
      profilesAnalyzed: socialProfiles.length,
      algorithmsUsed: ['content_classification', 'sentiment_analysis', 'risk_assessment'],
      confidenceLevel: Math.floor(Math.random() * 20) + 80 // 80-100%
    }
  };
}

function generateContentAnalysis(platform) {
  const analyses = {
    LINKEDIN: {
      professionalContent: 85,
      networkQuality: 78,
      endorsements: 12,
      inappropriateContent: 0
    },
    TWITTER: {
      politicalContent: 15,
      professionalContent: 70,
      negativeLanguage: 5,
      inappropriateContent: 2
    },
    FACEBOOK: {
      personalContent: 90,
      professionalContent: 30,
      privacySettings: 'restricted',
      inappropriateContent: 1
    }
  };

  return analyses[platform] || {
    professionalContent: Math.floor(Math.random() * 40) + 50,
    inappropriateContent: Math.floor(Math.random() * 10)
  };
}

function generateRiskFactors(platform) {
  const riskFactors = {
    LINKEDIN: ['No concerning content detected', 'Professional network verified'],
    TWITTER: ['Occasional political commentary', 'Generally professional tone'],
    FACEBOOK: ['Limited public content', 'Privacy settings appropriate']
  };

  return riskFactors[platform] || ['Standard profile analysis completed'];
}

function calculateRiskScore(analysis) {
  return analysis.professionalScore;
}

function generateSummary(platforms, riskLevel, score) {
  const platformText = platforms.join(', ');
  return `Comprehensive analysis of ${platforms.length} social media profiles (${platformText}) completed. Overall risk level: ${riskLevel} (${score}/100). Candidate demonstrates appropriate professional online presence with minimal risk factors identified.`;
}

module.exports = router;
