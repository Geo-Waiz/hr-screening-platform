const express = require("express")
const { PrismaClient } = require("@prisma/client")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()
const prisma = new PrismaClient()

// Advanced search endpoint
router.post("/candidates", authenticateToken, async (req, res) => {
  try {
    const {
      query,
      status,
      riskLevel,
      scoreRange,
      dateRange,
      platforms,
      positions,
      companies,
      tags,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 20,
    } = req.body

    // Build where clause
    const where = {
      companyId: req.companyId,
    }

    // Text search across multiple fields
    if (query && query.trim()) {
      where.OR = [
        { firstName: { contains: query, mode: "insensitive" } },
        { lastName: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { position: { contains: query, mode: "insensitive" } },
        { notes: { contains: query, mode: "insensitive" } },
      ]
    }

    // Status filter
    if (status && status.length > 0) {
      where.status = { in: status }
    }

    // Date range filter
    if (dateRange && (dateRange.from || dateRange.to)) {
      where.createdAt = {}
      if (dateRange.from) {
        where.createdAt.gte = new Date(dateRange.from)
      }
      if (dateRange.to) {
        where.createdAt.lte = new Date(dateRange.to)
      }
    }

    // Position filter
    if (positions && positions.length > 0) {
      where.position = { in: positions }
    }

    // Build include clause for related data
    const include = {
      socialProfiles: {
        where:
          platforms && platforms.length > 0
            ? {
                platform: { in: platforms },
              }
            : undefined,
      },
      screenings: {
        orderBy: { createdAt: "desc" },
        take: 1,
        where:
          riskLevel && riskLevel.length > 0
            ? {
                riskLevel: { in: riskLevel },
              }
            : undefined,
      },
      _count: {
        select: {
          socialProfiles: true,
          screenings: true,
        },
      },
    }

    // Execute search query
    const candidates = await prisma.candidate.findMany({
      where,
      include,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    })

    // Filter by score range if specified
    let filteredCandidates = candidates
    if (scoreRange && scoreRange.length === 2) {
      filteredCandidates = candidates.filter((candidate) => {
        const latestScreening = candidate.screenings[0]
        if (!latestScreening || latestScreening.overallScore === null) {
          return scoreRange[0] === 0 // Include unscored if range starts at 0
        }
        return latestScreening.overallScore >= scoreRange[0] && latestScreening.overallScore <= scoreRange[1]
      })
    }

    // Filter by platforms if specified
    if (platforms && platforms.length > 0) {
      filteredCandidates = filteredCandidates.filter((candidate) =>
        candidate.socialProfiles.some((profile) => platforms.includes(profile.platform)),
      )
    }

    // Get total count for pagination
    const totalCount = await prisma.candidate.count({ where })

    // Transform results for response
    const results = filteredCandidates.map((candidate) => ({
      id: candidate.id,
      name: `${candidate.firstName} ${candidate.lastName}`,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      position: candidate.position,
      status: candidate.status,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt,
      socialProfilesCount: candidate._count.socialProfiles,
      screeningsCount: candidate._count.screenings,
      platforms: candidate.socialProfiles.map((p) => p.platform),
      latestScreening: candidate.screenings[0] || null,
      riskLevel: candidate.screenings[0]?.riskLevel || null,
      overallScore: candidate.screenings[0]?.overallScore || null,
    }))

    res.json({
      success: true,
      data: {
        candidates: results,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit),
        },
        filters: {
          query,
          status,
          riskLevel,
          scoreRange,
          dateRange,
          platforms,
          positions,
          companies,
          tags,
        },
      },
    })
  } catch (error) {
    console.error("Advanced search error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to perform search",
    })
  }
})

// Save search query
router.post("/save", authenticateToken, async (req, res) => {
  try {
    const { name, filters, description } = req.body

    if (!name || !filters) {
      return res.status(400).json({
        success: false,
        error: "Name and filters are required",
      })
    }

    // For now, we'll store saved searches in a simple JSON format
    // In production, you might want a dedicated SavedSearch model
    const savedSearch = {
      id: Date.now().toString(),
      name,
      description,
      filters,
      userId: req.userId,
      companyId: req.companyId,
      createdAt: new Date(),
      lastUsed: new Date(),
      useCount: 1,
    }

    // Store in user preferences or a dedicated table
    // This is a simplified implementation
    res.json({
      success: true,
      data: savedSearch,
    })
  } catch (error) {
    console.error("Save search error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to save search",
    })
  }
})

// Get search suggestions/autocomplete
router.get("/suggestions", authenticateToken, async (req, res) => {
  try {
    const { field, query } = req.query

    if (!field || !query) {
      return res.status(400).json({
        success: false,
        error: "Field and query parameters are required",
      })
    }

    let suggestions = []

    switch (field) {
      case "position":
        const positions = await prisma.candidate.findMany({
          where: {
            companyId: req.companyId,
            position: {
              contains: query,
              mode: "insensitive",
            },
          },
          select: { position: true },
          distinct: ["position"],
          take: 10,
        })
        suggestions = positions.map((p) => p.position)
        break

      case "company":
        // If you have a company field in candidates
        const companies = await prisma.candidate.findMany({
          where: {
            companyId: req.companyId,
            // Assuming you have a company field
          },
          select: { company: true },
          distinct: ["company"],
          take: 10,
        })
        suggestions = companies.map((c) => c.company).filter(Boolean)
        break

      case "email":
        const emails = await prisma.candidate.findMany({
          where: {
            companyId: req.companyId,
            email: {
              contains: query,
              mode: "insensitive",
            },
          },
          select: { email: true },
          take: 10,
        })
        suggestions = emails.map((e) => e.email)
        break

      default:
        suggestions = []
    }

    res.json({
      success: true,
      data: suggestions,
    })
  } catch (error) {
    console.error("Search suggestions error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to get search suggestions",
    })
  }
})

// Get search analytics
router.get("/analytics", authenticateToken, async (req, res) => {
  try {
    // Get candidate distribution by status
    const statusDistribution = await prisma.candidate.groupBy({
      by: ["status"],
      where: { companyId: req.companyId },
      _count: { status: true },
    })

    // Get risk level distribution
    const riskDistribution = await prisma.screening.groupBy({
      by: ["riskLevel"],
      where: {
        candidate: { companyId: req.companyId },
        riskLevel: { not: null },
      },
      _count: { riskLevel: true },
    })

    // Get platform usage
    const platformUsage = await prisma.socialProfile.groupBy({
      by: ["platform"],
      where: {
        candidate: { companyId: req.companyId },
        isActive: true,
      },
      _count: { platform: true },
    })

    // Get top positions
    const topPositions = await prisma.candidate.groupBy({
      by: ["position"],
      where: { companyId: req.companyId },
      _count: { position: true },
      orderBy: { _count: { position: "desc" } },
      take: 10,
    })

    res.json({
      success: true,
      data: {
        statusDistribution: statusDistribution.map((item) => ({
          status: item.status,
          count: item._count.status,
        })),
        riskDistribution: riskDistribution.map((item) => ({
          riskLevel: item.riskLevel,
          count: item._count.riskLevel,
        })),
        platformUsage: platformUsage.map((item) => ({
          platform: item.platform,
          count: item._count.platform,
        })),
        topPositions: topPositions.map((item) => ({
          position: item.position,
          count: item._count.position,
        })),
      },
    })
  } catch (error) {
    console.error("Search analytics error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to get search analytics",
    })
  }
})

module.exports = router
