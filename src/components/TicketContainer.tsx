import React, { useRef, useEffect, useState } from 'react';
import { Box, IconButton, Typography, Link } from '@mui/material';
import { ChevronLeft, ChevronRight, CurrencyExchangeOutlined, TimerOutlined, KeyboardArrowDown, LocationOn, NearMe } from '@mui/icons-material';
import TicketCard from './TicketCard';
import InfoContainer from './InfoContainer';
import NavigationButtons from './NavigationButtons';
import CarouselIndicators from './CarouselIndicators';
import { Ticket, WaitlistItem } from '../types';
import { COLORS, COLORS_DARK } from '../theme';

interface TicketContainerProps {
  tickets: Ticket[];
  waitlistItems?: WaitlistItem[];
  title?: string;
  isDarkMode?: boolean;
  onTransfer: (ticketId: string) => void;
  onWaitlist: (ticketId: string) => void;
  onDownloadQR: (ticketId: string) => void;
  onReceipt: (ticketId: string) => void;
  onRemoveFromWaitlist: (ticketId: string) => void;
}

const TicketContainer: React.FC<TicketContainerProps> = ({
  tickets,
  waitlistItems = [],
  title = "Upcoming Events",
  isDarkMode = false,
  onTransfer,
  onWaitlist,
  onDownloadQR,
  onReceipt,
  onRemoveFromWaitlist,
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeTicketIndex, setActiveTicketIndex] = useState(0);
  const ticketsContainerRef = useRef<HTMLDivElement>(null);

  // Use appropriate color constants based on theme mode
  const colors = isDarkMode ? COLORS_DARK : COLORS;

  // Helper function to calculate time until event
  const getTimeUntilEvent = (eventDate: string) => {
    const now = new Date();
    const event = new Date(eventDate);
    
    // Set event time to end of day (23:59:59) to ensure events scheduled for "today" 
    // are considered upcoming until the day is over
    event.setHours(23, 59, 59, 999);
    
    const diffMs = event.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      return "Event has passed";
    }
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} away`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} away`;
    } else {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} away`;
    }
  };

  // Calculate upcoming events within 2 weeks
  const getUpcomingEventsCount = () => {
    const today = new Date();
    const twoWeeksFromNow = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000));
    
    return tickets.filter(ticket => {
      const eventDate = new Date(ticket.date);
      // Set event time to end of day to ensure events scheduled for "today" 
      // are considered upcoming until the day is over
      eventDate.setHours(23, 59, 59, 999);
      
      return eventDate >= today && eventDate <= twoWeeksFromNow && 
             (ticket.status === 'upcoming' || ticket.status === 'waitlisted');
    }).length;
  };

  const upcomingEventsCount = getUpcomingEventsCount();

  // Calculate waitlist statistics
  const getWaitlistStats = () => {
    const activeWaitlistItems = waitlistItems.filter(item => item.status === 'ongoing');
    
    // Find tickets that are on waitlist (status: 'waitlisted')
    const ticketsOnWaitlist = tickets.filter(ticket => ticket.status === 'waitlisted');
    
    // Find the first ticket on waitlist
    const firstWaitlistedTicket = ticketsOnWaitlist[0];
    
    // Find waitlist entry expiring soon (within 7 days)
    const expiringSoon = activeWaitlistItems.find(item => {
      const expirationDate = new Date(item.expirationDate);
      const today = new Date();
      const sevenDaysFromNow = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
      return expirationDate <= sevenDaysFromNow;
    });
    
    // Count other events on waitlist (excluding the first one)
    const otherWaitlistEvents = activeWaitlistItems.length - 1;
    
    return {
      firstWaitlistedTicket,
      expiringSoon,
      otherWaitlistEvents,
      totalActiveWaitlist: activeWaitlistItems.length,
      ticketsOnWaitlistCount: ticketsOnWaitlist.length
    };
  };

  const waitlistStats = getWaitlistStats();

  // Function to scroll to recommended events section
  const scrollToRecommendedEvents = () => {
    const recommendedSection = document.getElementById('recommended-events-container');
    if (recommendedSection) {
      recommendedSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Function to scroll to waitlist section
  const scrollToWaitlistSection = () => {
    const waitlistSection = document.getElementById('waitlist-section');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Handle scroll events for dynamic mask and button states
  useEffect(() => {
    const container = ticketsContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      
      setScrollPosition(scrollLeft);
      // Small grace so buttons flip cleanly (from Builder.io article)
      setCanScrollLeft(scrollLeft > 5); 
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
      
      // Calculate which ticket is currently active based on scroll position
      // Use requestAnimationFrame to ensure calculation happens after scroll snap
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const children = Array.from(container.children) as HTMLElement[];
          if (children.length > 0) {
            const cardWidth = children[0].offsetWidth || 1;
            const gap = 16; // Approximate gap between cards
            // Account for scroll padding (0px since parent padding removed)
            const scrollPadding = 0;
            const adjustedScrollLeft = container.scrollLeft + scrollPadding;
            const currentIndex = Math.round(adjustedScrollLeft / (cardWidth + gap));
            setActiveTicketIndex(Math.min(children.length - 1, Math.max(0, currentIndex)));
          }
        });
      });
    };

    container.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [tickets]);

  const scrollToNext = () => {
    const container = ticketsContainerRef.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    if (!children.length) return;

    // Simple approach: just scroll to the next ticket
    const currentIndex = activeTicketIndex;
    const targetIndex = Math.min(children.length - 1, currentIndex + 1);
    
    // If we're already at the last ticket, don't scroll
    if (currentIndex >= children.length - 1) {
      return;
    }
    
    // Preemptively update scroll position to trigger mask change immediately
    // This eliminates the delay caused by smooth scrolling animation
    const cardWidth = children[0].offsetWidth || 1;
    const gap = 16; // Approximate gap between cards
    const estimatedScrollLeft = targetIndex * (cardWidth + gap);
    setScrollPosition(estimatedScrollLeft); // Immediate mask update before smooth scroll starts
    
    children[targetIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  };

  const scrollToPrevious = () => {
    const container = ticketsContainerRef.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    if (!children.length) return;

    // Simple approach: just scroll to the previous ticket
    const currentIndex = activeTicketIndex;
    const targetIndex = Math.max(0, currentIndex - 1);
    
    // If we're already at the first ticket, don't scroll
    if (currentIndex <= 0) {
      return;
    }
    
    // Preemptively update scroll position to trigger mask change immediately
    // This eliminates the delay caused by smooth scrolling animation
    const cardWidth = children[0].offsetWidth || 1;
    const gap = 16; // Approximate gap between cards
    const estimatedScrollLeft = targetIndex * (cardWidth + gap);
    setScrollPosition(estimatedScrollLeft); // Immediate mask update before smooth scroll starts
    
    children[targetIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  };

  return (
    <Box 
      className="ticket-container-main"
      sx={{ 
        mb: 4,
        // backgroundColor: 'background.paper',
        // borderRadius: '16px',
        // border: `1px solid ${colors.borderLight}`,
        // boxShadow: '0px 4px 12px 0px rgba(0,0,0,.05), 0px 2px 4px 0px rgba(0,0,0,0.025)',
        pt: 1,
        pb: 2, // Mobile default - was: { xs: 2, md: 1 }
        px: 0, // Mobile default - was: { xs: 0, md: 0 }
        display: 'flex',
        flexDirection: 'column', // Mobile default - was: { xs: 'column', md: 'row' }
        gap: 1, // Mobile default - was: { xs: 1, md: 2 }
        position: 'relative',
        maxWidth: tickets.length === 1 ? '720px' : 'none',
        mx: tickets.length === 1 ? 'auto' : '0',
      }}
    >
      {/* Header Section 1 - Title, Count, Countdown, Arrows */}
      <Box 
        id="upcoming-events-header-top"
        className="upcoming-events-header-top"
        sx={{ 
          display: 'flex', 
          gap: 2, // Mobile default - was: { xs: 2, md: 6 }
          flexDirection: 'column',
          alignItems: 'center', // Mobile default - was: { xs: 'center', md: 'center' }
          justifyContent: 'center', // Mobile default - was: { xs: 'center', md: 'center' }
          mb: 0,
          pt: 2,
          pb: 0, // Mobile default - was: { xs: 0, md: 2 }
          minWidth: '100%', // Mobile default - was: { xs: '100%', md: '280px' }
          width: '100%' // Mobile default - was: { xs: '100%', md: 'auto' }
        }}
      >
        {/* KYD Summary Header */}
        <Typography 
          variant="sectionHeader" 
          component="h1" 
          sx={{ 
            color: colors.primaryText,
            pt: 0, // Mobile default - was: { xs: 0, md: 0 }
            mb: 0,
            textAlign: 'center' // Mobile default - was: { xs: 'center', md: 'left' }
          }}
        >
          YOUR TICKETS
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box 
            className="events-count-content"
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} // Mobile default - was: { xs: 'center', md: 'center' }
          >
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 600,
                fontSize: '32px',
                color: colors.primaryText,
                letterSpacing: '-.0325em',
                lineHeight: '1.1',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textTransform: 'capitalize'
              }}
            >
              You've got 
              <Box sx={{ 
                   backgroundColor: '#17C964', // Positive green (MUI success.main or similar)
                  color: 'white', 
                  borderRadius: '100px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '22px',
                  fontWeight: 500,
                  lineHeight: 1,
                  pr: 1.5,
                  pl: 1.25,
                  py: 1,
                  aspectRatio: '1/1',
                  height: '34px', // Fixed height
                  width: '34px', // Fixed width
              }}>
                {upcomingEventsCount}
              </Box>
            </Typography>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 600,
                fontSize: '32px',
                color: colors.primaryText,
                letterSpacing: '-.0325em',
                lineHeight: '1.1',
                textTransform: 'capitalize'
              }}
            >
              {upcomingEventsCount === 1 ? 'event coming up' : 'events coming up'}
            </Typography>
            <Typography 
              variant="body2" 
              component="p" 
              sx={{ 
                fontWeight: 400,
                fontSize: '17px',
                color: colors.primaryText,
                lineHeight: '1.25rem',
                textTransform: 'capitalize',
                letterSpacing: '-2%',
                mt: 1,
              }}
            >
              {tickets.length === 1 
                ? getTimeUntilEvent(tickets[0].date)
                : `${tickets.length} events booked total`
              }
            </Typography>
            
        
          </Box>
          
        </Box>
        
        {/* Arrow Navigation Buttons - Only show if there are multiple tickets */}
        {tickets.length > 1 && (
          <NavigationButtons
            onPrevious={scrollToPrevious}
            onNext={scrollToNext}
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
            colors={colors}
            size="large"
            sx={{
           display: 'none', // Mobile default - was: { xs: 'none', md: 'flex' }
            }}
          />
        )}

        {/* Carousel Indicators - Only show if there are multiple tickets */}
        <CarouselIndicators
          itemCount={tickets.length}
          activeIndex={activeTicketIndex}
          containerRef={ticketsContainerRef}
          colors={colors}
          display="flex" // Mobile default - was: { xs: 'flex', md: 'flex' }
        />
        
        {/* Summary Stats List - Desktop Only */}
        {waitlistItems.length > 0 && (
          <Box
            component="ul"
            sx={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              mt: 2,
              width: '100%',
              maxWidth: '90%',
              display: 'none', // Mobile default - was: { xs: 'none', md: 'block' } // Only show on desktop
            }}
          >
            {/* Single waitlist item */}
            <InfoContainer
              leftIcon={TimerOutlined}
              title="Waitlist"
              subtitle="1 listed • 1 joined"
              rightIcon={TimerOutlined}
              onClick={scrollToWaitlistSection}
              colors={colors}
              display={{ xs: 'none', md: 'none' }} // Mobile default - was: { xs: 'none', md: 'flex' }
            />
          </Box>
        )}

        {/* Venue Information - Desktop Only for single event */}
        {tickets.length === 1 && (
          <InfoContainer
            leftIcon={LocationOn}
            title="Directions to next event"
            subtitle={tickets[0].eventName}
            rightIcon={NearMe}
            onClick={() => {
              // Open maps with venue address
              const venue = tickets[0];
              const address = `${venue.venue}, ${venue.location}`;
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
              window.open(mapsUrl, '_blank');
            }}
            colors={colors}
            display={{ xs: 'none', md: 'none' }} // Mobile default - was: { xs: 'none', md: 'flex' }
            alignItems="flex-start"
          />
        )}
      </Box>

      {/* Tickets Container */}
      <Box 
        ref={ticketsContainerRef}
        id="upcoming-events-tickets-container"
        className="upcoming-events-tickets-container"
        sx={{ 
          display: 'flex', // Show on all screen sizes
          alignItems: 'stretch', // Make all cards stretch to same height
          gap: 2, // Mobile default - was: { xs: 2, md: 4 } // Smaller gap on mobile (16px), larger on desktop (24px)
          py: 2,
          pl: tickets.length === 1 ? 0 : 4, // Mobile default - was: { xs: tickets.length === 1 ? 0 : 4, md: 1.65 } // Conditional padding: 0 for single ticket (centered), 4 for multiple tickets (scroll snap)
          pr: tickets.length === 1 
            ? 0 // Mobile default - was: { xs: 0, md: 1.65 } // No padding on mobile for single ticket
            : 0, // Mobile default - was: { xs: 8, md: 24 } // No padding on mobile, extra right padding for multiple tickets on desktop
          // Extend container width so CSS mask fades outside visible area
          width: '100%',
          // marginLeft: '-%', // Center the extended container
          overflowX: 'auto', // Enable horizontal scrolling
          overflowY: 'visible', // Prevent vertical scrolling
          // CSS Scroll Snapping
          scrollSnapType: 'x mandatory',
          scrollPaddingLeft: '16px', // Mobile default - was: { xs: '16px', md: '24px' } // Needed for proper centering
          scrollPaddingRight: '16px', // Mobile default - was: { xs: '16px', md: '24px' } // Needed for proper centering
          // Hide scrollbars
          scrollbarWidth: 'none', // Firefox
          '&::-webkit-scrollbar': {
            display: 'none', // Chrome, Safari, Edge
          },
          // Align single ticket to the right
          justifyContent: tickets.length === 1 
            ? 'center' // Mobile default - was: { xs: 'center', md: 'flex-end' } // Center on mobile, right-align on desktop
            : 'flex-start', // Always left-align for multiple tickets
          // Dynamic CSS mask based on scroll position - only for multiple tickets
          ...(tickets.length > 1 && {
            maskImage: scrollPosition > 0 
              ? 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
              : 'linear-gradient(to right, black 0%, black 90%, transparent 100%)',
            WebkitMaskImage: scrollPosition > 0 
              ? 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
              : 'linear-gradient(to right, black 0%, black 90%, transparent 100%)',
            // Responsive mask for different screen sizes
            '@media (min-width: 900px)': {
              maskImage: scrollPosition > 0 
                ? 'linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)'
                : 'linear-gradient(to right, black 0%, black 90%, transparent 100%)',
              WebkitMaskImage: scrollPosition > 0 
                ? 'linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)'
                : 'linear-gradient(to right, black 0%, black 90%, transparent 100%)',
            },
            maskSize: '100% 100%', // Make mask 150% of container width to prevent premature cutting
            WebkitMaskSize: '100% 100%',
            maskPosition: 'center', // Center the mask on the container
            WebkitMaskPosition: 'center',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            // Smooth transition between mask states
            transition: 'mask-image 0.2s ease-out, -webkit-mask-image 0.2s ease-out',
          }),
          // Add relative positioning for absolute positioned indicators
          position: 'relative',
        }}
      >
        {tickets.map((ticket, index) => (
          <Box
            key={ticket.id}
            sx={{
              scrollSnapAlign: 'center',
              flexShrink: 0,
              transform: index === activeTicketIndex ? 'scale(1)' : 'scale(0.9)',
              filter: index === activeTicketIndex ? 'blur(0px)' : 'blur(2px) grayscale(1)',
              opacity: index === activeTicketIndex ? 1 : 0.65,
              transition: 'transform 0.3s ease-out, filter 0.3s ease-out, opacity 0.3s ease-out',
              '&:hover': {
                transform: index === activeTicketIndex ? 'scale(1)' : 'scale(0.85)',
                filter: index === activeTicketIndex ? 'blur(0px)' : 'blur(0px) grayscale(0)',
                opacity: 1,
              },
            }}
          >
            <TicketCard
              ticket={ticket}
              onTransfer={onTransfer}
              onWaitlist={onWaitlist}
              onDownloadQR={onDownloadQR}
              onReceipt={onReceipt}
              onRemoveFromWaitlist={onRemoveFromWaitlist}
            />
          </Box>
        ))}
        
        {/* Extra spacer to allow last ticket to scroll into view - only for multiple tickets */}
        {tickets.length > 1 && (
          <Box
            sx={{
              flexShrink: 0,
              width: '50vw', // Mobile default - was: { xs: '50vw', md: '50vw' } // Extra space for last ticket to center
            }}
          />
        )}

      </Box>

      {/* Mobile Additional Info Section - Venue or Waitlist */}
      {(tickets.length === 1 || waitlistItems.length > 0) && (
        <Box 
          id="upcoming-events-header-bottom"
          className="upcoming-events-header-bottom"
          sx={{ 
            display: 'flex', // Mobile default - was: { xs: 'none', md: 'none' } // Only show on mobile
            width: '100%',
            pt: 2.5,
            pb: 1,
            px: 2,
          }}
        >
          {/* Summary Stats List */}
          <Box
            component="ul"
            sx={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              mt: 0,
              width: '100%'
            }}
          >
            {/* Venue Information - Only show for single event */}
            {tickets.length === 1 && (
              <InfoContainer
                leftIcon={LocationOn}
                title='Directions to next event'
                subtitle={tickets[0].eventName}
                rightIcon={NearMe}
                onClick={() => {
                  // Open maps with venue address
                  const venue = tickets[0];
                  const address = `${venue.venue}, ${venue.location}`;
                  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
                  window.open(mapsUrl, '_blank');
                }}
                colors={colors}
                alignItems="flex-start"
              />
            )}

            {/* Waitlist Information */}
            {waitlistItems.length > 0 && (
              <InfoContainer
                leftIcon={TimerOutlined}
                title="Waitlist"
                subtitle="1 listed • 1 joined"
                rightIcon={TimerOutlined}
                onClick={scrollToWaitlistSection}
                colors={colors}
              />
            )}
          </Box>
        </Box>
      )}
      
    </Box>
  );
};

export default TicketContainer;
