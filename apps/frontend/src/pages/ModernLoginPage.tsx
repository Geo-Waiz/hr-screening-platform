import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  Divider,
  Grid,
  alpha,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google,
  Microsoft,
  LinkedIn,
  ArrowForward,
  Security,
  Speed,
  Analytics,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 100%)`,
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <FloatingBox
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: colors.gradients.primary,
          opacity: 0.1,
        }}
      />
      <FloatingBox
        sx={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: colors.gradients.secondary,
          opacity: 0.1,
          animationDelay: '1s',
        }}
      />
      <FloatingBox
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '20%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: colors.gradients.success,
          opacity: 0.1,
          animationDelay: '2s',
        }}
      />

      <Container maxWidth="xl">
        <Grid container spacing={4} alignItems="center" sx={{ minHeight: '100vh' }}>
          {/* Left side - Branding and features */}
          <Grid item xs={12} lg={6}>
            <SlideInLeft>
              <Box sx={{ pr: { lg: 8 } }}>
                <FadeInBox delay={200}>
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: colors.gradients.primary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        <Security sx={{ color: 'white', fontSize: 28 }} />
                      </Box>
                      <GradientText component="span" sx={{ fontSize: '1.5rem', fontWeight: 800 }}>
                        TalentFlow ATS
                      </GradientText>
                    </Box>
                    <Typography variant="h2" sx={{ mb: 2, fontWeight: 800 }}>
                      Welcome to the
                      <br />
                      <GradientText component="span">Future of Hiring</GradientText>
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
                      Streamline your recruitment process with AI-powered screening, 
                      intelligent candidate matching, and comprehensive analytics.
                    </Typography>
                  </Box>
                </FadeInBox>

                <StaggeredContainer staggerDelay={150} direction="up">
                  <HoverLiftCard>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 3,
                        mb: 2,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${alpha(colors.primary[200], 0.3)}`,
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: colors.gradients.primary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 3,
                        }}
                      >
                        <Speed sx={{ color: 'white' }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          AI-Powered Screening
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Automatically screen and rank candidates with advanced AI algorithms
                        </Typography>
                      </Box>
                    </Box>
                  </HoverLiftCard>

                  <HoverLiftCard>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 3,
                        mb: 2,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${alpha(colors.secondary[200], 0.3)}`,
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: colors.gradients.secondary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 3,
                        }}
                      >
                        <Analytics sx={{ color: 'white' }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Smart Analytics
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Get insights into your hiring process with detailed analytics
                        </Typography>
                      </Box>
                    </Box>
                  </HoverLiftCard>

                  <HoverLiftCard>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 3,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${alpha(colors.success[200], 0.3)}`,
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: colors.gradients.success,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 3,
                        }}
                      >
                        <Security sx={{ color: 'white' }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Enterprise Security
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Bank-level security with GDPR compliance and data protection
                        </Typography>
                      </Box>
                    </Box>
                  </HoverLiftCard>
                </StaggeredContainer>
              </Box>
            </SlideInLeft>
          </Grid>

          {/* Right side - Login form */}
          <Grid item xs={12} lg={6}>
            <SlideInRight>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <HoverLiftCard sx={{ maxWidth: 480, width: '100%' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 6,
                      borderRadius: 4,
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${alpha(colors.neutral[200], 0.3)}`,
                    }}
                  >
                    <FadeInBox delay={400}>
                      <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                          Sign In
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          Access your ATS dashboard
                        </Typography>
                      </Box>
                    </FadeInBox>

                    {error && (
                      <FadeInBox delay={500}>
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                          {error}
                        </Alert>
                      </FadeInBox>
                    )}

                    <FadeInBox delay={600}>
                      <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          sx={{ mb: 3 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />

                        <TextField
                          fullWidth
                          label="Password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          sx={{ mb: 2 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock color="action" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={togglePasswordVisibility} edge="end">
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />

                        <Box sx={{ textAlign: 'right', mb: 3 }}>
                          <Link
                            component={RouterLink}
                            to="/forgot-password"
                            variant="body2"
                            sx={{ color: colors.primary[600] }}
                          >
                            Forgot Password?
                          </Link>
                        </Box>

                        <HoverScaleButton sx={{ width: '100%', mb: 3 }}>
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={isLoading || !email || !password}
                            endIcon={!isLoading && <ArrowForward />}
                            sx={{
                              py: 1.5,
                              fontSize: '1rem',
                              fontWeight: 600,
                              background: colors.gradients.primary,
                              '&:hover': {
                                background: colors.gradients.primary,
                                filter: 'brightness(1.1)',
                              },
                            }}
                          >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                          </Button>
                        </HoverScaleButton>

                        <Divider sx={{ my: 3 }}>
                          <Typography variant="body2" color="text.secondary">
                            Or continue with
                          </Typography>
                        </Divider>

                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                          <HoverScaleButton sx={{ flex: 1 }}>
                            <Button
                              fullWidth
                              variant="outlined"
                              startIcon={<Google />}
                              sx={{ borderColor: colors.neutral[300] }}
                            >
                              Google
                            </Button>
                          </HoverScaleButton>
                          <HoverScaleButton sx={{ flex: 1 }}>
                            <Button
                              fullWidth
                              variant="outlined"
                              startIcon={<Microsoft />}
                              sx={{ borderColor: colors.neutral[300] }}
                            >
                              Microsoft
                            </Button>
                          </HoverScaleButton>
                          <HoverScaleButton sx={{ flex: 1 }}>
                            <Button
                              fullWidth
                              variant="outlined"
                              startIcon={<LinkedIn />}
                              sx={{ borderColor: colors.neutral[300] }}
                            >
                              LinkedIn
                            </Button>
                          </HoverScaleButton>
                        </Box>

                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Don't have an account?{' '}
                            <Link
                              component={RouterLink}
                              to="/register"
                              sx={{ color: colors.primary[600], fontWeight: 600 }}
                            >
                              Sign Up
                            </Link>
                          </Typography>
                        </Box>
                      </Box>
                    </FadeInBox>
                  </Paper>
                </HoverLiftCard>
              </Box>
            </SlideInRight>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ModernLoginPage;