const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const validator = require("validator")
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

// Rate limiting middleware
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { success: false, error: message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: async (req, res) => {
      // Log rate limit violation
      await logSecurityEvent({
        type: "RATE_LIMIT_EXCEEDED",
        userId: req.user?.id || "anonymous",
        userEmail: req.user?.email || "unknown",
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        details: {
          endpoint: req.path,
          method: req.method,
          limit: max,
          windowMs,
        },
        riskLevel: "MEDIUM",
      })

      res.status(429).json({
        success: false,
        error: message,
      })
    },
  })
}

// Different rate limits for different endpoints
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  "Too many authentication attempts, please try again later",
)

const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  "Too many API requests, please try again later",
)

const bulkOperationLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  10, // limit each IP to 10 bulk operations per hour
  "Too many bulk operations, please try again later",
)

// Input validation middleware
const validateInput = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        error: "Invalid input data",
        details: error.details.map((detail) => detail.message),
      })
    }
    next()
  }
}

// Sanitize input data
const sanitizeInput = (req, res, next) => {
  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = validator.escape(obj[key].trim())
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitizeObject(obj[key])
      }
    }
  }

  if (req.body) {
    sanitizeObject(req.body)
  }
  if (req.query) {
    sanitizeObject(req.query)
  }
  if (req.params) {
    sanitizeObject(req.params)
  }

  next()
}

// IP whitelist middleware
const ipWhitelist = (whitelist = []) => {
  return (req, res, next) => {
    if (whitelist.length === 0) {
      return next()
    }

    const clientIP = req.ip
    const isWhitelisted = whitelist.some((ip) => {
      if (ip.includes("/")) {
        // CIDR notation
        return isIPInCIDR(clientIP, ip)
      }
      return clientIP === ip
    })

    if (!isWhitelisted) {
      logSecurityEvent({
        type: "IP_NOT_WHITELISTED",
        userId: req.user?.id || "anonymous",
        userEmail: req.user?.email || "unknown",
        ipAddress: clientIP,
        userAgent: req.get("User-Agent"),
        details: { whitelist },
        riskLevel: "HIGH",
      })

      return res.status(403).json({
        success: false,
        error: "Access denied from this IP address",
      })
    }

    next()
  }
}

// Role-based access control
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      })
    }

    if (!allowedRoles.includes(req.user.role)) {
      logSecurityEvent({
        type: "PERMISSION_DENIED",
        userId: req.user.id,
        userEmail: req.user.email,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        details: {
          requiredRoles: allowedRoles,
          userRole: req.user.role,
          endpoint: req.path,
        },
        riskLevel: "MEDIUM",
      })

      return res.status(403).json({
        success: false,
        error: "Insufficient permissions",
      })
    }

    next()
  }
}

// Permission-based access control
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      })
    }

    const userPermissions = getRolePermissions(req.user.role)

    if (!userPermissions.includes(permission)) {
      logSecurityEvent({
        type: "PERMISSION_DENIED",
        userId: req.user.id,
        userEmail: req.user.email,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        details: {
          requiredPermission: permission,
          userPermissions,
          endpoint: req.path,
        },
        riskLevel: "MEDIUM",
      })

      return res.status(403).json({
        success: false,
        error: "Insufficient permissions",
      })
    }

    next()
  }
}

// Get permissions for a role
const getRolePermissions = (role) => {
  const permissions = {
    ADMIN: [
      "candidates:read",
      "candidates:write",
      "candidates:delete",
      "candidates:bulk",
      "users:read",
      "users:write",
      "users:delete",
      "security:read",
      "security:write",
      "analytics:read",
    ],
    MANAGER: ["candidates:read", "candidates:write", "candidates:bulk", "analytics:read"],
    RECRUITER: ["candidates:read", "candidates:write"],
    USER: ["candidates:read"],
  }

  return permissions[role] || []
}

// Security event logging
const logSecurityEvent = async (eventData) => {
  try {
    // In a real implementation, you might want to use a dedicated logging service
    // or store in a separate audit log table
    console.log("Security Event:", JSON.stringify(eventData, null, 2))

    // Store in database (you might want to create a SecurityEvent model)
    // await prisma.securityEvent.create({ data: eventData });

    // Send to external security monitoring service
    // await sendToSecurityMonitoring(eventData);
  } catch (error) {
    console.error("Failed to log security event:", error)
  }
}

// Account lockout tracking
const accountLockouts = new Map()

const checkAccountLockout = async (email) => {
  const lockoutData = accountLockouts.get(email)

  if (lockoutData && lockoutData.lockedUntil > Date.now()) {
    const remainingTime = Math.ceil((lockoutData.lockedUntil - Date.now()) / 1000 / 60)
    throw new Error(`Account locked. Try again in ${remainingTime} minutes.`)
  }

  return true
}

const recordFailedLogin = async (email, ip) => {
  const key = `${email}:${ip}`
  const attempts = accountLockouts.get(key) || { count: 0, firstAttempt: Date.now() }

  attempts.count++
  attempts.lastAttempt = Date.now()

  // Lock account after 5 failed attempts within 15 minutes
  if (attempts.count >= 5 && attempts.lastAttempt - attempts.firstAttempt < 15 * 60 * 1000) {
    attempts.lockedUntil = Date.now() + 30 * 60 * 1000 // Lock for 30 minutes

    await logSecurityEvent({
      type: "ACCOUNT_LOCKED",
      userId: "unknown",
      userEmail: email,
      ipAddress: ip,
      details: {
        failedAttempts: attempts.count,
        lockoutDuration: 30,
      },
      riskLevel: "HIGH",
    })
  }

  accountLockouts.set(key, attempts)
}

const clearFailedLogins = (email, ip) => {
  const key = `${email}:${ip}`
  accountLockouts.delete(key)
}

// CIDR IP checking utility
const isIPInCIDR = (ip, cidr) => {
  const [range, bits] = cidr.split("/")
  const mask = ~(2 ** (32 - bits) - 1)
  return (ip2int(ip) & mask) === (ip2int(range) & mask)
}

const ip2int = (ip) => {
  return ip.split(".").reduce((int, oct) => (int << 8) + Number.parseInt(oct, 10), 0) >>> 0
}

// Enhanced helmet configuration
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.waiz.cl"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
})

module.exports = {
  authLimiter,
  apiLimiter,
  bulkOperationLimiter,
  validateInput,
  sanitizeInput,
  ipWhitelist,
  requireRole,
  requirePermission,
  logSecurityEvent,
  checkAccountLockout,
  recordFailedLogin,
  clearFailedLogins,
  securityHeaders,
  getRolePermissions,
}
