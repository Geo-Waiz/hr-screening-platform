import React from 'react';
import { Box, styled, keyframes } from '@mui/material';

// Animation keyframes
const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
  0% { opacity: 0; transform: translateX(-30px); }
  100% { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  0% { opacity: 0; transform: translateX(30px); }
  100% { opacity: 1; transform: translateX(0); }
`;

const scaleIn = keyframes`
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
  40%, 43% { transform: translate3d(0, -8px, 0); }
  70% { transform: translate3d(0, -4px, 0); }
  90% { transform: translate3d(0, -2px, 0); }
`;

// Animated Box Components
export const FadeInBox = styled(Box)(() => ({
  animation: `${fadeIn} 0.6s ease-out forwards`,
  opacity: 0,
}));

export const SlideInLeft = styled(Box)(() => ({
  animation: `${slideInLeft} 0.8s ease-out forwards`,
  opacity: 0,
}));

export const SlideInRight = styled(Box)(() => ({
  animation: `${slideInRight} 0.8s ease-out forwards`,
  opacity: 0,
}));

export const ScaleInBox = styled(Box)(() => ({
  animation: `${scaleIn} 0.5s ease-out forwards`,
  opacity: 0,
}));

export const FloatingBox = styled(Box)(() => ({
  animation: `${float} 3s ease-in-out infinite`,
}));

export const BounceBox = styled(Box)(() => ({
  animation: `${bounce} 2s infinite`,
}));

// Interactive Animated Components
export const HoverLiftCard = styled(Box)(() => ({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  },
}));

export const HoverScaleButton = styled(Box)(() => ({
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
}));

export const ShimmerBox = styled(Box)(() => ({
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 2s infinite`,
}));

// Gradient Text Component
export const GradientText = styled(Box)(() => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}));

// Staggered Animation Container
interface StaggeredContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
}

export const StaggeredContainer: React.FC<StaggeredContainerProps> = ({ 
  children, 
  staggerDelay = 100 
}) => {
  return (
    <Box>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            style: {
              ...((child as React.ReactElement<any>).props.style || {}),
              animationDelay: `${index * staggerDelay}ms`,
            },
          });
        }
        return child;
      })}
    </Box>
  );
};

// Page Transition Wrapper
interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <FadeInBox
      sx={{
        opacity: 1,
        minHeight: '100vh',
      }}
    >
      {children}
    </FadeInBox>
  );
};