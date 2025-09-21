const { PrismaClient } = require("@prisma/client")
const AIAnalysisService = require("./aiAnalysisService")
const NotificationService = require("./notificationService")

const prisma = new PrismaClient()

class AutomationService {
  constructor(io) {
    this.io = io
    this.notificationService = new NotificationService(io)
    this.aiService = new AIAnalysisService()
  }

  // Automated screening workflow
  async processAutomatedScreening(candidateId, companyId) {
    try {
      const candidate = await prisma.candidate.findFirst({
        where: {
          id: candidateId,
          companyId,
        },
        include: {
          socialProfiles: {
            where: { isActive: true },
          },
        },
      })

      if (!candidate || candidate.socialProfiles.length === 0) {
        return { success: false, error: "Candidate not found or no social profiles" }
      }

      // Create screening record
      const screening = await prisma.screening.create({
        data: {
          candidateId,
          status: "IN_PROGRESS",
        },
      })

      // Perform AI analysis
      const analysisResults = await this.aiService.performBulkAnalysis(candidate.socialProfiles, {
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

      // Auto-update candidate status based on risk level
      let newStatus = candidate.status
      if (analysisResults.riskLevel === "CRITICAL" || analysisResults.riskLevel === "HIGH") {
        newStatus = "REQUIRES_REVIEW"
      } else if (analysisResults.riskLevel === "LOW" && analysisResults.overallScore >= 80) {
        newStatus = "APPROVED"
      }

      if (newStatus !== candidate.status) {
        await prisma.candidate.update({
          where: { id: candidateId },
          data: { status: newStatus },
        })
      }

      // Send notifications
      const companyUsers = await prisma.user.findMany({
        where: { companyId },
        select: { id: true },
      })

      for (const user of companyUsers) {
        await this.notificationService.createNotification({
          userId: user.id,
          title: "Automated Screening Completed",
          message: `Screening completed for ${candidate.firstName} ${candidate.lastName}. Risk level: ${analysisResults.riskLevel}`,
          type: "SCREENING_COMPLETED",
          priority:
            analysisResults.riskLevel === "CRITICAL"
              ? "URGENT"
              : analysisResults.riskLevel === "HIGH"
                ? "HIGH"
                : "MEDIUM",
          candidateId,
          screeningId: screening.id,
        })
      }

      return {
        success: true,
        data: {
          screeningId: screening.id,
          riskLevel: analysisResults.riskLevel,
          overallScore: analysisResults.overallScore,
          newStatus,
        },
      }
    } catch (error) {
      console.error("Automated screening error:", error)
      return { success: false, error: error.message }
    }
  }

  // Scheduled batch processing
  async processScheduledScreenings() {
    try {
      // Find candidates that need screening (added in last 24 hours, no screening yet)
      const candidatesForScreening = await prisma.candidate.findMany({
        where: {
          status: "PENDING",
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
          screenings: {
            none: {},
          },
        },
        include: {
          socialProfiles: {
            where: { isActive: true },
          },
        },
      })

      const results = []
      for (const candidate of candidatesForScreening) {
        if (candidate.socialProfiles.length > 0) {
          const result = await this.processAutomatedScreening(candidate.id, candidate.companyId)
          results.push({
            candidateId: candidate.id,
            ...result,
          })
        }
      }

      console.log(`Scheduled screening processed ${results.length} candidates`)
      return results
    } catch (error) {
      console.error("Scheduled screening error:", error)
      return []
    }
  }

  // Auto-archive old candidates
  async archiveOldCandidates(daysOld = 90) {
    try {
      const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000)

      const result = await prisma.candidate.updateMany({
        where: {
          status: { in: ["REJECTED", "COMPLETED"] },
          updatedAt: { lt: cutoffDate },
        },
        data: {
          status: "ARCHIVED",
        },
      })

      console.log(`Archived ${result.count} old candidates`)
      return result.count
    } catch (error) {
      console.error("Archive candidates error:", error)
      return 0
    }
  }

  // Cleanup old notifications
  async cleanupOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000)

      const result = await prisma.notification.deleteMany({
        where: {
          isRead: true,
          createdAt: { lt: cutoffDate },
        },
      })

      console.log(`Cleaned up ${result.count} old notifications`)
      return result.count
    } catch (error) {
      console.error("Cleanup notifications error:", error)
      return 0
    }
  }

  // Risk-based workflow automation
  async processRiskBasedWorkflows() {
    try {
      // Find high-risk candidates that need manual review
      const highRiskCandidates = await prisma.candidate.findMany({
        where: {
          status: { not: "REQUIRES_REVIEW" },
          screenings: {
            some: {
              riskLevel: { in: ["HIGH", "CRITICAL"] },
              status: "COMPLETED",
            },
          },
        },
        include: {
          screenings: {
            where: { riskLevel: { in: ["HIGH", "CRITICAL"] } },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      })

      for (const candidate of highRiskCandidates) {
        // Update status to require review
        await prisma.candidate.update({
          where: { id: candidate.id },
          data: { status: "REQUIRES_REVIEW" },
        })

        // Notify managers
        const managers = await prisma.user.findMany({
          where: {
            companyId: candidate.companyId,
            role: { in: ["ADMIN", "MANAGER"] },
          },
        })

        for (const manager of managers) {
          await this.notificationService.createNotification({
            userId: manager.id,
            title: "High Risk Candidate Requires Review",
            message: `${candidate.firstName} ${candidate.lastName} has been flagged as ${candidate.screenings[0].riskLevel} risk and requires manual review`,
            type: "MANUAL_REVIEW_REQUIRED",
            priority: "URGENT",
            candidateId: candidate.id,
            screeningId: candidate.screenings[0].id,
          })
        }
      }

      return highRiskCandidates.length
    } catch (error) {
      console.error("Risk-based workflow error:", error)
      return 0
    }
  }

  // Start automation scheduler
  startScheduler() {
    // Run scheduled screenings every hour
    setInterval(
      async () => {
        await this.processScheduledScreenings()
      },
      60 * 60 * 1000,
    ) // 1 hour

    // Run risk-based workflows every 30 minutes
    setInterval(
      async () => {
        await this.processRiskBasedWorkflows()
      },
      30 * 60 * 1000,
    ) // 30 minutes

    // Run cleanup tasks daily at 2 AM
    const now = new Date()
    const tomorrow2AM = new Date(now)
    tomorrow2AM.setDate(tomorrow2AM.getDate() + 1)
    tomorrow2AM.setHours(2, 0, 0, 0)

    const msUntil2AM = tomorrow2AM.getTime() - now.getTime()

    setTimeout(() => {
      // Run cleanup immediately, then every 24 hours
      this.runDailyCleanup()
      setInterval(
        () => {
          this.runDailyCleanup()
        },
        24 * 60 * 60 * 1000,
      ) // 24 hours
    }, msUntil2AM)

    console.log("Automation scheduler started")
  }

  async runDailyCleanup() {
    try {
      const archivedCount = await this.archiveOldCandidates()
      const cleanedNotifications = await this.cleanupOldNotifications()

      console.log(
        `Daily cleanup completed: ${archivedCount} candidates archived, ${cleanedNotifications} notifications cleaned`,
      )
    } catch (error) {
      console.error("Daily cleanup error:", error)
    }
  }
}

module.exports = AutomationService
