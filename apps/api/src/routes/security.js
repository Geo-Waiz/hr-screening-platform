const express = require("express")
const { PrismaClient } = require("@prisma/client")
const { authenticateToken } = require("../middleware/auth")
const { requireRole, logSecurityEvent } = require("../middleware/security")
const speakeasy = require("speakeasy")
const QRCode = require("qrcode")

const router = express.Router()
const prisma = new PrismaClient()

// Apply authentication to all security routes
router.use(authenticateToken)

// Get security overview
router.get("/overview", requireRole(["ADMIN", "MANAGER"]), async (req, res) => {
  try {
    // Get recent security events (in a real app, these would come from a security events table)
    const mockEvents = [
      {
        id: "1",
        type: "LOGIN",
        userId: req.user.id,
        userEmail: req.user.email,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        timestamp: new Date(),
        riskLevel: "LOW",
      },
    ]

    // Calculate security score based on various factors
    const securityScore = calculateSecurityScore(req.user)

    res.json({
      success: true,
      data: {
        securityScore,
        recentEvents: mockEvents,
        activeThreats: 0,
        mfaEnabled: req.user.mfaEnabled || false,
      },
    })
  } catch (error) {
    console.error("Security overview error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to get security overview",
    })
  }
})

// Setup MFA - Generate secret and QR code
router.post("/mfa/setup", async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `HR Screening (${req.user.email})`,
      issuer: "HR Screening Platform",
    })

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url)

    // Store secret temporarily (in production, encrypt this)
    // You might want to store this in Redis or a temporary table
    req.session = req.session || {}
    req.session.mfaSecret = secret.base32

    await logSecurityEvent({
      type: "MFA_SETUP_INITIATED",
      userId: req.user.id,
      userEmail: req.user.email,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      details: { step: "secret_generated" },
      riskLevel: "LOW",
    })

    res.json({
      success: true,
      data: {
        secret: secret.base32,
        qrCode: qrCodeUrl,
        backupCodes: generateBackupCodes(),
      },
    })
  } catch (error) {
    console.error("MFA setup error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to setup MFA",
    })
  }
})

// Verify MFA setup
router.post("/mfa/verify", async (req, res) => {
  try {
    const { token } = req.body
    const secret = req.session?.mfaSecret

    if (!secret) {
      return res.status(400).json({
        success: false,
        error: "MFA setup not initiated",
      })
    }

    const verified = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      window: 2,
    })

    if (!verified) {
      await logSecurityEvent({
        type: "MFA_VERIFICATION_FAILED",
        userId: req.user.id,
        userEmail: req.user.email,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        details: { token: "invalid" },
        riskLevel: "MEDIUM",
      })

      return res.status(400).json({
        success: false,
        error: "Invalid verification code",
      })
    }

    // Enable MFA for user (you'll need to add mfaSecret field to User model)
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        mfaEnabled: true,
        mfaSecret: secret, // In production, encrypt this
      },
    })

    await logSecurityEvent({
      type: "MFA_ENABLED",
      userId: req.user.id,
      userEmail: req.user.email,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      details: { method: "totp" },
      riskLevel: "LOW",
    })

    // Clear temporary secret
    delete req.session.mfaSecret

    res.json({
      success: true,
      message: "MFA enabled successfully",
    })
  } catch (error) {
    console.error("MFA verification error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to verify MFA",
    })
  }
})

// Disable MFA
router.post("/mfa/disable", async (req, res) => {
  try {
    const { password } = req.body

    // Verify password before disabling MFA
    const bcrypt = require("bcryptjs")
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    })

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        error: "Invalid password",
      })
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
      },
    })

    await logSecurityEvent({
      type: "MFA_DISABLED",
      userId: req.user.id,
      userEmail: req.user.email,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      details: { reason: "user_requested" },
      riskLevel: "MEDIUM",
    })

    res.json({
      success: true,
      message: "MFA disabled successfully",
    })
  } catch (error) {
    console.error("MFA disable error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to disable MFA",
    })
  }
})

// Get audit logs
router.get("/audit-logs", requireRole(["ADMIN"]), async (req, res) => {
  try {
    const { page = 1, limit = 50, type, riskLevel } = req.query

    // In a real implementation, you'd query from a security_events table
    const mockLogs = [
      {
        id: "1",
        type: "LOGIN",
        userId: req.user.id,
        userEmail: req.user.email,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        timestamp: new Date(),
        riskLevel: "LOW",
        details: { success: true },
      },
    ]

    res.json({
      success: true,
      data: {
        logs: mockLogs,
        pagination: {
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          total: mockLogs.length,
          pages: Math.ceil(mockLogs.length / limit),
        },
      },
    })
  } catch (error) {
    console.error("Audit logs error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to get audit logs",
    })
  }
})

// Update security settings
router.put("/settings", requireRole(["ADMIN"]), async (req, res) => {
  try {
    const { passwordPolicy, sessionTimeout, rateLimiting, auditLogging, ipWhitelist, failedLoginThreshold } = req.body

    // In a real implementation, you'd store these in a settings table
    // For now, we'll just log the change
    await logSecurityEvent({
      type: "SECURITY_SETTINGS_UPDATED",
      userId: req.user.id,
      userEmail: req.user.email,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      details: {
        passwordPolicy,
        sessionTimeout,
        rateLimiting,
        auditLogging,
        ipWhitelist,
        failedLoginThreshold,
      },
      riskLevel: "MEDIUM",
    })

    res.json({
      success: true,
      message: "Security settings updated successfully",
    })
  } catch (error) {
    console.error("Security settings update error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to update security settings",
    })
  }
})

// Helper functions
const calculateSecurityScore = (user) => {
  let score = 0

  // Base score
  score += 20

  // MFA enabled
  if (user.mfaEnabled) score += 30

  // Strong password (you'd check this based on password policy)
  score += 20

  // Recent activity (active user)
  score += 15

  // No recent security incidents
  score += 15

  return Math.min(score, 100)
}

const generateBackupCodes = () => {
  return Array.from({ length: 10 }, () => Math.random().toString(36).substring(2, 8).toUpperCase())
}

module.exports = router
