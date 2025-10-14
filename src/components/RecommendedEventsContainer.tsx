import React, { useRef, useEffect, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import EventCard from './EventCard';
import { RecommendedEventsContainerProps } from '../types';
import { COLORS, COLORS_DARK } from '../theme';

const RecommendedEventsContainer: React.FC<RecommendedEventsContainerProps> = ({
  events,
  isDarkMode = false,
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const eventsContainerRef = useRef<HTMLDivElement>(null);

  // Use appropriate color constants based on theme mode
  const colors = isDarkMode ? COLORS_DARK : COLORS;

  // Handle scroll events for dynamic mask and button states
  useEffect(() => {
    const container = eventsContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      
      setScrollPosition(scrollLeft);
      // Small grace so buttons flip cleanly
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    };

    container.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [events]);

  const scrollToNext = () => {
    const container = eventsContainerRef.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    if (!children.length) return;

    // Dynamically calculate gap based on screen size
    const isMobile = window.innerWidth < 900; // md breakpoint
    const gap = isMobile ? 32 : 48; // gap: 4 (32px) on mobile, gap: 8 (48px) on desktop
    
    const cardWidth = children[0].offsetWidth || 240;
    const snapDistance = cardWidth + gap;
    const currentIndex = Math.round(container.scrollLeft / snapDistance);

    const targetIndex = Math.min(children.length - 1, currentIndex + 1);
    
    children[targetIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  };

  const scrollToPrevious = () => {
    const container = eventsContainerRef.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    if (!children.length) return;

    // Dynamically calculate gap based on screen size
    const isMobile = window.innerWidth < 900; // md breakpoint
    const gap = isMobile ? 32 : 48; // gap: 4 (32px) on mobile, gap: 8 (48px) on desktop
    
    const cardWidth = children[0].offsetWidth || 240;
    const snapDistance = cardWidth + gap;
    const currentIndex = Math.round(container.scrollLeft / snapDistance);

    const targetIndex = Math.max(0, currentIndex - 1);
    
    children[targetIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <Box sx={{ 
      mb: 4,
      borderRadius: '16px',
      py: 1,
      px: { xs: 0, md: 2 },
      backgroundColor: 'background.paper',
      display: 'flex',
      flexDirection: 'column',
      gap: { xs: 1, md: 2 },
      position: 'relative',
    }}>
      {/* Section Header with Navigation */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexDirection: 'column',
          justifyContent: 'space-between',
          mb: 0,
          px: 0,
          pt: 1,
          gap: 1,

        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' , gap: 0.5}}>
          {/* Subhead */}
          <Typography 
            variant="h6" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              fontSize: '12px',
              color: colors.primaryText,
              textTransform: 'uppercase',
              letterSpacing: '1%',
              pt: { xs: 0, md: 0 },
              mb: 0,
              borderRadius: '10px',
              textAlign: 'left'
            }}
          >
            Recommended Events
          </Typography>
          
          {/* Main Headline */}
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              fontSize: '28px',
              color: colors.primaryText,
              letterSpacing: '-3%',
              lineHeight: '1.2',
              textTransform: 'capitalize'
            }}
          >
            Picked for you
          </Typography>
        </Box>

        {/* Arrow Navigation Buttons */}
        <Box
          sx={{
            display: 'flex', // Show on all screen sizes
            gap: 1,
          }}
        >
        <IconButton
          onClick={scrollToPrevious}
          disabled={!canScrollLeft}
          size="small"
          sx={{
            backgroundColor: 'background.paper',
            color: 'theme.palette.text.primary',
            border: '1px solid #ccc',
            '&:hover': {
              backgroundColor: 'background.default',
            },
            '&:disabled': {
              backgroundColor: 'transparent',
              color: 'theme.palette.text.secondary',
            },
            width: 32,
            height: 32,
          }}
        >
          <ChevronLeft fontSize="small" />
        </IconButton>
        <IconButton
          onClick={scrollToNext}
          disabled={!canScrollRight}
          size="small"
          sx={{
            backgroundColor: 'background.paper',
            color: 'theme.palette.text.primary',
            border: '1px solid #ccc',
            '&:hover': {
              backgroundColor: 'background.default',
            },
            '&:disabled': {
              backgroundColor: 'transparent',
              color: 'theme.palette.text.secondary',
            },
            width: 32,
            height: 32,
          }}
        >
          <ChevronRight fontSize="small" />
        </IconButton>
        </Box>
      </Box>

      {/* Events Container */}
      <Box 
        ref={eventsContainerRef}
        id="recommended-events-container"
        className="recommended-events-container"
        sx={{ 
          display: 'flex', // Show on all screen sizes
          gap: { xs: 4, md: 6 }, // Smaller gap on mobile (32px), larger on desktop (48px)
          py: 2,
          pl: { xs: 4, md: 1.65 }, // Less padding on mobile
          pr: { xs: 8, md: 6 }, // Extra padding on mobile to show last card fully
          // Extend container width so CSS mask fades outside visible area
          width: '100%',
          overflowX: 'auto', // Enable horizontal scrolling
          overflowY: 'visible', // Prevent vertical scrolling
          // CSS Scroll Snapping
          scrollSnapType: 'x mandatory',
          scrollPaddingLeft: { xs: '24px', md: '24px' }, // Adjust scroll padding for mobile
          // Hide scrollbars
          scrollbarWidth: 'none', // Firefox
          '&::-webkit-scrollbar': {
            display: 'none', // Chrome, Safari, Edge
          },
          // Dynamic CSS mask based on scroll position
          maskImage: scrollPosition > 0 
            ? 'linear-gradient(to right, transparent 0%, black 5%, black 90%, transparent 100%)'
            : 'linear-gradient(to right, black 0%, black 90%, transparent 100%)',
          WebkitMaskImage: scrollPosition > 0 
            ? 'linear-gradient(to right, transparent 0%, black 5%, black 90%, transparent 100%)'
            : 'linear-gradient(to right, black 0%, black 90%, transparent 100%)',
          maskSize: '100% 100%', // Make mask 100% of container width
          WebkitMaskSize: '100% 100%',
          maskPosition: 'center', // Center the mask on the container
          WebkitMaskPosition: 'center',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          // Smooth transition between mask states
          transition: 'mask-image 0.2s ease-out, -webkit-mask-image 0.2s ease-out',
        }}
      >
        {events.map((event) => (
          <Box
            key={event.id}
            sx={{
              scrollSnapAlign: 'start',
              flexShrink: 0,
            }}
          >
            <EventCard event={event} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RecommendedEventsContainer;
