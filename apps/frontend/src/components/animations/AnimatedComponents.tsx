import React from 'react';
import { Box, Fade, Slide, Zoom, Grow } from '@mui/material';
import { keyframes, styled } from '@mui/material/styles';

// Animation keyframes
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Styled animated components
export const FadeInBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'delay',
})<{ delay?: number }>(({ theme, delay = 0 }) => ({
  animation: `${fadeInUp} 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms both`,
}));

export const SlideInRight = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'delay',
})<{ delay?: number }>(({ theme, delay = 0 }) => ({
  animation: `${slideInFromRight} 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms both`,
}));

export const SlideInLeft = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'delay',
})<{ delay?: number }>(({ theme, delay = 0 }) => ({
  animation: `${slideInFromLeft} 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms both`,
}));

export const ScaleInBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'delay',
})<{ delay?: number }>(({ theme, delay = 0 }) => ({
  animation: `${scaleIn} 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms both`,
}));

export const ShimmerBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.grey[200]} 0%, ${theme.palette.grey[100]} 50%, ${theme.palette.grey[200]} 100%)`,
  backgroundSize: '200px 100%',
  animation: `${shimmer} 1.5s infinite linear`,
  borderRadius: theme.shape.borderRadius,
}));

export const PulseBox = styled(Box)(({ theme }) => ({
  animation: `${pulse} 2s infinite`,
}));

export const FloatingBox = styled(Box)(({ theme }) => ({
  animation: `${float} 3s ease-in-out infinite`,
}));

// Staggered animation container
interface StaggeredContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  direction?: 'up' | 'right' | 'left' | 'scale';
}

export const StaggeredContainer: React.FC<StaggeredContainerProps> = ({
  children,
  staggerDelay = 100,
  direction = 'up',
}) => {
  const getAnimatedComponent = () => {
    switch (direction) {
      case 'right':
        return SlideInRight;
      case 'left':
        return SlideInLeft;
      case 'scale':
        return ScaleInBox;
      default:
        return FadeInBox;
    }
  };

  const AnimatedComponent = getAnimatedComponent();

  return (
    <>
      {React.Children.map(children, (child, index) => (
        <AnimatedComponent delay={index * staggerDelay} key={index}>
          {child}
        </AnimatedComponent>
      ))}
    </>
  );
};

// Interactive hover animations
export const HoverLiftCard = styled(Box)(({ theme }) => ({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.1)',
  },
  '&:active': {
    transform: 'translateY(-4px)',
  },
}));

export const HoverScaleButton = styled(Box)(({ theme }) => ({
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
}));

export const HoverRotateIcon = styled(Box)(({ theme }) => ({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'rotate(180deg)',
  },
}));

// Page transition wrapper
interface PageTransitionProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  direction = 'up',
  duration = 300,
}) => {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    setShow(true);
  }, []);

  const getSlideDirection = () => {
    switch (direction) {
      case 'left':
        return 'right';
      case 'right':
        return 'left';
      case 'down':
        return 'up';
      default:
        return 'up';
    }
  };

  return (
    <Slide direction={getSlideDirection()} in={show} timeout={duration}>
      <Box>{children}</Box>
    </Slide>
  );
};

// Loading skeleton with shimmer effect
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
  lines?: number;
}

export const AnimatedSkeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  variant = 'rectangular',
  lines = 1,
}) => {
  const getSkeletonStyles = () => {
    const baseStyles = {
      width,
      height,
      marginBottom: variant === 'text' ? '8px' : '0',
    };

    if (variant === 'circular') {
      return {
        ...baseStyles,
        borderRadius: '50%',
        width: height,
      };
    }

    if (variant === 'text') {
      return {
        ...baseStyles,
        borderRadius: '4px',
      };
    }

    return {
      ...baseStyles,
      borderRadius: '8px',
    };
  };

  if (lines > 1) {
    return (
      <Box>
        {Array.from({ length: lines }, (_, index) => (
          <ShimmerBox key={index} sx={getSkeletonStyles()} />
        ))}
      </Box>
    );
  }

  return <ShimmerBox sx={getSkeletonStyles()} />;
};

// Micro-interaction components
export const ButtonRipple = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.3)',
    transform: 'translate(-50%, -50%)',
    transition: 'width 0.6s, height 0.6s',
  },
  '&:active::before': {
    width: '300px',
    height: '300px',
  },
}));

export const GradientText = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0ea5e9 0%, #a855f7 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 'bold',
}));

export const GlowingBorder = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    padding: '2px',
    background: 'linear-gradient(135deg, #0ea5e9, #a855f7, #22c55e)',
    borderRadius: 'inherit',
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    maskComposite: 'exclude',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'destination-out',
  },
}));

export default {
  FadeInBox,
  SlideInRight,
  SlideInLeft,
  ScaleInBox,
  StaggeredContainer,
  HoverLiftCard,
  HoverScaleButton,
  PageTransition,
  AnimatedSkeleton,
  GradientText,
  GlowingBorder,
};