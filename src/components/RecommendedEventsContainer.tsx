import React, { useRef, useEffect, useState } from 'react';
import { Box, IconButton, Typography, Collapse } from '@mui/material';
import { ChevronLeft, ChevronRight, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import EventCard from './EventCard';
import NavigationButtons from './NavigationButtons';
import CarouselIndicators from './CarouselIndicators';
import { RecommendedEventsContainerProps } from '../types';
import { COLORS, COLORS_DARK } from '../theme';
import { transitions } from '../utils/transitions';

const RecommendedEventsContainer: React.FC<RecommendedEventsContainerProps> = ({
  events,
  isDarkMode = false,
}) => {
  const eventsContainerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Use appropriate color constants based on theme mode
  const colors = isDarkMode ? COLORS_DARK : COLORS;

  // Track active carousel index based on scroll position
  useEffect(() => {
    const container = eventsContainerRef.current;
    if (!container) return;

    const updateActiveIndex = () => {
      const children = Array.from(container.children) as HTMLElement[];
      if (!children.length) return;

      // Dynamically calculate gap based on screen size
      const isMobile = window.innerWidth < 900; // md breakpoint
      const gap = isMobile ? 32 : 48; // gap: 4 (32px) on mobile, gap: 8 (48px) on desktop
      
      const cardWidth = children[0].offsetWidth || 260;
      const snapDistance = cardWidth + gap;
      const currentIndex = Math.round(container.scrollLeft / snapDistance);
      
      setActiveIndex(Math.max(0, Math.min(children.length - 1, currentIndex)));
    };

    container.addEventListener('scroll', updateActiveIndex);
    // Initial calculation
    updateActiveIndex();

    return () => {
      container.removeEventListener('scroll', updateActiveIndex);
    };
  }, [events.length]);

  const scrollToNext = () => {
    const container = eventsContainerRef.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    if (!children.length) return;

    // Dynamically calculate gap based on screen size
    const isMobile = window.innerWidth < 900; // md breakpoint
    const gap = isMobile ? 32 : 48; // gap: 4 (32px) on mobile, gap: 8 (48px) on desktop
    
    const cardWidth = children[0].offsetWidth || 260;
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
    
    const cardWidth = children[0].offsetWidth || 260;
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
      border: `1px solid ${colors.borderLight}`,
      borderRadius: '16px',
      py: 1,
      px: { xs: 0, md: 0 },
      backgroundColor: 'background.paper',
      display: 'flex',
      flexDirection: 'column',
      gap: { xs: 1, md: 1 },
      position: 'relative',
      boxShadow: '0px 4px 12px 0px rgba(0,0,0,.05), 0px 2px 4px 0px rgba(0,0,0,0.025)',
    }}>
      {/* Section Header with Navigation */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: { xs: 'center', md: 'center' }, 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          mb: 0,
          px: 3,
          pt: 2,
          gap: 2,
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 1,
            flex: 1
          }}
        >
          {/* Subhead */}
          <Typography 
            variant="sectionHeader" 
            component="h1" 
            sx={{ 
              color: colors.primaryText,
              pt: { xs: 0, md: 0 },
              mb: 0,
              textAlign: 'left',
              ...transitions.A(isExpanded),
            }}
          >
            Picked For You
          </Typography>
          
          {/* Main Headline */}
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              fontWeight: 600,
              fontSize: '32px',
              color: colors.primaryText,
              letterSpacing: '-.0325em',
              lineHeight: '1.1',
              textTransform: 'capitalize',
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            Recommended Events
          </Typography>

        </Box>


          {/* Arrow Navigation Buttons */}
          <NavigationButtons
            onPrevious={scrollToPrevious}
            onNext={scrollToNext}
            colors={colors}
            size="large"
            sx={{
              ...transitions.A(isExpanded),
              overflow: 'visible',
              display: { xs: 'none', md: 'flex' },
            }}
          />


      </Box>

      {/* Carousel Indicators Container */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 1,
        }}
      >
        <CarouselIndicators
          itemCount={events.length}
          activeIndex={activeIndex}
          containerRef={eventsContainerRef}
          colors={colors}
          display={{ xs: 'flex', md: 'flex' }}
        />
      </Box>

      {/* Events Container */}
      <Collapse in={isExpanded} timeout={200} easing="ease-out" unmountOnExit>
        <Box 
          ref={eventsContainerRef}
          id="recommended-events-container"
          className="recommended-events-container"
          sx={{ 
            display: 'flex', // Show on all screen sizes
            gap: { xs: 4, md: 6 }, // Smaller gap on mobile (32px), larger on desktop (48px)
            pt: { xs: 0, md: 2 },
            pb: { xs: 2, md: 2 },
            px: { xs: 4, md: 6 }, // Padding for mobile and desktop
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
      </Collapse>
    </Box>
  );
};

export default RecommendedEventsContainer;
