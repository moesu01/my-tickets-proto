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
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,.15)' : theme.palette.background.paper,
        border: (theme) => theme.palette.mode === 'dark' ? `1px solid rgba(255,255,255,.05)` : `1px solid ${colors.borderLight}`,
        boxShadow: '0px 4px 12px 0px rgba(0,0,0,.05), 0px 2px 4px 0px rgba(0,0,0,0.025)',
        p: 1.5,
        mb: 0,
        borderRadius: '16px',
        cursor: 'pointer',
        width: '100%',
        maxWidth: { xs: '300px', md: 'none' },
        mx: { xs: 'auto', md: '0' },
        position: 'relative',
        transition: 'all 200ms ease-out',
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
            transform: 'translateY(-2px)',
            
      
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
              fontSize: '0.875rem', // 14px equivalent
              fontWeight: 600,
              color: colors.primaryText,
              lineHeight: '1.25rem',
            }}
          >
            {title}
          </Typography>
          <Typography 
            sx={{ 
              fontSize: '0.875rem', 
              fontWeight: 400,
              color: colors.primaryText,
              lineHeight: '1.25rem',
              textTransform: 'none'
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
        
        //   border: `1px solid ${colors.borderLight}`,
        //   backgroundColor: 'background.paper',
        //   boxShadow: (theme) =>
        //     theme.palette.mode === 'dark'
        //       ? '0px 4px 12px 0px rgba(255,255,255,0.15)'
        //       : '0px 4px 12px 0px rgba(0,0,0,.05), 0px 2px 4px 0px rgba(0,0,0,0.025)',

          borderRadius: '8px',
          paddingTop: '2px',
          transition: 'all 200ms ease-out',
          willChange: 'transform, background-color, box-shadow',
        }}
      >
        <RightIcon 
          className="right-icon"
          sx={{ 
            fontSize: '34px', 
            color:(theme) => theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.35)'
              : 'rgba(0,0,0,0.25)',
            transition: 'all 200ms ease-out',
            willChange: 'color, filter'
          }} 
        />
      </Box>

    </Box>
  );
};

export default InfoContainer;
