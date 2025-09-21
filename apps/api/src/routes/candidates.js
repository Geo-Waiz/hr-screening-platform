const express = require("express")
const { PrismaClient } = require("@prisma/client")
const { authenticateToken } = require("../middleware/auth")
const AIAnalysisService = require("../services/aiAnalysisService")
const NotificationService = require("../services/notificationService")

const router = express.Router()
const prisma = new PrismaClient()

// Apply authentication to all candidate routes
router.use(authenticateToken)

// Get all candidates for the authenticated company
router.get("/", async (req, res) => {
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
            createdAt: true,
          },
        },
        _count: {
          select: { socialProfiles: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    res.json({
      success: true,
      data: candidates,
    })
  } catch (error) {
    console.error("Get candidates error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to retrieve candidates",
    })
  }
})

// Create new candidate
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, position, notes } = req.body

    // Validate required fields
    if (!firstName || !lastName || !email || !position) {
      return res.status(400).json({
        success: false,
        error: "First name, last name, email, and position are required",
      })
    }

    // Check if candidate already exists for this company
    const existingCandidate = await prisma.candidate.findFirst({
      where: {
        email,
        companyId: req.companyId,
      },
    })

    if (existingCandidate) {
      return res.status(400).json({
        success: false,
        error: "Candidate with this email already exists",
      })
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
        status: "PENDING",
      },
    })

    res.status(201).json({
      success: true,
      data: candidate,
    })
  } catch (error) {
    console.error("Create candidate error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to create candidate",
    })
  }
})

// Get specific candidate
router.get("/:id", async (req, res) => {
  try {
    const candidate = await prisma.candidate.findFirst({
      where: {
        id: req.params.id,
        companyId: req.companyId,
      },
      include: {
        socialProfiles: true,
        screenings: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: "Candidate not found",
      })
    }

    res.json({
      success: true,
      data: candidate,
    })
  } catch (error) {
    console.error("Get candidate error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to retrieve candidate",
    })
  }
})

// Update candidate
router.put("/:id", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, position, notes, status } = req.body

    const candidate = await prisma.candidate.findFirst({
      where: {
        id: req.params.id,
        companyId: req.companyId,
      },
    })

    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: "Candidate not found",
      })
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
        status,
      },
    })

    res.json({
      success: true,
      data: updatedCandidate,
    })
  } catch (error) {
    console.error("Update candidate error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to update candidate",
    })
  }
})

// Delete candidate
router.delete("/:id", async (req, res) => {
  try {
    const candidate = await prisma.candidate.findFirst({
      where: {
        id: req.params.id,
        companyId: req.companyId,
      },
    })

    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: "Candidate not found",
      })
    }

    await prisma.candidate.delete({
      where: { id: req.params.id },
    })

    res.json({
      success: true,
      message: "Candidate deleted successfully",
    })
  } catch (error) {
    console.error("Delete candidate error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to delete candidate",
    })
  }
})

// Bulk update candidates
router.put("/bulk-update", async (req, res) => {
  try {
    const { candidateIds, updates } = req.body

    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "candidateIds array is required",
      })
    }

    // Verify all candidates belong to the authenticated company
    const candidates = await prisma.candidate.findMany({
      where: {
        id: { in: candidateIds },
        companyId: req.companyId,
      },
    })

    if (candidates.length !== candidateIds.length) {
      return res.status(404).json({
        success: false,
        error: "Some candidates not found or access denied",
      })
    }

    // Perform bulk update
    const result = await prisma.candidate.updateMany({
      where: {
        id: { in: candidateIds },
        companyId: req.companyId,
      },
      data: updates,
    })

    // Send notification about bulk operation
    const io = req.app.get("io")
    if (io) {
      const notificationService = new NotificationService(io)
      const companyUsers = await prisma.user.findMany({
        where: { companyId: req.companyId },
        select: { id: true },
      })

      for (const user of companyUsers) {
        await notificationService.createNotification({
          userId: user.id,
          title: "Bulk Update Completed",
          message: `Successfully updated ${result.count} candidates`,
          type: "BULK_OPERATION_COMPLETED",
          priority: "MEDIUM",
        })
      }
    }

    res.json({
      success: true,
      data: {
        updatedCount: result.count,
        candidateIds,
      },
    })
  } catch (error) {
    console.error("Bulk update candidates error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to update candidates",
    })
  }
})

