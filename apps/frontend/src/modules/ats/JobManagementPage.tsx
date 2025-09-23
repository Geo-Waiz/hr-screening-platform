import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Work,
  LocationOn,
  Schedule,
  People,
  TrendingUp,
  FilterList,
  Search,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { 
  FadeInBox, 
  StaggeredContainer, 
  HoverLiftCard,
  GradientText,
  ShimmerBox 
} from '../../components/animations/AnimatedComponents';
import { colors } from '../../theme/saasTheme';interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
  level: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  status: 'Draft' | 'Active' | 'Paused' | 'Closed';
  applicants: number;
  views: number;
  createdAt: Date;
  deadline: Date;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  urgency: 'Low' | 'Medium' | 'High';
}

const JobManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterDepartment, setFilterDepartment] = useState<string>('All');

  // Mock data
  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      level: 'Senior',
      status: 'Active',
      applicants: 45,
      views: 234,
      createdAt: new Date('2024-01-15'),
      deadline: new Date('2024-02-15'),
      salary: { min: 120000, max: 160000, currency: 'USD' },
      description: 'We are looking for a Senior Frontend Developer to join our team...',
      requirements: ['React', 'TypeScript', 'Next.js', '5+ years experience'],
      benefits: ['Health Insurance', 'Flexible Hours', 'Remote Work'],
      urgency: 'High',
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'New York, NY',
      type: 'Full-time',
      level: 'Mid',
      status: 'Active',
      applicants: 28,
      views: 156,
      createdAt: new Date('2024-01-10'),
      deadline: new Date('2024-02-10'),
      salary: { min: 100000, max: 130000, currency: 'USD' },
      description: 'Seeking an experienced Product Manager...',
      requirements: ['Product Strategy', 'Analytics', '3+ years experience'],
      benefits: ['Equity', 'Professional Development', 'Health Insurance'],
      urgency: 'Medium',
    },
    {
      id: '3',
      title: 'UX Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      level: 'Mid',
      status: 'Draft',
      applicants: 0,
      views: 0,
      createdAt: new Date('2024-01-20'),
      deadline: new Date('2024-02-20'),
      salary: { min: 80000, max: 110000, currency: 'USD' },
      description: 'Looking for a creative UX Designer...',
      requirements: ['Figma', 'User Research', 'Prototyping'],
      benefits: ['Remote Work', 'Creative Freedom', 'Learning Budget'],
      urgency: 'Low',
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchJobs = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setJobs(mockJobs);
      setIsLoading(false);
    };

    fetchJobs();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, job: Job) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'Active': return colors.success[500];
      case 'Draft': return colors.warning[500];
      case 'Paused': return colors.neutral[500];
      case 'Closed': return colors.error[500];
      default: return colors.neutral[500];
    }
  };

  const getUrgencyColor = (urgency: Job['urgency']) => {
    switch (urgency) {
      case 'High': return colors.error[500];
      case 'Medium': return colors.warning[500];
      case 'Low': return colors.success[500];
      default: return colors.neutral[500];
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || job.status === filterStatus;
    const matchesDepartment = filterDepartment === 'All' || job.department === filterDepartment;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const departments = ['All', ...Array.from(new Set(jobs.map(job => job.department)))];
  const statuses = ['All', 'Active', 'Draft', 'Paused', 'Closed'];

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <AnimatedSkeleton width="300px" height="40px" />
          <AnimatedSkeleton width="500px" height="20px" />
        </Box>
        <Grid container spacing={3}>
          {Array.from({ length: 6 }, (_, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card>
                <CardContent>
                  <AnimatedSkeleton width="100%" height="24px" />
                  <AnimatedSkeleton width="80%" height="16px" />
                  <AnimatedSkeleton width="60%" height="16px" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <FadeInBox>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              Job Management
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Create, manage, and track your job postings
            </Typography>
          </Box>
          <HoverScaleButton>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => navigate('/jobs/create')}
              sx={{
                background: colors.gradients.primary,
                px: 3,
                py: 1.5,
              }}
            >
              Create Job
            </Button>
          </HoverScaleButton>
        </Box>
      </FadeInBox>

      {/* Filters and Search */}
      <FadeInBox delay={200}>
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            border: `1px solid ${colors.neutral[200]}`,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: colors.neutral[400], mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  label="Department"
                >
                  {departments.map((dept) => (
                    <SelectMenuItem key={dept} value={dept}>
                      {dept}
                    </SelectMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  {statuses.map((status) => (
                    <SelectMenuItem key={status} value={status}>
                      {status}
                    </SelectMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FilterList />}
                onClick={() => setDialogOpen(true)}
              >
                More Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </FadeInBox>

      {/* Jobs Grid */}
      <StaggeredContainer staggerDelay={100}>
        <Grid container spacing={3}>
          {filteredJobs.map((job) => (
            <Grid item xs={12} md={6} lg={4} key={job.id}>
              <HoverLiftCard>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    border: `1px solid ${colors.neutral[200]}`,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Chip
                        label={job.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(job.status),
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                      <Box>
                        <Chip
                          label={job.urgency}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: getUrgencyColor(job.urgency),
                            color: getUrgencyColor(job.urgency),
                            mr: 1,
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, job)}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {job.title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: colors.neutral[600] }}>
                      <Work sx={{ fontSize: 16, mr: 1 }} />
                      <Typography variant="body2">{job.department}</Typography>
                      <Box sx={{ mx: 1 }}>•</Box>
                      <LocationOn sx={{ fontSize: 16, mr: 1 }} />
                      <Typography variant="body2">{job.location}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip label={job.type} size="small" variant="outlined" />
                      <Chip label={job.level} size="small" variant="outlined" />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: colors.neutral[600] }}>
                        <People sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2">{job.applicants} applicants</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: colors.neutral[600] }}>
                        <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2">{job.views} views</Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <HoverScaleButton sx={{ width: '100%' }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      >
                        View Details
                      </Button>
                    </HoverScaleButton>
                  </CardActions>
                </Card>
              </HoverLiftCard>
            </Grid>
          ))}
        </Grid>
      </StaggeredContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: 2, minWidth: 160 }
        }}
      >
        <MenuItem onClick={() => { navigate(`/jobs/${selectedJob?.id}`); handleMenuClose(); }}>
          <Visibility sx={{ mr: 2 }} />
          View
        </MenuItem>
        <MenuItem onClick={() => { navigate(`/jobs/${selectedJob?.id}/edit`); handleMenuClose(); }}>
          <Edit sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: colors.error[600] }}>
          <Delete sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Floating Action Button */}
      <Tooltip title="Create New Job" placement="left">
        <Fab
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: colors.gradients.primary,
            '&:hover': {
              background: colors.gradients.primary,
              filter: 'brightness(1.1)',
            },
          }}
          onClick={() => navigate('/jobs/create')}
        >
          <Add />
        </Fab>
      </Tooltip>
    </Container>
  );
};

export default JobManagementPage;