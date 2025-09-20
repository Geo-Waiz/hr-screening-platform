import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Person,
  Assessment,
  PendingActions,
  CheckCircle,
  Warning,
  Add,
  Search,
  Group,
  TrendingUp
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalCandidates: number;
  pendingScreenings: number;
  completedScreenings: number;
  flaggedProfiles: number;
}

interface RecentActivity {
  id: string;
  type: 'screening_completed' | 'profile_flagged' | 'candidate_added';
  candidateName: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'flagged';
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalCandidates: 0,
    pendingScreenings: 0,
    completedScreenings: 0,
    flaggedProfiles: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalCandidates: 156,
          pendingScreenings: 23,
          completedScreenings: 133,
          flaggedProfiles: 8
        });

        setRecentActivity([
          {
            id: '1',
            type: 'screening_completed',
            candidateName: 'John Doe',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            status: 'completed'
          },
          {
            id: '2',
            type: 'profile_flagged',
            candidateName: 'Jane Smith',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            status: 'flagged'
          },
          {
            id: '3',
            type: 'candidate_added',
            candidateName: 'Mike Johnson',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
            status: 'pending'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'screening_completed':
        return <CheckCircle color="success" />;
      case 'profile_flagged':
        return <Warning color="error" />;
      case 'candidate_added':
        return <Person color="primary" />;
      default:
        return <Person />;
    }
  };

  const getActivityText = (activity: RecentActivity) => {
    switch (activity.type) {
      case 'screening_completed':
        return `Screening completed for ${activity.candidateName}`;
      case 'profile_flagged':
        return `Profile flagged for ${activity.candidateName}`;
      case 'candidate_added':
        return `New candidate added: ${activity.candidateName}`;
      default:
        return `Activity for ${activity.candidateName}`;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} days ago`;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            HR Screening Platform
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">
              {user?.firstName} {user?.lastName}
            </Typography>
            <IconButton
              size="large"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome back, {user?.firstName}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's an overview of your screening activities
          </Typography>
        </Box>

        {isLoading && <LinearProgress sx={{ mb: 2 }} />}

        {/* Stats Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Group />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.totalCandidates}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Candidates
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <PendingActions />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.pendingScreenings}
                  </Typography>
                  <Typography color="text.secondary">
                    Pending Screenings
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.completedScreenings}
                  </Typography>
                  <Typography color="text.secondary">
                    Completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <Warning />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.flaggedProfiles}
                  </Typography>
                  <Typography color="text.secondary">
                    Flagged Profiles
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Content Section */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {/* Quick Actions */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/candidates/add')}
              >
                Add Candidate
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Search />}
                onClick={() => navigate('/candidates')}
              >
                Search Candidates
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Assessment />}
                onClick={() => navigate('/reports')}
              >
                View Reports
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<TrendingUp />}
                onClick={() => navigate('/analytics')}
              >
                Analytics
              </Button>
            </Box>
          </Paper>

          {/* Recent Activity */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {recentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemIcon>
                      {getActivityIcon(activity.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={getActivityText(activity)}
                      secondary={formatTimestamp(activity.timestamp)}
                    />
                    <Chip
                      label={activity.status}
                      size="small"
                      color={
                        activity.status === 'completed' ? 'success' :
                        activity.status === 'flagged' ? 'error' : 'default'
                      }
                    />
                  </ListItem>
                  {index < recentActivity.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