// Bulk delete candidates
router.delete("/bulk-delete", async (req, res) => {
  try {
    const { candidateIds } = req.body

    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "candidateIds array is required",
      })
    }

    // Verify all candidates belong to the authenticated company
    const candidates = await prisma.candidate.findMany({
      where: {
        id: { in: candidateIds },
        companyId: req.companyId,
      },
    })

    if (candidates.length !== candidateIds.length) {
      return res.status(404).json({
        success: false,
        error: "Some candidates not found or access denied",
      })
    }

    // Perform bulk delete (cascade will handle related records)
    const result = await prisma.candidate.deleteMany({
      where: {
        id: { in: candidateIds },
        companyId: req.companyId,
      },
    })

    // Send notification about bulk operation
    const io = req.app.get("io")
    if (io) {
      const notificationService = new NotificationService(io)
      const companyUsers = await prisma.user.findMany({
        where: { companyId: req.companyId },
        select: { id: true },
      })

      for (const user of companyUsers) {
        await notificationService.createNotification({
          userId: user.id,
          title: "Bulk Delete Completed",
          message: `Successfully deleted ${result.count} candidates`,
          type: "BULK_OPERATION_COMPLETED",
          priority: "MEDIUM",
        })
      }
    }

    res.json({
      success: true,
      data: {
        deletedCount: result.count,
      },
    })
  } catch (error) {
    console.error("Bulk delete candidates error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to delete candidates",
    })
  }
})

// Bulk screening analysis
router.post("/bulk-screen", async (req, res) => {
  try {
    const { candidateIds } = req.body

    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "candidateIds array is required",
      })
    }

    // Verify all candidates belong to the authenticated company and have social profiles
    const candidates = await prisma.candidate.findMany({
      where: {
        id: { in: candidateIds },
        companyId: req.companyId,
      },
      include: {
        socialProfiles: {
          where: { isActive: true },
        },
      },
    })

    if (candidates.length !== candidateIds.length) {
      return res.status(404).json({
        success: false,
        error: "Some candidates not found or access denied",
      })
    }

    const candidatesWithProfiles = candidates.filter((c) => c.socialProfiles.length > 0)
    const candidatesWithoutProfiles = candidates.filter((c) => c.socialProfiles.length === 0)

    // Process candidates with social profiles
    const aiService = new AIAnalysisService()
    const screeningPromises = candidatesWithProfiles.map(async (candidate) => {
      try {
        // Create screening record
        const screening = await prisma.screening.create({
          data: {
            candidateId: candidate.id,
            status: "IN_PROGRESS",
          },
        })

        // Perform AI analysis
        const analysisResults = await aiService.performBulkAnalysis(candidate.socialProfiles, {
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          email: candidate.email,
          position: candidate.position,
        })

        // Update screening with results
        await prisma.screening.update({
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
        })

        // Update social profiles with last scanned timestamp
        await prisma.socialProfile.updateMany({
          where: {
            candidateId: candidate.id,
            isActive: true,
          },
          data: {
            lastScanned: new Date(),
          },
        })

        return {
          candidateId: candidate.id,
          screeningId: screening.id,
          status: "completed",
          riskLevel: analysisResults.riskLevel,
        }
      } catch (error) {
        console.error(`Screening failed for candidate ${candidate.id}:`, error)
        return {
          candidateId: candidate.id,
          status: "failed",
          error: error.message,
        }
      }
    })

    const screeningResults = await Promise.all(screeningPromises)

    // Send notifications
    const io = req.app.get("io")
    if (io) {
      const notificationService = new NotificationService(io)
      const companyUsers = await prisma.user.findMany({
        where: { companyId: req.companyId },
        select: { id: true },
      })

      const completedCount = screeningResults.filter((r) => r.status === "completed").length
      const failedCount = screeningResults.filter((r) => r.status === "failed").length

      for (const user of companyUsers) {
        await notificationService.createNotification({
          userId: user.id,
          title: "Bulk Screening Completed",
          message: `Bulk screening completed: ${completedCount} successful, ${failedCount} failed, ${candidatesWithoutProfiles.length} skipped (no profiles)`,
          type: "BULK_OPERATION_COMPLETED",
          priority: "HIGH",
        })
      }
    }

    res.json({
      success: true,
      data: {
        processed: screeningResults,
        skipped: candidatesWithoutProfiles.map((c) => ({
          candidateId: c.id,
          reason: "No active social profiles",
        })),
        summary: {
          total: candidateIds.length,
          completed: screeningResults.filter((r) => r.status === "completed").length,
          failed: screeningResults.filter((r) => r.status === "failed").length,
          skipped: candidatesWithoutProfiles.length,
        },
      },
    })
  } catch (error) {
    console.error("Bulk screening error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to perform bulk screening",
    })
  }
})

