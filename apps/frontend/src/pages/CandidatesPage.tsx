import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
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
  LinearProgress
} from '@mui/material';
import {
  Search,
  Add,
  MoreVert,
  Visibility,
  Delete,
  Person,
  ArrowBack,
  CheckCircle,
  Warning,
  Pending
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  company?: string;
  status: 'pending' | 'completed' | 'flagged';
  screeningScore?: number;
  createdAt: Date;
}

const CandidatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mockCandidates: Candidate[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      position: 'Software Engineer',
      company: 'Tech Corp',
      status: 'completed',
      screeningScore: 85,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      position: 'Marketing Manager',
      company: 'Marketing Inc',
      status: 'flagged',
      screeningScore: 45,
      createdAt: new Date('2024-01-14')
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      position: 'Product Manager',
      status: 'pending',
      createdAt: new Date('2024-01-13')
    }
  ];

  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCandidates(mockCandidates);
      setFilteredCandidates(mockCandidates);
      setIsLoading(false);
    };

    fetchCandidates();
  }, []);

  useEffect(() => {
    const filtered = candidates.filter(candidate =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCandidates(filtered);
    setPage(0);
  }, [searchTerm, candidates]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusIcon = (status: Candidate['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'flagged':
        return <Warning color="error" />;
      case 'pending':
        return <Pending color="warning" />;
      default:
        return <Pending />;
    }
  };

  const getStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'completed':
        return 'success' as const;
      case 'flagged':
        return 'error' as const;
      case 'pending':
        return 'warning' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Candidates Management
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<Add />}
            onClick={() => navigate('/candidates/add')}
          >
            Add Candidate
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                placeholder="Search candidates..."
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
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label={`Total: ${filteredCandidates.length}`} />
              <Chip 
                label={`Pending: ${filteredCandidates.filter(c => c.status === 'pending').length}`} 
                color="warning" 
              />
              <Chip 
                label={`Flagged: ${filteredCandidates.filter(c => c.status === 'flagged').length}`} 
                color="error" 
              />
            </Box>
          </Box>
        </Paper>

        {isLoading && <LinearProgress sx={{ mb: 2 }} />}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Candidate</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Date Added</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCandidates
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((candidate) => (
                  <TableRow key={candidate.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {candidate.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {candidate.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{candidate.position}</TableCell>
                    <TableCell>{candidate.company || '-'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(candidate.status)}
                        <Chip
                          label={candidate.status}
                          size="small"
                          color={getStatusColor(candidate.status)}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      {candidate.screeningScore ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">
                            {candidate.screeningScore}%
                          </Typography>
                          <Box sx={{ width: 50 }}>
                            <LinearProgress
                              variant="determinate"
                              value={candidate.screeningScore}
                              color={candidate.screeningScore > 70 ? 'success' : 
                                     candidate.screeningScore > 50 ? 'warning' : 'error'}
                            />
                          </Box>
                        </Box>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {candidate.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={handleMenuOpen}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          
          <TablePagination
            component="div"
            count={filteredCandidates.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <Visibility sx={{ mr: 1 }} />
            View Details
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Delete sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>
      </Container>
    </Box>
  );
};

export default CandidatesPage;
