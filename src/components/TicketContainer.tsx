import React, { useRef, useEffect, useState } from 'react';
import { Box, IconButton, Typography, Link } from '@mui/material';
import { ChevronLeft, ChevronRight, CurrencyExchangeOutlined, TimerOutlined, KeyboardArrowDown, LocationOn } from '@mui/icons-material';
import TicketCard from './TicketCard';
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
        borderRadius: '16px',
        py: 1,
        px: { xs: 0, md: 2 },
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 1, md: 2 },
        position: 'relative',
        maxWidth: tickets.length === 1 ? '800px' : 'none',
        mx: tickets.length === 1 ? 'auto' : '0',
      }}
    >
      {/* Header Section 1 - Title, Count, Countdown, Arrows */}
      <Box 
        id="upcoming-events-header-top"
        className="upcoming-events-header-top"
        sx={{ 
          display: 'flex', 
          gap: 2,
          flexDirection: 'column',
          alignItems: { xs: 'center', md: 'flex-start' }, 
          justifyContent: 'space-between',
          mb: 0,
          pt: 2,
          pb: { xs: 0, md: 2 },
          minWidth: { xs: '100%', md: '280px' },
          width: { xs: '100%', md: 'auto' }
        }}
      >
        {/* KYD Summary Header */}
        <Typography 
          variant="h6" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            fontSize: '12px',
            color: colors.primaryText,
            textTransform: 'uppercase',
            letterSpacing: '1%',
            // width: '100%',
            pt: { xs: 0, md: 0 },
            mb: 0,
            borderRadius: '10px',
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          Your Tickets
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box 
            className="events-count-content"
            sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}
          >
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 700,
                fontSize: '28px',
                color: colors.primaryText,
                letterSpacing: '-3%',
                lineHeight: '1.2',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textTransform: 'capitalize'
              }}
            >
              You've got 
              <Box sx={{ 
                backgroundColor: '#E84B38', 
                color: 'white', 
                borderRadius: '50%', 
                width: 32, 
                height: 32, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: 500,
                lineHeight: 2,
              }}>
                {upcomingEventsCount}
              </Box>
            </Typography>
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
              {upcomingEventsCount === 1 ? 'event coming up' : 'events coming up'}
            </Typography>
            <Typography 
              variant="body2" 
              component="p" 
              sx={{ 
                fontWeight: 400,
                fontSize: '16px',
                color: colors.primaryText,
                letterSpacing: '-0.5px',
                lineHeight: '20px',
                mt: 0.5,
              }}
            >
              {tickets.length === 1 
                ? getTimeUntilEvent(tickets[0].date)
                : `${tickets.length} events booked total`
              }
            </Typography>
            
        
          </Box>
          {/* <Box sx={{ 
            backgroundColor: colors.primaryText, 
            color: 'white', 
            borderRadius: '50%', 
            width: 26, 
            height: 26, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 500,
            ml: 0.5
          }}>
            {tickets.length}
          </Box> */}
          
        </Box>
        
        {/* Arrow Navigation Buttons - Only show if there are multiple tickets */}
        {tickets.length > 1 && (
          <Box
            className="ticket-container-arrow-navigation"
            sx={{
              display: 'flex',
              gap: 1,
              zIndex: 1,
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
        )}
        
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
              display: { xs: 'none', md: 'block' }, // Only show on desktop
            }}
          >
            {/* Single waitlist item */}
            <Box
              component="li"
              onClick={scrollToWaitlistSection}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.5,
                fontSize: '14px',
                color: colors.primaryText,
                fontWeight: 500,
                borderTop: `1px solid ${colors.borderLight}`,
                pt: 1.5,
                mb: 0,
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <TimerOutlined 
                  sx={{ 
                    fontSize: '20px', 
                    color: colors.iconColor 
                  }} 
                />
                <Box>
                  <Typography 
                    sx={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 700,
                      lineHeight: 1.2,
                      mb: 0.25
                    }}
                  >
                    Waitlist
                  </Typography>
                  <Typography 
                    sx={{ 
                      fontSize: '0.875rem', 
                      fontWeight: 500,
                      lineHeight: 1.2
                    }}
                  >
                    1 listed • 1 joined
                  </Typography>
                </Box>
              </Box>
              <KeyboardArrowDown 
                sx={{ 
                  fontSize: '20px', 
                  color: colors.iconColor 
                }} 
              />
            </Box>
          </Box>
        )}

        {/* Venue Information - Desktop Only for single event */}
        {tickets.length === 1 && (
          <Box
            className="venue-location-box"
            onClick={() => {
              // Open maps with venue address
              const venue = tickets[0];
              const address = `${venue.venue}, ${venue.location}`;
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
              window.open(mapsUrl, '_blank');
            }}
            sx={{
              display: { xs: 'none', md: 'flex' }, // Only show on desktop
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1.5,
              fontSize: '14px',
              color: colors.primaryText,
              fontWeight: 500,
              borderTop: `1px solid ${colors.borderLight}`,
              pt: 1.5,
              mb: 0,
              width: '100%',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <LocationOn 
                sx={{ 
                  fontSize: '20px', 
                  color: colors.iconColor 
                }} 
              />
              <Box>
                <Typography 
                  sx={{ 
                    fontSize: '0.85rem', 
                    fontWeight: 700,
                    lineHeight: 1.2,
                    mb: 0.25
                  }}
                >
                  {tickets[0].venue}
                </Typography>
                <Typography 
                  sx={{ 
                    fontSize: '0.875rem', 
                    fontWeight: 500,
                    lineHeight: 1.2
                  }}
                >
                  {tickets[0].location}
                </Typography>
                <Typography 
                  sx={{ 
                    fontSize: '0.875rem', 
                    fontWeight: 500,
                    color: colors.primaryText,
                    textDecoration: 'underline',
                    mt: .5
                  }}
                >
                  Get Directions
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Tickets Container */}
      <Box 
        ref={ticketsContainerRef}
        id="upcoming-events-tickets-container"
        className="upcoming-events-tickets-container"
        sx={{ 
          display: 'flex', // Show on all screen sizes
          alignItems: 'center', 
          gap: { xs: 2, md: 4 }, // Smaller gap on mobile (16px), larger on desktop (24px)
          py: 2,
          pl: { xs: tickets.length === 1 ? 0 : 4, md: 1.65 }, // Conditional padding: 0 for single ticket (centered), 4 for multiple tickets (scroll snap)
          pr: tickets.length === 1 
            ? { xs: 0, md: 1.65 } // No padding on mobile for single ticket
            : { xs: 4, md: 24 }, // No padding on mobile, extra right padding for multiple tickets on desktop
          // Extend container width so CSS mask fades outside visible area
          width: '100%',
          // marginLeft: '-%', // Center the extended container
          overflowX: 'auto', // Enable horizontal scrolling
          overflowY: 'visible', // Prevent vertical scrolling
          // CSS Scroll Snapping
          scrollSnapType: 'x mandatory',
          scrollPaddingLeft: { xs: '16px', md: '24px' }, // Needed for proper centering
          scrollPaddingRight: { xs: '16px', md: '24px' }, // Needed for proper centering
          // Hide scrollbars
          scrollbarWidth: 'none', // Firefox
          '&::-webkit-scrollbar': {
            display: 'none', // Chrome, Safari, Edge
          },
          // Align single ticket to the right
          justifyContent: tickets.length === 1 
            ? { xs: 'center', md: 'flex-end' } // Center on mobile, right-align on desktop
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
              width: { xs: '50vw', md: '50vw' }, // Extra space for last ticket to center
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
            display: { xs: 'block', md: 'none' }, // Only show on mobile
            width: '100%',
            pt: 0,
            pb: 2,
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
              mt: 2,
              width: '100%'
            }}
          >
            {/* Venue Information - Only show for single event */}
            {tickets.length === 1 && (
              <Box
                component="li"
                className="venue-location-box"
                onClick={() => {
                  // Open maps with venue address
                  const venue = tickets[0];
                  const address = `${venue.venue}, ${venue.location}`;
                  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
                  window.open(mapsUrl, '_blank');
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1.5,
                  fontSize: '14px',
                  color: colors.primaryText,
                  fontWeight: 500,
                  borderTop: `1px solid ${colors.borderLight}`,
                  pt: 1.5,
                  pb: 0,
                  mb: 0,
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <LocationOn 
                    sx={{ 
                      fontSize: '20px', 
                      color: colors.iconColor 
                    }} 
                  />
                  <Box>
                    <Typography 
                      sx={{ 
                        fontSize: '0.85rem', 
                        fontWeight: 700,
                        lineHeight: 1.2,
                        mb: 0.25
                      }}
                    >
                      {tickets[0].venue}
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: '0.875rem', 
                        fontWeight: 500,
                        lineHeight: 1.2
                      }}
                    >
                      {tickets[0].location}
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: '0.875rem', 
                        fontWeight: 500,
                        color: colors.primaryText,
                        textDecoration: 'underline',
                        mt: .5
                      }}
                    >
                      Get Directions
                    </Typography>
                  </Box>
                </Box>
                <KeyboardArrowDown 
                  sx={{ 
                    fontSize: '20px', 
                    color: colors.iconColor 
                  }} 
                />
              </Box>
            )}

            {/* Waitlist Information */}
            {waitlistItems.length > 0 && (
              <Box
                component="li"
                onClick={scrollToWaitlistSection}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1.5,
                  fontSize: '14px',
                  color: colors.primaryText,
                  fontWeight: 500,
                  borderTop: `1px solid ${colors.borderLight}`,
                  pt: 1.5,
                  mb: 0,
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <TimerOutlined 
                    sx={{ 
                      fontSize: '20px', 
                      color: colors.iconColor 
                    }} 
                  />
                  <Box>
                    <Typography 
                      sx={{ 
                        fontSize: '0.85rem', 
                        fontWeight: 700,
                        lineHeight: 1.2,
                        mb: 0.25
                      }}
                    >
                      Waitlist
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: '0.875rem', 
                        fontWeight: 500,
                        lineHeight: 1.2
                      }}
                    >
                      1 listed • 1 joined
                    </Typography>
                  </Box>
                </Box>
                <KeyboardArrowDown 
                  sx={{ 
                    fontSize: '20px', 
                    color: colors.iconColor 
                  }} 
                />
              </Box>
            )}
          </Box>
        </Box>
      )}
      
    </Box>
  );
};

export default TicketContainer;