// Bulk import candidates from CSV
router.post("/bulk-import", async (req, res) => {
  try {
    const { candidates } = req.body

    if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({
        success: false,
        error: "candidates array is required",
      })
    }

    const results = {
      created: [],
      skipped: [],
      errors: [],
    }

    for (const candidateData of candidates) {
      try {
        const { firstName, lastName, email, phone, position, notes, socialProfiles } = candidateData

        // Validate required fields
        if (!firstName || !lastName || !email || !position) {
          results.errors.push({
            data: candidateData,
            error: "Missing required fields: firstName, lastName, email, position",
          })
          continue
        }

        // Check if candidate already exists
        const existingCandidate = await prisma.candidate.findFirst({
          where: {
            email,
            companyId: req.companyId,
          },
        })

        if (existingCandidate) {
          results.skipped.push({
            email,
            reason: "Candidate already exists",
          })
          continue
        }

        // Create candidate
        const candidate = await prisma.candidate.create({
          data: {
            firstName,
            lastName,
            email,
            phone,
            position,
            notes,
            companyId: req.companyId,
            status: "PENDING",
          },
        })

        // Add social profiles if provided
        if (socialProfiles && Array.isArray(socialProfiles)) {
          for (const profile of socialProfiles) {
            if (profile.platform && profile.profileUrl) {
              await prisma.socialProfile.create({
                data: {
                  candidateId: candidate.id,
                  platform: profile.platform,
                  profileUrl: profile.profileUrl,
                  username: profile.username,
                },
              })
            }
          }
        }

        results.created.push({
          id: candidate.id,
          email: candidate.email,
          name: `${candidate.firstName} ${candidate.lastName}`,
        })
      } catch (error) {
        results.errors.push({
          data: candidateData,
          error: error.message,
        })
      }
    }

    // Send notification about bulk import
    const io = req.app.get("io")
    if (io) {
      const notificationService = new NotificationService(io)
      const companyUsers = await prisma.user.findMany({
        where: { companyId: req.companyId },
        select: { id: true },
      })

      for (const user of companyUsers) {
        await notificationService.createNotification({
          userId: user.id,
          title: "Bulk Import Completed",
          message: `Import completed: ${results.created.length} created, ${results.skipped.length} skipped, ${results.errors.length} errors`,
          type: "BULK_OPERATION_COMPLETED",
          priority: "MEDIUM",
        })
      }
    }

    res.json({
      success: true,
      data: {
        summary: {
          total: candidates.length,
          created: results.created.length,
          skipped: results.skipped.length,
          errors: results.errors.length,
        },
        details: results,
      },
    })
  } catch (error) {
    console.error("Bulk import error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to import candidates",
    })
  }
})

// Export candidates to CSV format
router.get("/export", async (req, res) => {
  try {
    const { status, riskLevel, format = "json" } = req.query

    const whereClause = {
      companyId: req.companyId,
    }

    if (status) {
      whereClause.status = status
    }

    const candidates = await prisma.candidate.findMany({
      where: whereClause,
      include: {
        socialProfiles: true,
        screenings: {
          orderBy: { createdAt: "desc" },
          take: 1,
          where: riskLevel ? { riskLevel } : undefined,
        },
      },
      orderBy: { createdAt: "desc" },
    })

    if (format === "csv") {
      // Generate CSV format
      const csvHeaders = [
        "ID",
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Position",
        "Status",
        "Risk Level",
        "Overall Score",
        "Social Profiles",
        "Created At",
      ]

      const csvRows = candidates.map((candidate) => [
        candidate.id,
        candidate.firstName,
        candidate.lastName,
        candidate.email,
        candidate.phone || "",
        candidate.position,
        candidate.status,
        candidate.screenings[0]?.riskLevel || "",
        candidate.screenings[0]?.overallScore || "",
        candidate.socialProfiles.map((p) => `${p.platform}:${p.profileUrl}`).join(";"),
        candidate.createdAt.toISOString(),
      ])

      const csvContent = [csvHeaders, ...csvRows].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

      res.setHeader("Content-Type", "text/csv")
      res.setHeader("Content-Disposition", 'attachment; filename="candidates.csv"')
      res.send(csvContent)
    } else {
      res.json({
        success: true,
        data: candidates,
        count: candidates.length,
      })
    }
  } catch (error) {
    console.error("Export candidates error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to export candidates",
    })
  }
})

module.exports = router
