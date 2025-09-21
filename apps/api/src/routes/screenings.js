const express = require("express")
const { PrismaClient } = require("@prisma/client")
const { authenticateToken } = require("../middleware/auth")
const AIAnalysisService = require("../services/aiAnalysisService")
const NotificationService = require("../services/notificationService")

const router = express.Router()
const prisma = new PrismaClient()

router.use(authenticateToken)

// Start screening analysis for a candidate
router.post("/candidate/:candidateId/analyze", async (req, res) => {
  let screening
  try {
    // Verify candidate belongs to the authenticated company
    const candidate = await prisma.candidate.findFirst({
      where: {
        id: req.params.candidateId,
        companyId: req.companyId,
      },
      include: {
        socialProfiles: {
          where: { isActive: true },
        },
      },
    })

    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: "Candidate not found",
      })
    }

    if (candidate.socialProfiles.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No active social profiles found for this candidate",
      })
    }

    // Create new screening record
    screening = await prisma.screening.create({
      data: {
        candidateId: req.params.candidateId,
        status: "IN_PROGRESS",
      },
    })

    const aiService = new AIAnalysisService()
    const analysisResults = await aiService.performBulkAnalysis(candidate.socialProfiles, {
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      position: candidate.position,
    })

    // Update screening with results
    const completedScreening = await prisma.screening.update({
      where: { id: screening.id },
      data: {
        status: "COMPLETED",
        riskLevel: analysisResults.riskLevel,
        overallScore: analysisResults.overallScore,
        summary: analysisResults.summary,
        findings: analysisResults.findings,
        aiAnalysis: analysisResults.aiAnalysis,
        completedAt: new Date(),
      },
      include: {
        candidate: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            position: true,
          },
        },
      },
    })

    // Update social profiles with last scanned timestamp
    await prisma.socialProfile.updateMany({
      where: {
        candidateId: req.params.candidateId,
        isActive: true,
      },
      data: {
        lastScanned: new Date(),
      },
    })

    const io = req.app.get("io")
    if (io) {
      const notificationService = new NotificationService(io)

      // Find company users to notify
      const companyUsers = await prisma.user.findMany({
        where: { companyId: req.companyId },
        select: { id: true },
      })

      // Send notifications to all company users
      for (const user of companyUsers) {
        await notificationService.createNotification({
          userId: user.id,
          title: "Screening Completed",
          message: `AI screening completed for ${candidate.firstName} ${candidate.lastName}. Risk level: ${analysisResults.riskLevel}`,
          type: "SCREENING_COMPLETED",
          priority:
            analysisResults.riskLevel === "CRITICAL"
              ? "URGENT"
              : analysisResults.riskLevel === "HIGH"
                ? "HIGH"
                : "MEDIUM",
          candidateId: candidate.id,
          screeningId: screening.id,
        })
      }
    }

    res.status(201).json({
      success: true,
      data: completedScreening,
    })
  } catch (error) {
    console.error("Screening analysis error:", error)

    // Update screening status to failed
    if (screening?.id) {
      await prisma.screening.update({
        where: { id: screening.id },
        data: { status: "FAILED" },
      })
    }

    res.status(500).json({
      success: false,
      error: "Failed to perform screening analysis",
    })
  }
})

// Get screening results for a candidate
router.get("/candidate/:candidateId", async (req, res) => {
  try {
    const candidate = await prisma.candidate.findFirst({
      where: {
        id: req.params.candidateId,
        companyId: req.companyId,
      },
    })

    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: "Candidate not found",
      })
    }

    const screenings = await prisma.screening.findMany({
      where: { candidateId: req.params.candidateId },
      orderBy: { createdAt: "desc" },
      include: {
        candidate: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            position: true,
          },
        },
      },
    })

    res.json({
      success: true,
      data: screenings,
    })
  } catch (error) {
    console.error("Get screenings error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to retrieve screenings",
    })
  }
})

// Get specific screening details
router.get("/:screeningId", async (req, res) => {
  try {
    const screening = await prisma.screening.findFirst({
      where: {
        id: req.params.screeningId,
        candidate: {
          companyId: req.companyId,
        },
      },
      include: {
        candidate: {
          include: {
            socialProfiles: true,
          },
        },
      },
    })

    if (!screening) {
      return res.status(404).json({
        success: false,
        error: "Screening not found",
      })
    }

    res.json({
      success: true,
      data: screening,
    })
  } catch (error) {
    console.error("Get screening error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to retrieve screening",
    })
  }
})

// Generate detailed AI report for a screening
router.post("/:screeningId/generate-report", async (req, res) => {
  try {
    const screening = await prisma.screening.findFirst({
      where: {
        id: req.params.screeningId,
        candidate: {
          companyId: req.companyId,
        },
      },
      include: {
        candidate: true,
      },
    })

    if (!screening) {
      return res.status(404).json({
        success: false,
        error: "Screening not found",
      })
    }

    if (screening.status !== "COMPLETED") {
      return res.status(400).json({
        success: false,
        error: "Screening must be completed before generating report",
      })
    }

    const aiService = new AIAnalysisService()
    const detailedReport = await aiService.generateDetailedReport(screening.id, screening.candidate, {
      overallScore: screening.overallScore,
      riskLevel: screening.riskLevel,
      findings: screening.findings,
    })

    // Store the report in the database
    const updatedScreening = await prisma.screening.update({
      where: { id: screening.id },
      data: {
        humanReview: detailedReport.reportContent,
      },
    })

    res.json({
      success: true,
      data: {
        report: detailedReport.reportContent,
        generatedAt: detailedReport.generatedAt,
        metadata: {
          model: detailedReport.model,
          tokensUsed: detailedReport.tokensUsed,
        },
      },
    })
  } catch (error) {
    console.error("Report generation error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to generate detailed report",
    })
  }
})

module.exports = router
