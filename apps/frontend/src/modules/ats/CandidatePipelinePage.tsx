import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  MoreVert,
  Person,
  Email,
  Phone,
  LocationOn,
  School,
  Work,
  Star,
  StarBorder,
  Schedule,
  CheckCircle,
  Cancel,
  Flag,
  Add,
  FilterList,
  Search,
} from '@mui/icons-material';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  FadeInBox,
  StaggeredContainer,
  HoverLiftCard,
  HoverScaleButton,
  AnimatedSkeleton,
} from '../../components/animations/AnimatedComponents';
import { colors } from '../../theme/saasTheme';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  position: string;
  avatar?: string;
  experience: string;
  education: string;
  skills: string[];
  rating: number;
  appliedDate: Date;
  lastActivity: Date;
  source: string;
  salary: {
    expected: number;
    currency: string;
  };
  status: string;
  notes: string;
  priority: 'Low' | 'Medium' | 'High';
}

interface PipelineStage {
  id: string;
  title: string;
  color: string;
  icon: React.ElementType;
  candidates: Candidate[];
  description: string;
}

const CandidatePipelinePage: React.FC = () => {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Mock data
  const mockCandidates: Candidate[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      position: 'Senior Frontend Developer',
      experience: '5+ years',
      education: 'BS Computer Science',
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
      rating: 4,
      appliedDate: new Date('2024-01-15'),
      lastActivity: new Date('2024-01-20'),
      source: 'LinkedIn',
      salary: { expected: 120000, currency: 'USD' },
      status: 'applied',
      notes: 'Strong technical background, great portfolio',
      priority: 'High',
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob.smith@email.com',
      phone: '+1 (555) 987-6543',
      location: 'New York, NY',
      position: 'Product Manager',
      experience: '3 years',
      education: 'MBA',
      skills: ['Product Strategy', 'Analytics', 'Agile', 'Leadership'],
      rating: 5,
      appliedDate: new Date('2024-01-10'),
      lastActivity: new Date('2024-01-18'),
      source: 'Company Website',
      salary: { expected: 110000, currency: 'USD' },
      status: 'screening',
      notes: 'Excellent communication skills',
      priority: 'Medium',
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol.davis@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Austin, TX',
      position: 'UX Designer',
      experience: '4 years',
      education: 'BFA Design',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      rating: 4,
      appliedDate: new Date('2024-01-08'),
      lastActivity: new Date('2024-01-22'),
      source: 'Referral',
      salary: { expected: 95000, currency: 'USD' },
      status: 'interview',
      notes: 'Creative portfolio, good culture fit',
      priority: 'High',
    },
  ];

  const initialStages: PipelineStage[] = [
    {
      id: 'applied',
      title: 'Applied',
      color: colors.neutral[500],
      icon: Person,
      candidates: [mockCandidates[0]],
      description: 'New applications received',
    },
    {
      id: 'screening',
      title: 'Screening',
      color: colors.warning[500],
      icon: Schedule,
      candidates: [mockCandidates[1]],
      description: 'Initial screening in progress',
    },
    {
      id: 'interview',
      title: 'Interview',
      color: colors.primary[500],
      icon: CheckCircle,
      candidates: [mockCandidates[2]],
      description: 'Interview scheduled or completed',
    },
    {
      id: 'offer',
      title: 'Offer',
      color: colors.success[500],
      icon: Star,
      candidates: [],
      description: 'Offer extended',
    },
    {
      id: 'hired',
      title: 'Hired',
      color: colors.success[700],
      icon: CheckCircle,
      candidates: [],
      description: 'Successfully hired',
    },
    {
      id: 'rejected',
      title: 'Rejected',
      color: colors.error[500],
      icon: Cancel,
      candidates: [],
      description: 'Application rejected',
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStages(initialStages);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === destination.droppableId) {
      // Reordering within the same stage
      const stage = stages.find(s => s.id === source.droppableId);
      if (!stage) return;

      const newCandidates = Array.from(stage.candidates);
      const [removed] = newCandidates.splice(source.index, 1);
      newCandidates.splice(destination.index, 0, removed);

      setStages(stages.map(s => 
        s.id === source.droppableId 
          ? { ...s, candidates: newCandidates }
          : s
      ));
    } else {
      // Moving between stages
      const sourceStage = stages.find(s => s.id === source.droppableId);
      const destStage = stages.find(s => s.id === destination.droppableId);
      
      if (!sourceStage || !destStage) return;

      const sourceCandidates = Array.from(sourceStage.candidates);
      const destCandidates = Array.from(destStage.candidates);
      const [moved] = sourceCandidates.splice(source.index, 1);
      
      // Update candidate status
      moved.status = destination.droppableId;
      moved.lastActivity = new Date();
      
      destCandidates.splice(destination.index, 0, moved);

      setStages(stages.map(s => {
        if (s.id === source.droppableId) {
          return { ...s, candidates: sourceCandidates };
        }
        if (s.id === destination.droppableId) {
          return { ...s, candidates: destCandidates };
        }
        return s;
      }));
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, candidate: Candidate) => {
    setAnchorEl(event.currentTarget);
    setSelectedCandidate(candidate);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCandidate(null);
  };

  const getPriorityColor = (priority: Candidate['priority']) => {
    switch (priority) {
      case 'High': return colors.error[500];
      case 'Medium': return colors.warning[500];
      case 'Low': return colors.success[500];
      default: return colors.neutral[500];
    }
  };

  const CandidateCard: React.FC<{ candidate: Candidate; index: number }> = ({ candidate, index }) => (
    <Draggable draggableId={candidate.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <HoverLiftCard
            sx={{
              opacity: snapshot.isDragging ? 0.8 : 1,
              transform: snapshot.isDragging ? 'rotate(5deg)' : 'none',
            }}
          >
            <Paper
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 3,
                border: `1px solid ${colors.neutral[200]}`,
                cursor: 'grab',
                '&:active': {
                  cursor: 'grabbing',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      mr: 2,
                      background: colors.gradients.primary,
                    }}
                  >
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {candidate.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {candidate.position}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    size="small"
                    label={candidate.priority}
                    sx={{
                      backgroundColor: getPriorityColor(candidate.priority),
                      color: 'white',
                      fontSize: '0.75rem',
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, candidate)}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: colors.neutral[600] }}>
                <Email sx={{ fontSize: 14, mr: 1 }} />
                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                  {candidate.email}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: colors.neutral[600] }}>
                <LocationOn sx={{ fontSize: 14, mr: 1 }} />
                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                  {candidate.location}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Box key={i} sx={{ color: i < candidate.rating ? colors.warning[400] : colors.neutral[300] }}>
                    {i < candidate.rating ? <Star sx={{ fontSize: 16 }} /> : <StarBorder sx={{ fontSize: 16 }} />}
                  </Box>
                ))}
                <Typography variant="body2" sx={{ ml: 1, color: colors.neutral[600] }}>
                  {candidate.rating}/5
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {candidate.skills.slice(0, 3).map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                ))}
                {candidate.skills.length > 3 && (
                  <Chip
                    label={`+${candidate.skills.length - 3}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Applied {candidate.appliedDate.toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  ${candidate.salary.expected.toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          </HoverLiftCard>
        </div>
      )}
    </Draggable>
  );

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <AnimatedSkeleton width="300px" height="40px" />
          <AnimatedSkeleton width="500px" height="20px" />
        </Box>
        <Grid container spacing={3}>
          {Array.from({ length: 6 }, (_, index) => (
            <Grid item xs={12} md={2} key={index}>
              <Paper sx={{ p: 2, minHeight: 400 }}>
                <AnimatedSkeleton width="100%" height="24px" />
                <AnimatedSkeleton width="60%" height="16px" />
                <Box sx={{ mt: 2 }}>
                  {Array.from({ length: 3 }, (_, i) => (
                    <Box key={i} sx={{ mb: 2 }}>
                      <AnimatedSkeleton width="100%" height="120px" />
                    </Box>
                  ))}
                </Box>
              </Paper>
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
              Candidate Pipeline
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Drag and drop candidates through your hiring stages
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <HoverScaleButton>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setDialogOpen(true)}
              >
                Filters
              </Button>
            </HoverScaleButton>
            <HoverScaleButton>
              <Button
                variant="contained"
                startIcon={<Add />}
                sx={{ background: colors.gradients.primary }}
              >
                Add Candidate
              </Button>
            </HoverScaleButton>
          </Box>
        </Box>
      </FadeInBox>

      {/* Search */}
      <FadeInBox delay={200}>
        <Paper
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 3,
            border: `1px solid ${colors.neutral[200]}`,
          }}
        >
          <TextField
            fullWidth
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: colors.neutral[400], mr: 1 }} />,
            }}
          />
        </Paper>
      </FadeInBox>

      {/* Pipeline Stages */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <StaggeredContainer staggerDelay={100}>
          <Grid container spacing={2}>
            {stages.map((stage) => (
              <Grid item xs={12} md={2} key={stage.id}>
                <Paper
                  sx={{
                    minHeight: 600,
                    borderRadius: 3,
                    border: `1px solid ${colors.neutral[200]}`,
                    overflow: 'hidden',
                  }}
                >
                  {/* Stage Header */}
                  <Box
                    sx={{
                      p: 2,
                      background: `linear-gradient(135deg, ${stage.color}, ${stage.color}dd)`,
                      color: 'white',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <stage.icon sx={{ mr: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
                        {stage.title}
                      </Typography>
                      <Badge
                        badgeContent={stage.candidates.length}
                        color="secondary"
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            color: stage.color,
                            fontWeight: 600,
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.8rem' }}>
                      {stage.description}
                    </Typography>
                  </Box>

                  {/* Droppable Area */}
                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          p: 2,
                          minHeight: 500,
                          backgroundColor: snapshot.isDraggingOver 
                            ? `${stage.color}08` 
                            : 'transparent',
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        {stage.candidates.map((candidate, index) => (
                          <CandidateCard
                            key={candidate.id}
                            candidate={candidate}
                            index={index}
                          />
                        ))}
                        {provided.placeholder}
                        
                        {stage.candidates.length === 0 && (
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: 200,
                              color: colors.neutral[400],
                              textAlign: 'center',
                            }}
                          >
                            <stage.icon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
                            <Typography variant="body2">
                              No candidates in this stage
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Droppable>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </StaggeredContainer>
      </DragDropContext>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: 2, minWidth: 180 }
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Person sx={{ mr: 2 }} />
          View Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Email sx={{ mr: 2 }} />
          Send Email
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Schedule sx={{ mr: 2 }} />
          Schedule Interview
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Flag sx={{ mr: 2 }} />
          Add Note
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default CandidatePipelinePage;