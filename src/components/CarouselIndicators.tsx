import React, { RefObject } from 'react';
import { Box } from '@mui/material';

interface CarouselIndicatorsProps {
  itemCount: number;
  activeIndex: number;
  containerRef: any;
  colors: any;
  display?: any;
}

const CarouselIndicators: React.FC<CarouselIndicatorsProps> = ({
  itemCount,
  activeIndex,
  containerRef,
  colors,
  display = { xs: 'flex', md: 'flex' },
}) => {
  const handleIndicatorClick = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    
    const children = Array.from(container.children) as HTMLElement[];
    if (children[index]) {
      children[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  };

  // Don't render if there's only one item
  if (itemCount <= 1) return null;

  return (
    <Box
      className="carousel-indicators"
      sx={{
        display,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        my: 1,
        height: '16px',
      }}
    >
      {Array.from({ length: itemCount }, (_, index) => (
        <Box
          key={index}
          className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
          sx={{
            width: index === activeIndex ? 6 : 8,
            height: index === activeIndex ? '100%' : 8,
            marginX: index === activeIndex ? -0.25 : 0,
            borderRadius: index === activeIndex ? '8px' : '50%',
            backgroundColor: colors.primaryText,
            opacity: index === activeIndex ? 1 : 0.3,
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              opacity: index === activeIndex ? 1 : 0.6,
            },
          }}
          onClick={() => handleIndicatorClick(index)}
        />
      ))}
    </Box>
  );
};

export default CarouselIndicators;
