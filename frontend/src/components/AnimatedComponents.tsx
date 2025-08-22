import React from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Skeleton, 
  keyframes,
  styled
} from '@mui/material';

// Keyframes for animations
const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(0, 212, 255, 0.6);
  }
  100% {
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
  }
`;

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const rotateGradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Styled components
export const GlowingBox = styled(Box)(({ theme }) => ({
  animation: `${pulseGlow} 2s ease-in-out infinite`,
  borderRadius: 16,
  border: '1px solid rgba(0, 212, 255, 0.3)',
  background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
}));

export const FloatingBox = styled(Box)(({ theme }) => ({
  animation: `${floatAnimation} 3s ease-in-out infinite`,
}));

export const AnimatedGradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #00D4FF, #6C5CE7, #00B894, #00D4FF)',
  backgroundSize: '400% 400%',
  animation: `${rotateGradient} 4s ease infinite`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  fontWeight: 'bold',
})) as typeof Typography;

// Loading Components
export const BlockchainLoader: React.FC<{ size?: number }> = ({ size = 60 }) => (
  <GlowingBox sx={{ p: 4, textAlign: 'center', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
      <CircularProgress
        size={size}
        thickness={4}
        sx={{
          color: 'primary.main',
          animationDuration: '1.5s',
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body2" component="div" sx={{ color: 'primary.main', fontSize: '0.8rem' }}>
          ⛓️
        </Typography>
      </Box>
    </Box>
    <AnimatedGradientText variant="body2">
      Connecting to Blockchain...
    </AnimatedGradientText>
  </GlowingBox>
);

export const LandCardSkeleton: React.FC = () => (
  <Box sx={{ p: 2 }}>
    <Skeleton
      variant="rectangular"
      height={200}
      sx={{
        borderRadius: 2,
        bgcolor: 'rgba(255, 255, 255, 0.1)',
        animation: `${pulseGlow} 2s ease-in-out infinite`,
      }}
    />
    <Box sx={{ mt: 2 }}>
      <Skeleton
        variant="text"
        height={30}
        width="80%"
        sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
      />
      <Skeleton
        variant="text"
        height={20}
        width="60%"
        sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mt: 1 }}
      />
      <Skeleton
        variant="text"
        height={20}
        width="40%"
        sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mt: 1 }}
      />
    </Box>
  </Box>
);

export const MapSkeleton: React.FC = () => (
  <Box sx={{ height: 400, position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
    <Skeleton
      variant="rectangular"
      height="100%"
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.1)',
        animation: `${pulseGlow} 3s ease-in-out infinite`,
      }}
    />
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" sx={{ color: 'primary.main', mb: 1 }}>
        🗺️
      </Typography>
      <AnimatedGradientText variant="body2">
        Loading Interactive Map...
      </AnimatedGradientText>
    </Box>
  </Box>
);

export const SearchBarSkeleton: React.FC = () => (
  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
    <Skeleton
      variant="rectangular"
      height={56}
      sx={{
        flex: 1,
        borderRadius: 3,
        bgcolor: 'rgba(255, 255, 255, 0.1)',
      }}
    />
    <Skeleton
      variant="rectangular"
      height={56}
      width={120}
      sx={{
        borderRadius: 3,
        bgcolor: 'rgba(0, 212, 255, 0.2)',
        animation: `${pulseGlow} 2s ease-in-out infinite`,
      }}
    />
  </Box>
);

// Stats Card with Animation
export const AnimatedStatsCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: number;
}> = ({ title, value, icon, trend }) => (
  <FloatingBox>
    <GlowingBox sx={{ p: 3, textAlign: 'center', cursor: 'pointer' }}>
      <Box sx={{ fontSize: '2rem', mb: 1 }}>{icon}</Box>
      <AnimatedGradientText variant="h4" gutterBottom>
        {value}
      </AnimatedGradientText>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      {trend && (
        <Typography
          variant="caption"
          sx={{
            color: trend > 0 ? 'success.main' : 'error.main',
            fontWeight: 'bold',
          }}
        >
          {trend > 0 ? '↗️' : '↘️'} {Math.abs(trend)}%
        </Typography>
      )}
    </GlowingBox>
  </FloatingBox>
);

// Page transition wrapper
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      opacity: 0,
      animation: 'fadeIn 0.5s ease-in-out forwards',
      '@keyframes fadeIn': {
        '0%': {
          opacity: 0,
          transform: 'translateY(20px)',
        },
        '100%': {
          opacity: 1,
          transform: 'translateY(0)',
        },
      },
    }}
  >
    {children}
  </Box>
);
