const express = require("express")
const { PrismaClient } = require("@prisma/client")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()
const prisma = new PrismaClient()

router.use(authenticateToken)

// Get dashboard analytics overview
router.get("/overview", async (req, res) => {
  try {
    const { timeRange = "6m" } = req.query
    const companyId = req.companyId

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    switch (timeRange) {
      case "1m":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "3m":
        startDate.setMonth(now.getMonth() - 3)
        break
      case "6m":
        startDate.setMonth(now.getMonth() - 6)
        break
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setMonth(now.getMonth() - 6)
    }

    // Get basic counts
    const [totalCandidates, totalScreenings, completedScreenings, flaggedProfiles] = await Promise.all([
      prisma.candidate.count({
        where: { companyId, createdAt: { gte: startDate } },
      }),
      prisma.screening.count({
        where: {
          candidate: { companyId },
          createdAt: { gte: startDate },
        },
      }),
      prisma.screening.count({
        where: {
          candidate: { companyId },
          status: "COMPLETED",
          createdAt: { gte: startDate },
        },
      }),
      prisma.screening.count({
        where: {
          candidate: { companyId },
          riskLevel: { in: ["HIGH", "CRITICAL"] },
          createdAt: { gte: startDate },
        },
      }),
    ])

    // Get risk distribution
    const riskDistribution = await prisma.screening.groupBy({
      by: ["riskLevel"],
      where: {
        candidate: { companyId },
        riskLevel: { not: null },
        createdAt: { gte: startDate },
      },
      _count: { riskLevel: true },
    })

    // Get monthly trends
    const monthlyTrends = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', s.created_at) as month,
        COUNT(s.id) as screenings,
        COUNT(DISTINCT s.candidate_id) as candidates,
        COUNT(CASE WHEN s.risk_level IN ('HIGH', 'CRITICAL') THEN 1 END) as flagged
      FROM screenings s
      JOIN candidates c ON s.candidate_id = c.id
      WHERE c.company_id = ${companyId}
        AND s.created_at >= ${startDate}
      GROUP BY DATE_TRUNC('month', s.created_at)
      ORDER BY month
    `

    // Calculate average processing time and accuracy
    const performanceMetrics = await prisma.screening.aggregate({
      where: {
        candidate: { companyId },
        status: "COMPLETED",
        createdAt: { gte: startDate },
      },
      _avg: {
        overallScore: true,
      },
    })

    res.json({
      success: true,
      data: {
        overview: {
          totalCandidates,
          totalScreenings,
          completedScreenings,
          flaggedProfiles,
          completionRate: totalScreenings > 0 ? ((completedScreenings / totalScreenings) * 100).toFixed(1) : 0,
          averageRiskScore: performanceMetrics._avg.overallScore || 0,
        },
        riskDistribution: riskDistribution.map((item) => ({
          riskLevel: item.riskLevel,
          count: item._count.riskLevel,
        })),
        monthlyTrends: monthlyTrends.map((item) => ({
          month: item.month,
          screenings: Number(item.screenings),
          candidates: Number(item.candidates),
          flagged: Number(item.flagged),
        })),
      },
    })
  } catch (error) {
    console.error("Analytics overview error:", error)
    res.status(500).json({
      success: false,
      error: { message: "Failed to fetch analytics overview" },
    })
  }
})

// Get platform-specific analytics
router.get("/platforms", async (req, res) => {
  try {
    const companyId = req.companyId
    const { timeRange = "6m" } = req.query

    const startDate = new Date()
    switch (timeRange) {
      case "1m":
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case "3m":
        startDate.setMonth(startDate.getMonth() - 3)
        break
      case "6m":
        startDate.setMonth(startDate.getMonth() - 6)
        break
      case "1y":
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
    }

    const platformStats = await prisma.$queryRaw`
      SELECT 
        sp.platform,
        COUNT(DISTINCT s.id) as total_screenings,
        AVG(s.overall_score) as avg_risk_score,
        COUNT(CASE WHEN s.status = 'COMPLETED' THEN 1 END) * 100.0 / COUNT(s.id) as completion_rate,
        COUNT(CASE WHEN s.risk_level IN ('HIGH', 'CRITICAL') THEN 1 END) as high_risk_count
      FROM social_profiles sp
      JOIN candidates c ON sp.candidate_id = c.id
      LEFT JOIN screenings s ON c.id = s.candidate_id
      WHERE c.company_id = ${companyId}
        AND sp.created_at >= ${startDate}
      GROUP BY sp.platform
      ORDER BY total_screenings DESC
    `

    res.json({
      success: true,
      data: platformStats.map((stat) => ({
        platform: stat.platform,
        totalScreenings: Number(stat.total_screenings),
        avgRiskScore: stat.avg_risk_score ? Number(stat.avg_risk_score).toFixed(1) : 0,
        completionRate: stat.completion_rate ? Number(stat.completion_rate).toFixed(1) : 0,
        highRiskCount: Number(stat.high_risk_count),
      })),
    })
  } catch (error) {
    console.error("Platform analytics error:", error)
    res.status(500).json({
      success: false,
      error: { message: "Failed to fetch platform analytics" },
    })
  }
})

// Get performance metrics
router.get("/performance", async (req, res) => {
  try {
    const companyId = req.companyId
    const { timeRange = "24h" } = req.query

    // Get hourly performance data for the last 24 hours
    const performanceData = await prisma.$queryRaw`
      SELECT 
        EXTRACT(HOUR FROM s.created_at) as hour,
        AVG(EXTRACT(EPOCH FROM (s.completed_at - s.created_at))) as avg_processing_time,
        COUNT(CASE WHEN s.status = 'COMPLETED' THEN 1 END) * 100.0 / COUNT(s.id) as accuracy_rate
      FROM screenings s
      JOIN candidates c ON s.candidate_id = c.id
      WHERE c.company_id = ${companyId}
        AND s.created_at >= NOW() - INTERVAL '24 hours'
        AND s.completed_at IS NOT NULL
      GROUP BY EXTRACT(HOUR FROM s.created_at)
      ORDER BY hour
    `

    res.json({
      success: true,
      data: performanceData.map((item) => ({
        hour: Number(item.hour),
        avgProcessingTime: item.avg_processing_time ? Number(item.avg_processing_time).toFixed(2) : 0,
        accuracyRate: item.accuracy_rate ? Number(item.accuracy_rate).toFixed(1) : 0,
      })),
    })
  } catch (error) {
    console.error("Performance analytics error:", error)
    res.status(500).json({
      success: false,
      error: { message: "Failed to fetch performance analytics" },
    })
  }
})

// Get trend analysis
router.get("/trends", async (req, res) => {
  try {
    const companyId = req.companyId
    const { timeRange = "6m", metric = "screenings" } = req.query

    const startDate = new Date()
    switch (timeRange) {
      case "1m":
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case "3m":
        startDate.setMonth(startDate.getMonth() - 3)
        break
      case "6m":
        startDate.setMonth(startDate.getMonth() - 6)
        break
      case "1y":
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
    }

    let trendData
    if (timeRange === "1m") {
      // Daily trends for 1 month
      trendData = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('day', s.created_at) as period,
          COUNT(s.id) as screenings,
          COUNT(DISTINCT s.candidate_id) as candidates,
          COUNT(CASE WHEN s.risk_level IN ('HIGH', 'CRITICAL') THEN 1 END) as flagged,
          AVG(s.overall_score) as avg_score
        FROM screenings s
        JOIN candidates c ON s.candidate_id = c.id
        WHERE c.company_id = ${companyId}
          AND s.created_at >= ${startDate}
        GROUP BY DATE_TRUNC('day', s.created_at)
        ORDER BY period
      `
    } else {
      // Monthly trends for longer periods
      trendData = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', s.created_at) as period,
          COUNT(s.id) as screenings,
          COUNT(DISTINCT s.candidate_id) as candidates,
          COUNT(CASE WHEN s.risk_level IN ('HIGH', 'CRITICAL') THEN 1 END) as flagged,
          AVG(s.overall_score) as avg_score
        FROM screenings s
        JOIN candidates c ON s.candidate_id = c.id
        WHERE c.company_id = ${companyId}
          AND s.created_at >= ${startDate}
        GROUP BY DATE_TRUNC('month', s.created_at)
        ORDER BY period
      `
    }

    res.json({
      success: true,
      data: trendData.map((item) => ({
        period: item.period,
        screenings: Number(item.screenings),
        candidates: Number(item.candidates),
        flagged: Number(item.flagged),
        avgScore: item.avg_score ? Number(item.avg_score).toFixed(1) : 0,
      })),
    })
  } catch (error) {
    console.error("Trend analytics error:", error)
    res.status(500).json({
      success: false,
      error: { message: "Failed to fetch trend analytics" },
    })
  }
})

module.exports = router
