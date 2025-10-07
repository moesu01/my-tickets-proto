import React, { useRef, useEffect, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import EventCard from './EventCard';
import { RecommendedEventsContainerProps } from '../types';

const RecommendedEventsContainer: React.FC<RecommendedEventsContainerProps> = ({
  events,
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const eventsContainerRef = useRef<HTMLDivElement>(null);

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

    // Account for card width + gap (240px + 24px = 264px)
    const cardWidth = children[0].offsetWidth || 240;
    const gap = 24; // gap: 4 in MUI = 24px
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

    // Account for card width + gap (240px + 24px = 264px)
    const cardWidth = children[0].offsetWidth || 240;
    const gap = 24; // gap: 4 in MUI = 24px
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
      backgroundColor: '#fafafa',
      p: 1.5, // 12px padding
      borderRadius: '8px',
      boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08)'
    }}>
      {/* Section Header with Navigation */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 3,
          px: 0
        }}
      >
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            fontWeight: 400,
            fontSize: '20px',
            color: '#4a5568',
            letterSpacing: '-0.6px',
            lineHeight: '24px'
          }}
        >
          Shows picked for you
        </Typography>

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
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #e2e8f0',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
            '&:disabled': {
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              color: '#a0aec0',
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
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #e2e8f0',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
            '&:disabled': {
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              color: '#a0aec0',
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
          gap: { xs: 2, md: 4 }, // Smaller gap on mobile (16px), larger on desktop (24px)
          pb: 2,
          pl: { xs: 1, md: 1.65 }, // Less padding on mobile
          pr: { xs: 1, md: 6 }, // Less padding on mobile
          // Extend container width so CSS mask fades outside visible area
          width: '100%',
          overflowX: 'auto', // Enable horizontal scrolling
          overflowY: 'visible', // Prevent vertical scrolling
          // CSS Scroll Snapping
          scrollSnapType: 'x mandatory',
          scrollPaddingLeft: { xs: '16px', md: '24px' }, // Adjust scroll padding for mobile
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
