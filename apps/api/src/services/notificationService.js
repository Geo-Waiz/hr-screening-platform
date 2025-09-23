const { PrismaClient } = require("@prisma/client")
const nodemailer = require("nodemailer")
const sgMail = require("@sendgrid/mail")

const prisma = new PrismaClient()

// Configure email service
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Configure SendGrid if API key is provided
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

class NotificationService {
  constructor(io) {
    this.io = io
  }

  async createNotification({
    userId,
    title,
    message,
    type,
    priority = "MEDIUM",
    candidateId = null,
    screeningId = null,
    metadata = null,
  }) {
    try {
      // Create notification in database
      const notification = await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type,
          priority,
          candidateId,
          screeningId,
          metadata,
        },
        include: {
          user: true,
          candidate: true,
          screening: true,
        },
      })

      // Send real-time notification via Socket.IO
      this.io.to(`user-${userId}`).emit("notification", {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        createdAt: notification.createdAt,
        candidate: notification.candidate,
        screening: notification.screening,
      })

      // Send email notification if user preferences allow
      await this.sendEmailNotification(notification)

      return notification
    } catch (error) {
      console.error("Error creating notification:", error)
      throw error
    }
  }

  async sendEmailNotification(notification) {
    try {
      const user = notification.user
      const preferences = await prisma.notificationPreference.findUnique({
        where: { userId: user.id },
      })

      // Check if user wants email notifications
      if (!preferences?.emailNotifications) {
        return
      }

      // Check specific notification type preferences
      const shouldSend = this.shouldSendEmailForType(notification.type, preferences)
      if (!shouldSend) {
        return
      }

      const emailContent = this.generateEmailContent(notification)

      if (process.env.SENDGRID_API_KEY) {
        // Use SendGrid
        await sgMail.send({
          to: user.email,
          from: process.env.FROM_EMAIL || "noreply@waiz.cl",
          subject: emailContent.subject,
          html: emailContent.html,
        })
      } else if (process.env.SMTP_USER) {
        // Use SMTP
        await emailTransporter.sendMail({
          from: process.env.FROM_EMAIL || "noreply@waiz.cl",
          to: user.email,
          subject: emailContent.subject,
          html: emailContent.html,
        })
      }

      // Mark email as sent
      await prisma.notification.update({
        where: { id: notification.id },
        data: { isEmailSent: true },
      })
    } catch (error) {
      console.error("Error sending email notification:", error)
    }
  }

  shouldSendEmailForType(type, preferences) {
    switch (type) {
      case "SCREENING_COMPLETED":
      case "SCREENING_FAILED":
        return preferences.screeningCompleted
      case "CANDIDATE_ADDED":
        return preferences.candidateAdded
      case "RISK_ALERT":
        return preferences.riskAlerts
      case "SYSTEM_ALERT":
      case "MANUAL_REVIEW_REQUIRED":
        return preferences.systemAlerts
      default:
        return true
    }
  }

  generateEmailContent(notification) {
    const baseUrl = process.env.FRONTEND_URL || "https://app.waiz.cl"

    const subject = notification.title
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 16px;">${notification.title}</h2>
          <p style="color: #666; line-height: 1.6;">${notification.message}</p>
          
          ${
            notification.candidate
              ? `
            <div style="background: white; padding: 16px; border-radius: 6px; margin: 16px 0;">
              <h3 style="color: #333; margin-bottom: 8px;">Candidate Details</h3>
              <p><strong>Name:</strong> ${notification.candidate.firstName} ${notification.candidate.lastName}</p>
              <p><strong>Email:</strong> ${notification.candidate.email}</p>
              <p><strong>Position:</strong> ${notification.candidate.position}</p>
            </div>
          `
              : ""
          }
          
          <div style="margin-top: 24px;">
            <a href="${baseUrl}/dashboard" 
               style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Dashboard
            </a>
          </div>
          
          <p style="color: #999; font-size: 12px; margin-top: 24px;">
            This is an automated notification from Waiz HR Screening Platform.
          </p>
        </div>
      </div>
    `

    return { subject, html }
  }

  async broadcastToCompany(companyId, notification) {
    this.io.to(`company-${companyId}`).emit("notification", notification)
  }

  async markAsRead(notificationId, userId) {
    try {
      const notification = await prisma.notification.update({
        where: {
          id: notificationId,
          userId: userId,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      })

      return notification
    } catch (error) {
      console.error("Error marking notification as read:", error)
      throw error
    }
  }

  async getUserNotifications(userId, { page = 1, limit = 20, unreadOnly = false } = {}) {
    try {
      const where = {
        userId,
        ...(unreadOnly && { isRead: false }),
      }

      const notifications = await prisma.notification.findMany({
        where,
        include: {
          candidate: true,
          screening: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      })

      const total = await prisma.notification.count({ where })

      return {
        notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      }
    } catch (error) {
      console.error("Error fetching user notifications:", error)
      throw error
    }
  }
}

module.exports = NotificationService
