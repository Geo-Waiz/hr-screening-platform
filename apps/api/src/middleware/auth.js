const jwt = require("jsonwebtoken")
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET environment variable is required")
  process.exit(1)
}

if (process.env.JWT_SECRET.length < 32) {
  console.error("FATAL: JWT_SECRET must be at least 32 characters long")
  process.exit(1)
}

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access token required",
      })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (jwtError) {
      console.log("[v0] JWT verification failed:", jwtError.message)
      return res.status(403).json({
        success: false,
        error: "Invalid or expired token",
      })
    }

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { company: true },
    })

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
      })
    }

    req.user = user
    req.companyId = user.companyId
    next()
  } catch (error) {
    console.error("[v0] Authentication error:", error)
    return res.status(403).json({
      success: false,
      error: "Authentication failed",
    })
  }
}

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Insufficient permissions",
      })
    }

    next()
  }
}

module.exports = { authenticateToken, requireRole }
