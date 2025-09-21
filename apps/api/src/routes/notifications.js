const express = require("express")
const { PrismaClient } = require("@prisma/client")
const NotificationService = require("../services/notificationService")

const router = express.Router()
const prisma = new PrismaClient()

// Middleware to get notification service with Socket.IO
const getNotificationService = (req, res, next) => {
  const io = req.app.get("io")
  req.notificationService = new NotificationService(io)
  next()
}

// Get user notifications
router.get("/user/:userId", getNotificationService, async (req, res) => {
  try {
    const { userId } = req.params
    const { page, limit, unreadOnly } = req.query

    const result = await req.notificationService.getUserNotifications(userId, {
      page: Number.parseInt(page) || 1,
      limit: Number.parseInt(limit) || 20,
      unreadOnly: unreadOnly === "true",
    })

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    res.status(500).json({
      success: false,
      error: { message: "Failed to fetch notifications" },
    })
  }
})

// Mark notification as read
router.put("/:notificationId/read", getNotificationService, async (req, res) => {
  try {
    const { notificationId } = req.params
    const { userId } = req.body

    const notification = await req.notificationService.markAsRead(notificationId, userId)

    res.json({
      success: true,
      data: notification,
    })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    res.status(500).json({
      success: false,
      error: { message: "Failed to mark notification as read" },
    })
  }
})

// Mark all notifications as read for user
router.put("/user/:userId/read-all", async (req, res) => {
  try {
    const { userId } = req.params

    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    res.json({
      success: true,
      message: "All notifications marked as read",
    })
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    res.status(500).json({
      success: false,
      error: { message: "Failed to mark all notifications as read" },
    })
  }
})

// Get notification preferences
router.get("/preferences/:userId", async (req, res) => {
  try {
    const { userId } = req.params

    let preferences = await prisma.notificationPreference.findUnique({
      where: { userId },
    })

    // Create default preferences if none exist
    if (!preferences) {
      preferences = await prisma.notificationPreference.create({
        data: { userId },
      })
    }

    res.json({
      success: true,
      data: preferences,
    })
  } catch (error) {
    console.error("Error fetching notification preferences:", error)
    res.status(500).json({
      success: false,
      error: { message: "Failed to fetch notification preferences" },
    })
  }
})

// Update notification preferences
router.put("/preferences/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    const preferences = req.body

    const updatedPreferences = await prisma.notificationPreference.upsert({
      where: { userId },
      update: preferences,
      create: {
        userId,
        ...preferences,
      },
    })

    res.json({
      success: true,
      data: updatedPreferences,
    })
  } catch (error) {
    console.error("Error updating notification preferences:", error)
    res.status(500).json({
      success: false,
      error: { message: "Failed to update notification preferences" },
    })
  }
})

// Test notification endpoint (for development)
router.post("/test", getNotificationService, async (req, res) => {
  try {
    const { userId, title, message, type = "SYSTEM_ALERT" } = req.body

    const notification = await req.notificationService.createNotification({
      userId,
      title: title || "Test Notification",
      message: message || "This is a test notification from the HR Screening Platform.",
      type,
      priority: "MEDIUM",
    })

    res.json({
      success: true,
      data: notification,
      message: "Test notification sent successfully",
    })
  } catch (error) {
    console.error("Error sending test notification:", error)
    res.status(500).json({
      success: false,
      error: { message: "Failed to send test notification" },
    })
  }
})

module.exports = router
