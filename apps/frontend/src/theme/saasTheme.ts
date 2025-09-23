import { createTheme, alpha } from '@mui/material/styles';

// Modern SaaS Color Palette
const colors = {
  // Primary - Professional Blue
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main primary
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Secondary - Vibrant Purple
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7', // Main secondary
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  
  // Success - Modern Green
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main success
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Warning - Warm Orange
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main warning
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Error - Modern Red
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Main error
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Neutral - Cool Grays
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Gradients for modern SaaS look
  gradients: {
    primary: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    secondary: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
    success: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    warm: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    cool: 'linear-gradient(135deg, #64748b 0%, #334155 100%)',
    aurora: 'linear-gradient(135deg, #0ea5e9 0%, #a855f7 50%, #22c55e 100%)',
  }
};

// Animation configurations
export const animations = {
  // Timing functions
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Duration
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
  
  // Keyframes
  keyframes: {
    fadeIn: {
      '0%': { opacity: 0, transform: 'translateY(10px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
    slideInRight: {
      '0%': { opacity: 0, transform: 'translateX(30px)' },
      '100%': { opacity: 1, transform: 'translateX(0)' },
    },
    slideInLeft: {
      '0%': { opacity: 0, transform: 'translateX(-30px)' },
      '100%': { opacity: 1, transform: 'translateX(0)' },
    },
    scaleIn: {
      '0%': { opacity: 0, transform: 'scale(0.9)' },
      '100%': { opacity: 1, transform: 'scale(1)' },
    },
    pulse: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
    shimmer: {
      '0%': { backgroundPosition: '-200px 0' },
      '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
    },
  },
};

// Create the modern SaaS theme
export const saasTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[500],
      light: colors.primary[300],
      dark: colors.primary[700],
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.secondary[500],
      light: colors.secondary[300],
      dark: colors.secondary[700],
      contrastText: '#ffffff',
    },
    error: {
      main: colors.error[500],
      light: colors.error[300],
      dark: colors.error[700],
    },
    warning: {
      main: colors.warning[500],
      light: colors.warning[300],
      dark: colors.warning[700],
    },
    success: {
      main: colors.success[500],
      light: colors.success[300],
      dark: colors.success[700],
    },
    background: {
      default: colors.neutral[50],
      paper: '#ffffff',
    },
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[600],
    },
    divider: colors.neutral[200],
  },
  
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: colors.neutral[700],
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: colors.neutral[600],
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.025em',
    },
  },
  
  shape: {
    borderRadius: 12,
  },
  
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.04), 0px 1px 2px rgba(0, 0, 0, 0.08)',
    '0px 1px 5px rgba(0, 0, 0, 0.04), 0px 3px 4px rgba(0, 0, 0, 0.08)',
    '0px 2px 8px rgba(0, 0, 0, 0.04), 0px 4px 6px rgba(0, 0, 0, 0.08)',
    '0px 4px 12px rgba(0, 0, 0, 0.04), 0px 2px 8px rgba(0, 0, 0, 0.08)',
    '0px 8px 16px rgba(0, 0, 0, 0.04), 0px 4px 12px rgba(0, 0, 0, 0.08)',
    '0px 12px 24px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.08)',
    '0px 16px 32px rgba(0, 0, 0, 0.04), 0px 12px 24px rgba(0, 0, 0, 0.08)',
    '0px 24px 48px rgba(0, 0, 0, 0.04), 0px 16px 32px rgba(0, 0, 0, 0.08)',
    '0px 32px 64px rgba(0, 0, 0, 0.04), 0px 24px 48px rgba(0, 0, 0, 0.08)',
    '0px 40px 80px rgba(0, 0, 0, 0.04), 0px 32px 64px rgba(0, 0, 0, 0.08)',
    '0px 48px 96px rgba(0, 0, 0, 0.04), 0px 40px 80px rgba(0, 0, 0, 0.08)',
    '0px 56px 112px rgba(0, 0, 0, 0.04), 0px 48px 96px rgba(0, 0, 0, 0.08)',
    '0px 64px 128px rgba(0, 0, 0, 0.04), 0px 56px 112px rgba(0, 0, 0, 0.08)',
    '0px 72px 144px rgba(0, 0, 0, 0.04), 0px 64px 128px rgba(0, 0, 0, 0.08)',
    '0px 80px 160px rgba(0, 0, 0, 0.04), 0px 72px 144px rgba(0, 0, 0, 0.08)',
    '0px 88px 176px rgba(0, 0, 0, 0.04), 0px 80px 160px rgba(0, 0, 0, 0.08)',
    '0px 96px 192px rgba(0, 0, 0, 0.04), 0px 88px 176px rgba(0, 0, 0, 0.08)',
    '0px 104px 208px rgba(0, 0, 0, 0.04), 0px 96px 192px rgba(0, 0, 0, 0.08)',
    '0px 112px 224px rgba(0, 0, 0, 0.04), 0px 104px 208px rgba(0, 0, 0, 0.08)',
    '0px 120px 240px rgba(0, 0, 0, 0.04), 0px 112px 224px rgba(0, 0, 0, 0.08)',
    '0px 128px 256px rgba(0, 0, 0, 0.04), 0px 120px 240px rgba(0, 0, 0, 0.08)',
    '0px 136px 272px rgba(0, 0, 0, 0.04), 0px 128px 256px rgba(0, 0, 0, 0.08)',
    '0px 144px 288px rgba(0, 0, 0, 0.04), 0px 136px 272px rgba(0, 0, 0, 0.08)',
    '0px 152px 304px rgba(0, 0, 0, 0.04), 0px 144px 288px rgba(0, 0, 0, 0.08)',
  ],
  
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: colors.gradients.primary,
          '&:hover': {
            background: colors.gradients.primary,
            filter: 'brightness(1.1)',
          },
        },
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${colors.neutral[200]}`,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.04), 0px 1px 2px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.06), 0px 4px 12px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: colors.neutral[50],
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: '#ffffff',
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              boxShadow: `0 0 0 3px ${alpha(colors.primary[500], 0.1)}`,
            },
          },
        },
      },
    },
    
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${colors.neutral[200]}`,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.04)',
          color: colors.neutral[900],
        },
      },
    },
    
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.04), 0px 1px 2px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

// Export colors for use in components
export { colors };

export default saasTheme;