import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Alert,
  Link
} from '@mui/material';
import {
  Google as GoogleIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Visibility,
  VisibilityOff,
  Work,
  TrendingUp,
  Speed,
  Security
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FadeInBox, 
  SlideInLeft, 
  SlideInRight, 
  HoverLiftCard, 
  HoverScaleButton,
  GradientText,
  FloatingBox,
  StaggeredContainer,
} from '../components/animations/AnimatedComponents';
import { colors } from '../theme/saasTheme';

const ModernLoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    companyName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          companyName: formData.companyName
        });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const features = [
    {
      icon: <Work sx={{ fontSize: 40, color: colors.primary[600] }} />,
      title: "Smart ATS",
      description: "Intelligent applicant tracking with AI-powered screening"
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: colors.secondary[600] }} />,
      title: "Analytics Dashboard",
      description: "Real-time insights and hiring performance metrics"
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: colors.primary[600] }} />,
      title: "Fast Hiring",
      description: "Streamlined workflow reduces time-to-hire by 60%"
    },
    {
      icon: <Security sx={{ fontSize: 40, color: colors.secondary[600] }} />,
      title: "Secure Platform",
      description: "Enterprise-grade security with GDPR compliance"
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating Background Elements */}
      <FloatingBox
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        }}
      />
      <FloatingBox
        sx={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          animationDelay: '1s',
        }}
      />
      <FloatingBox
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '15%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          animationDelay: '2s',
        }}
      />

      <Container maxWidth="xl" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
        <Grid container spacing={0} sx={{ height: '90vh', borderRadius: 4, overflow: 'hidden', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)' }}>
          
          {/* Left Side - Features Showcase */}
          <Grid item xs={12} md={7}>
            <SlideInLeft>
              <Box
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
                  backdropFilter: 'blur(20px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  p: 6,
                  position: 'relative',
                }}
              >
                <FadeInBox sx={{ textAlign: 'center', mb: 6 }}>
                  <GradientText
                    component="h1"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      fontWeight: 800,
                      mb: 2,
                      background: 'linear-gradient(45deg, #ffffff 30%, #f0f9ff 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    HR Screening Platform
                  </GradientText>
                  <Typography
                    variant="h5"
                    sx={{
                      opacity: 0.9,
                      fontWeight: 300,
                      letterSpacing: '0.5px',
                    }}
                  >
                    Modern recruitment made simple
                  </Typography>
                </FadeInBox>

                <StaggeredContainer>
                  <Grid container spacing={4}>
                    {features.map((feature, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <HoverLiftCard>
                          <Card
                            sx={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(20px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              color: 'white',
                              height: '100%',
                            }}
                          >
                            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                              <Box sx={{ mb: 2 }}>
                                {feature.icon}
                              </Box>
                              <Typography variant="h6" gutterBottom fontWeight={600}>
                                {feature.title}
                              </Typography>
                              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                {feature.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </HoverLiftCard>
                      </Grid>
                    ))}
                  </Grid>
                </StaggeredContainer>
              </Box>
            </SlideInLeft>
          </Grid>

          {/* Right Side - Login/Register Form */}
          <Grid item xs={12} md={5}>
            <SlideInRight>
              <Box
                sx={{
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  p: 4,
                }}
              >
                <FadeInBox sx={{ mb: 4 }}>
                  <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    fontWeight={700}
                    color={colors.gray[900]}
                  >
                    {isLogin ? 'Welcome Back' : 'Get Started'}
                  </Typography>
                  <Typography
                    variant="body1"
                    color={colors.gray[600]}
                    sx={{ mb: 3 }}
                  >
                    {isLogin 
                      ? 'Sign in to your account to continue' 
                      : 'Create your account to start hiring'
                    }
                  </Typography>
                </FadeInBox>

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <Box sx={{ mb: 3 }}>
                    {!isLogin && (
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </Grid>
                      </Grid>
                    )}

                    {!isLogin && (
                      <TextField
                        fullWidth
                        label="Company Name"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                        sx={{ mb: 2 }}
                      />
                    )}

                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      }}
                    />
                  </Box>

                  <HoverScaleButton sx={{ width: '100%', mb: 3 }}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.secondary[600]} 100%)`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${colors.primary[700]} 0%, ${colors.secondary[700]} 100%)`,
                        },
                      }}
                    >
                      {loading 
                        ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                        : (isLogin ? 'Sign In' : 'Create Account')
                      }
                    </Button>
                  </HoverScaleButton>

                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color={colors.gray[500]}>
                      Or continue with
                    </Typography>
                  </Divider>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={4}>
                      <HoverScaleButton sx={{ width: '100%' }}>
                        <Button
                          fullWidth
                          variant="outlined"
                          sx={{
                            py: 1.5,
                            borderColor: colors.gray[300],
                            '&:hover': {
                              borderColor: colors.primary[500],
                              background: colors.primary[50],
                            },
                          }}
                        >
                          <GoogleIcon />
                        </Button>
                      </HoverScaleButton>
                    </Grid>
                    <Grid item xs={4}>
                      <HoverScaleButton sx={{ width: '100%' }}>
                        <Button
                          fullWidth
                          variant="outlined"
                          sx={{
                            py: 1.5,
                            borderColor: colors.gray[300],
                            '&:hover': {
                              borderColor: colors.primary[500],
                              background: colors.primary[50],
                            },
                          }}
                        >
                          <LinkedInIcon />
                        </Button>
                      </HoverScaleButton>
                    </Grid>
                    <Grid item xs={4}>
                      <HoverScaleButton sx={{ width: '100%' }}>
                        <Button
                          fullWidth
                          variant="outlined"
                          sx={{
                            py: 1.5,
                            borderColor: colors.gray[300],
                            '&:hover': {
                              borderColor: colors.primary[500],
                              background: colors.primary[50],
                            },
                          }}
                        >
                          <GitHubIcon />
                        </Button>
                      </HoverScaleButton>
                    </Grid>
                  </Grid>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color={colors.gray[600]}>
                      {isLogin ? "Don't have an account? " : "Already have an account? "}
                      <Link
                        component="button"
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        sx={{
                          color: colors.primary[600],
                          textDecoration: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {isLogin ? 'Sign up here' : 'Sign in here'}
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </SlideInRight>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ModernLoginPage;