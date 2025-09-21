const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

// Import routes
const authRoutes = require("./routes/auth")
const candidatesRoutes = require("./routes/candidates")
const screeningsRoutes = require("./routes/screenings")
const analyticsRoutes = require("./routes/analytics")
const securityRoutes = require("./routes/security")
const bulkRoutes = require("./routes/bulk")
const usersRoutes = require("./routes/users")

// Import middleware
const authMiddleware = require("./middleware/auth")

const app = express()
const PORT = process.env.PORT || 3000

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})
app.use("/api/", limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "HR Screening API",
  })
})

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/candidates", authMiddleware, candidatesRoutes)
app.use("/api/screenings", authMiddleware, screeningsRoutes)
app.use("/api/analytics", authMiddleware, analyticsRoutes)
app.use("/api/security", authMiddleware, securityRoutes)
app.use("/api/bulk", authMiddleware, bulkRoutes)
app.use("/api/users", authMiddleware, usersRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 HR Screening API running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully")
  process.exit(0)
})

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully")
  process.exit(0)
})
