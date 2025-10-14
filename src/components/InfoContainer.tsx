import React from 'react';
import { Box, Typography } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface InfoContainerProps {
  leftIcon: SvgIconComponent;
  title: string;
  subtitle: string;
  rightIcon: SvgIconComponent;
  onClick: () => void;
  colors: {
    primaryText: string;
    iconColor: string;
    borderLight: string;
  };
  display?: {
    xs?: string;
    md?: string;
  };
  alignItems?: 'center' | 'flex-start';
}

const InfoContainer: React.FC<InfoContainerProps> = ({
  leftIcon: LeftIcon,
  title,
  subtitle,
  rightIcon: RightIcon,
  onClick,
  colors,
  display = { xs: 'flex', md: 'flex' },
  alignItems = 'center'
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: display,
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        fontSize: '14px',
        color: colors.primaryText,
        fontWeight: 500,
        border: `1px solid ${colors.borderLight}`,
        p: 1.5,
        mb: 0,
        borderRadius: '8px',
        cursor: 'pointer',
        width: '100%',
        position: 'relative',
        transition: 'all 0.2s ease-out',
        willChange: 'transform, opacity, background-color, box-shadow',
        // Touch-hitbox using ::after with inset
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: '-16px', // Expands clickable area by 16px in all directions
          zIndex: 9999,
        },
          '&:hover': {
            opacity: 1,
      
          // Right icon hover effects triggered by container hover
          '& .right-icon-container': {
            backgroundColor: 'background.hover',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            borderColor: 'transparent',
            '& .MuiSvgIcon-root': {
              color: '#1976d2', // Blue color
              filter: 'drop-shadow(0 2px 6px rgba(25, 118, 210, .5))', // Blue glow effect on SVG paths
            }
          }
        }
      }}
    >
        
      <Box sx={{ display: 'flex', alignItems: alignItems, gap: 1.5 }}>
        {/* <LeftIcon 
          sx={{ 
            fontSize: '20px', 
            color: colors.iconColor 
          }} 
        /> */}
        <Box>
          <Typography 
            sx={{ 
              fontSize: '0.85rem', 
              fontWeight: 700,
              lineHeight: 1.2,
              mb: 0.25
            }}
          >
            {title}
          </Typography>
          <Typography 
            sx={{ 
              fontSize: '0.875rem', 
              fontWeight: 500,
              lineHeight: 1.2
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Box>
      <Box
        className="right-icon-container"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          aspectRatio: '1/1',
          border: `1px solid ${colors.borderLight}`,
          borderRadius: '8px',
          padding: '8px',
          transition: 'all 0.1s ease-out',
          willChange: 'transform, background-color, box-shadow',
        }}
      >
        <RightIcon 
          sx={{ 
            fontSize: '24px', 
            color: colors.iconColor,
            transition: 'all 0.2s ease-out',
            willChange: 'color, filter'
          }} 
        />
      </Box>
    </Box>
  );
};

export default InfoContainer;
