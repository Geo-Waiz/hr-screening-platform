const express = require("express")
const { PrismaClient } = require("@prisma/client")
const { authenticateToken } = require("../middleware/auth")
const automationService = require("../services/automationService")

const router = express.Router()
const prisma = new PrismaClient()

// Bulk candidate operations
router.post("/candidates/bulk-action", authenticateToken, async (req, res) => {
  try {
    const { candidateIds, action, parameters } = req.body

    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({ error: "Candidate IDs are required" })
    }

    let result
    switch (action) {
      case "update-status":
        result = await prisma.candidate.updateMany({
          where: { id: { in: candidateIds } },
          data: { status: parameters.status },
        })
        break

      case "start-screening":
        // Start screening for multiple candidates
        const screeningPromises = candidateIds.map((candidateId) => automationService.startScreening(candidateId))
        result = await Promise.all(screeningPromises)
        break

      case "delete":
        result = await prisma.candidate.deleteMany({
          where: { id: { in: candidateIds } },
        })
        break

      case "archive":
        result = await prisma.candidate.updateMany({
          where: { id: { in: candidateIds } },
          data: { archived: true },
        })
        break

      case "assign-reviewer":
        result = await prisma.candidate.updateMany({
          where: { id: { in: candidateIds } },
          data: { assignedReviewer: parameters.reviewerId },
        })
        break

      default:
        return res.status(400).json({ error: "Invalid action" })
    }

    res.json({
      success: true,
      message: `Bulk action '${action}' completed for ${candidateIds.length} candidates`,
      result,
    })
  } catch (error) {
    console.error("Bulk action error:", error)
    res.status(500).json({ error: "Failed to perform bulk action" })
  }
})

// Bulk import candidates
router.post("/candidates/import", authenticateToken, async (req, res) => {
  try {
    const { csvData } = req.body

    if (!csvData) {
      return res.status(400).json({ error: "CSV data is required" })
    }

    // Parse CSV data
    const lines = csvData.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.trim())
    const candidates = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim())
      const candidate = {}

      headers.forEach((header, index) => {
        candidate[header] = values[index]
      })

      candidates.push({
        firstName: candidate.firstName || candidate.name?.split(" ")[0] || "",
        lastName: candidate.lastName || candidate.name?.split(" ").slice(1).join(" ") || "",
        email: candidate.email,
        position: candidate.position,
        status: "PENDING",
        socialProfiles: candidate.socialProfiles ? JSON.parse(candidate.socialProfiles) : {},
      })
    }

    // Create candidates in database
    const result = await prisma.candidate.createMany({
      data: candidates,
      skipDuplicates: true,
    })

    res.json({
      success: true,
      message: `Successfully imported ${result.count} candidates`,
      imported: result.count,
    })
  } catch (error) {
    console.error("Import error:", error)
    res.status(500).json({ error: "Failed to import candidates" })
  }
})

// Export candidates
router.get("/candidates/export", authenticateToken, async (req, res) => {
  try {
    const { status, riskLevel, format = "csv" } = req.query

    const where = {}
    if (status && status !== "all") where.status = status.toUpperCase()
    if (riskLevel && riskLevel !== "all") where.riskLevel = riskLevel.toUpperCase()

    const candidates = await prisma.candidate.findMany({
      where,
      include: {
        screenings: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    })

    if (format === "csv") {
      const csvHeaders = "Name,Email,Position,Status,Risk Level,Created At,Last Screening\n"
      const csvData = candidates
        .map(
          (c) =>
            `"${c.firstName} ${c.lastName}","${c.email}","${c.position}","${c.status}","${c.riskLevel || "N/A"}","${c.createdAt}","${c.screenings[0]?.createdAt || "N/A"}"`,
        )
        .join("\n")

      res.setHeader("Content-Type", "text/csv")
      res.setHeader("Content-Disposition", 'attachment; filename="candidates.csv"')
      res.send(csvHeaders + csvData)
    } else {
      res.json({ candidates })
    }
  } catch (error) {
    console.error("Export error:", error)
    res.status(500).json({ error: "Failed to export candidates" })
  }
})

module.exports = router
