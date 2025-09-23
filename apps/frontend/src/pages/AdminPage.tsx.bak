"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Alert,
  InputAdornment,
  Grid,
  Card,
  CardContent,
} from "@mui/material"
import {
  ArrowBack,
  Add,
  Search,
  MoreVert,
  Edit,
  Delete,
  Person,
  AdminPanelSettings,
  Group,
  Security,
  Block,
  CheckCircle,
  Email,
  Business,
} from "@mui/icons-material"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "ADMIN" | "MANAGER" | "RECRUITER" | "USER"
  companyName?: string
  isActive: boolean
  createdAt: Date
  lastLogin?: Date
}

interface UserStats {
  totalUsers: number
  activeUsers: number
  adminUsers: number
  blockedUsers: number
}

const AdminPage: React.FC = () => {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState<"create" | "edit">("create")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    blockedUsers: 0,
  })
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "USER" as User["role"],
    companyName: "",
    password: "",
  })

  const [isAccessDenied, setIsAccessDenied] = useState(false)

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      setIsAccessDenied(true)
    }
  }, [user])

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("https://api.waiz.cl/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        const data = await response.json()

        if (data.success) {
          const usersData = data.data.map((user: any) => ({
            ...user,
            createdAt: new Date(user.createdAt),
            lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
          }))

          setUsers(usersData)
          setFilteredUsers(usersData)

          setStats({
            totalUsers: usersData.length,
            activeUsers: usersData.filter((u: User) => u.isActive).length,
            adminUsers: usersData.filter((u: User) => u.role === "ADMIN").length,
            blockedUsers: usersData.filter((u: User) => !u.isActive).length,
          })
        } else {
          setError("Failed to fetch users")
        }
      } catch (error) {
        console.error("Error fetching users:", error)
        setError("Failed to fetch users")
      } finally {
        setIsLoading(false)
      }
    }

    if (!isAccessDenied) {
      fetchUsers()
    }
  }, [isAccessDenied, token])

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsers(filtered)
    setPage(0)
  }, [searchTerm, users])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedUser(null)
  }

  const handleCreateUser = () => {
    setDialogType("create")
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "USER",
      companyName: "",
      password: "",
    })
    setOpenDialog(true)
  }

  const handleEditUser = () => {
    if (selectedUser) {
      setDialogType("edit")
      setFormData({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
        role: selectedUser.role,
        companyName: selectedUser.companyName || "",
        password: "",
      })
      setOpenDialog(true)
    }
    handleMenuClose()
  }

  const handleToggleUserStatus = async () => {
    if (selectedUser) {
      try {
        const response = await fetch(`https://api.waiz.cl/api/users/${selectedUser.id}/status`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        const data = await response.json()

        if (data.success) {
          const updatedUsers = users.map((u) => (u.id === selectedUser.id ? { ...u, isActive: !u.isActive } : u))
          setUsers(updatedUsers)
          setSuccess(`User ${selectedUser.isActive ? "blocked" : "activated"} successfully`)
        } else {
          setError(data.message || "Failed to update user status")
        }
      } catch (error) {
        console.error("Error updating user status:", error)
        setError("Failed to update user status")
      }
    }
    handleMenuClose()
  }

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        const response = await fetch(`https://api.waiz.cl/api/users/${selectedUser.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        const data = await response.json()

        if (data.success) {
          const updatedUsers = users.filter((u) => u.id !== selectedUser.id)
          setUsers(updatedUsers)
          setSuccess("User deleted successfully")
        } else {
          setError(data.message || "Failed to delete user")
        }
      } catch (error) {
        console.error("Error deleting user:", error)
        setError("Failed to delete user")
      }
    }
    handleMenuClose()
  }

  const handleSubmitForm = async () => {
    try {
      setError("")

      if (dialogType === "create") {
        const response = await fetch("https://api.waiz.cl/api/users", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (data.success) {
          const newUser = {
            ...data.data,
            createdAt: new Date(data.data.createdAt),
          }
          setUsers([...users, newUser])
          setSuccess("User created successfully")
        } else {
          setError(data.message || "Failed to create user")
          return
        }
      } else {
        const response = await fetch(`https://api.waiz.cl/api/users/${selectedUser?.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            role: formData.role,
            companyName: formData.companyName,
          }),
        })

        const data = await response.json()

        if (data.success) {
          const updatedUsers = users.map((u) =>
            u.id === selectedUser?.id
              ? {
                  ...u,
                  firstName: formData.firstName,
                  lastName: formData.lastName,
                  email: formData.email,
                  role: formData.role,
                  companyName: formData.companyName || undefined,
                }
              : u,
          )
          setUsers(updatedUsers)
          setSuccess("User updated successfully")
        } else {
          setError(data.message || "Failed to update user")
          return
        }
      }

      setOpenDialog(false)
    } catch (error) {
      console.error("Error saving user:", error)
      setError("Failed to save user")
    }
  }

  const getRoleColor = (role: User["role"]) => {
    switch (role) {
      case "ADMIN":
        return "error" as const
      case "MANAGER":
        return "warning" as const
      case "RECRUITER":
        return "info" as const
      case "USER":
        return "default" as const
      default:
        return "default" as const
    }
  }

  const formatLastLogin = (lastLogin?: Date) => {
    if (!lastLogin) return "Never"

    const now = new Date()
    const diff = now.getTime() - lastLogin.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes}m ago`
    } else if (hours < 24) {
      return `${hours}h ago`
    } else {
      const days = Math.floor(hours / 24)
      return `${days}d ago`
    }
  }

  if (isAccessDenied) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="error">
          <Typography variant="h6">Access Denied</Typography>
          <Typography>You don't have permission to access the admin panel.</Typography>
        </Alert>
      </Container>
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate("/dashboard")} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <AdminPanelSettings sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Panel - User Management
          </Typography>
          <Button color="inherit" startIcon={<Add />} onClick={handleCreateUser}>
            Create User
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <Group />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div">
                      {stats.totalUsers}
                    </Typography>
                    <Typography color="text.secondary">Total Users</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "success.main" }}>
                    <CheckCircle />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div">
                      {stats.activeUsers}
                    </Typography>
                    <Typography color="text.secondary">Active Users</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "error.main" }}>
                    <Security />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div">
                      {stats.adminUsers}
                    </Typography>
                    <Typography color="text.secondary">Admin Users</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "warning.main" }}>
                    <Block />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div">
                      {stats.blockedUsers}
                    </Typography>
                    <Typography color="text.secondary">Blocked Users</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, alignItems: "center" }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip label={`Total: ${filteredUsers.length}`} />
              <Chip label={`Active: ${filteredUsers.filter((u) => u.isActive).length}`} color="success" />
              <Chip label={`Blocked: ${filteredUsers.filter((u) => !u.isActive).length}`} color="error" />
            </Box>
          </Box>
        </Paper>

        {isLoading && <LinearProgress sx={{ mb: 2 }} />}

        {/* Users Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar>
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={user.role} size="small" color={getRoleColor(user.role)} />
                  </TableCell>
                  <TableCell>{user.companyName || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? "Active" : "Blocked"}
                      size="small"
                      color={user.isActive ? "success" : "error"}
                    />
                  </TableCell>
                  <TableCell>{formatLastLogin(user.lastLogin)}</TableCell>
                  <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={filteredUsers.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(Number.parseInt(e.target.value, 10))
              setPage(0)
            }}
          />
        </TableContainer>

        {/* Context Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleEditUser}>
            <Edit sx={{ mr: 1 }} />
            Edit User
          </MenuItem>
          <MenuItem onClick={handleToggleUserStatus}>
            {selectedUser?.isActive ? <Block sx={{ mr: 1 }} /> : <CheckCircle sx={{ mr: 1 }} />}
            {selectedUser?.isActive ? "Block User" : "Activate User"}
          </MenuItem>
          <MenuItem onClick={handleDeleteUser} sx={{ color: "error.main" }}>
            <Delete sx={{ mr: 1 }} />
            Delete User
          </MenuItem>
        </Menu>

        {/* Create/Edit User Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{dialogType === "create" ? "Create New User" : "Edit User"}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 1 }}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              sx={{ mt: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Company Name"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              sx={{ mt: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData({ ...formData, role: e.target.value as User["role"] })}
              >
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="RECRUITER">Recruiter</MenuItem>
                <MenuItem value="MANAGER">Manager</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </Select>
            </FormControl>
            {dialogType === "create" && (
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                sx={{ mt: 2 }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitForm} variant="contained">
              {dialogType === "create" ? "Create User" : "Update User"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default AdminPage
