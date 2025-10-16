import React from 'react';
import { Box, IconButton, SxProps, Theme } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  canScrollLeft?: boolean;
  canScrollRight?: boolean;
  colors: {
    borderLight: string;
  };
  size?: 'small' | 'medium' | 'large';
  sx?: SxProps<Theme>;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
  canScrollLeft = true,
  canScrollRight = true,
  colors,
  size = 'large',
  sx = {},
}) => {
  // Map size prop to MUI IconButton size and icon fontSize
  const getSizeProps = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small':
        return { buttonSize: 'small' as const, iconSize: 'small' as const };
      case 'medium':
        return { buttonSize: 'medium' as const, iconSize: 'medium' as const };
      case 'large':
        return { buttonSize: 'large' as const, iconSize: 'large' as const };
      default:
        return { buttonSize: 'large' as const, iconSize: 'large' as const };
    }
  };

  const { buttonSize, iconSize } = getSizeProps(size);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        zIndex: 1,
        ...sx,
      }}
    >
      <IconButton
        onClick={onPrevious}
        disabled={!canScrollLeft}
        size={buttonSize}
        sx={{
          backgroundColor: 'background.paper',
          color: 'theme.palette.text.primary',
          border: `1px solid ${colors.borderLight}`,
          borderRadius: '16px',
          padding: '4px 4px',
          boxShadow: '0px 4px 12px 0px rgba(0,0,0,.05), 0px 2px 4px 0px rgba(0,0,0,0.025)',
          transition: 'all 150ms ease-out',
          '&:hover': {
            backgroundColor: 'background.default',
          },
          '&:disabled': {
            opacity: 1,
            cursor: 'not-allowed',
            boxShadow: 'none',
          },
          '&:active': {
            boxShadow: 'none',
            transform: 'translateY(1.5px)',
          },
        }}
      >
        <ChevronLeft fontSize={iconSize} />
      </IconButton>
      <IconButton
        onClick={onNext}
        disabled={!canScrollRight}
        size={buttonSize}
        sx={{
          backgroundColor: 'background.paper',
          color: 'theme.palette.text.primary',
          border: `1px solid ${colors.borderLight}`,
          borderRadius: '16px',
          padding: '4px 4px',
          boxShadow: '0px 4px 12px 0px rgba(0,0,0,.05), 0px 2px 4px 0px rgba(0,0,0,0.025)',
          transition: 'all 150ms ease-out',
          '&:hover': {
            backgroundColor: 'background.default',
          },
          '&:disabled': {
            opacity: .5,
            cursor: 'not-allowed',
            boxShadow: 'none',
          },
          '&:active': {
            boxShadow: 'none',
            transform: 'translateY(1.5px)',
          },
        }}
      >
        <ChevronRight fontSize={iconSize} />
      </IconButton>
    </Box>
  );
};

export default NavigationButtons;
