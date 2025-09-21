const express = require("express")
const bcrypt = require("bcryptjs")
const { PrismaClient } = require("@prisma/client")
const { authenticateToken, requireRole } = require("../middleware/auth")

const router = express.Router()
const prisma = new PrismaClient()

// Get all users (Admin only)
router.get("/", authenticateToken, requireRole(["ADMIN"]), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        companyName: true,
        isActive: true,
        createdAt: true,
        lastLogin: true,
      },
      orderBy: { createdAt: "desc" },
    })

    res.json({
      success: true,
      data: users,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    })
  }
})

// Create new user (Admin only)
router.post("/", authenticateToken, requireRole(["ADMIN"]), async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, companyName } = req.body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role || "USER",
        companyName,
        isActive: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        companyName: true,
        isActive: true,
        createdAt: true,
      },
    })

    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully",
    })
  } catch (error) {
    console.error("Error creating user:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create user",
    })
  }
})

// Update user (Admin only)
router.put("/:id", authenticateToken, requireRole(["ADMIN"]), async (req, res) => {
  try {
    const { id } = req.params
    const { firstName, lastName, email, role, companyName } = req.body

    const user = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        role,
        companyName,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        companyName: true,
        isActive: true,
        createdAt: true,
      },
    })

    res.json({
      success: true,
      data: user,
      message: "User updated successfully",
    })
  } catch (error) {
    console.error("Error updating user:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update user",
    })
  }
})

// Toggle user status (Admin only)
router.patch("/:id/status", authenticateToken, requireRole(["ADMIN"]), async (req, res) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: { id },
      select: { isActive: true },
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        companyName: true,
        isActive: true,
        createdAt: true,
      },
    })

    res.json({
      success: true,
      data: updatedUser,
      message: `User ${updatedUser.isActive ? "activated" : "blocked"} successfully`,
    })
  } catch (error) {
    console.error("Error updating user status:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
    })
  }
})

// Delete user (Admin only)
router.delete("/:id", authenticateToken, requireRole(["ADMIN"]), async (req, res) => {
  try {
    const { id } = req.params

    await prisma.user.delete({
      where: { id },
    })

    res.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    })
  }
})

module.exports = router
