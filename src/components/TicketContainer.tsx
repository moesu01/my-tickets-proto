import React, { useRef, useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import TicketCard from './TicketCard';
import { Ticket } from '../types';

interface TicketContainerProps {
  tickets: Ticket[];
  onTransfer: (ticketId: string) => void;
  onWaitlist: (ticketId: string) => void;
  onDownloadQR: (ticketId: string) => void;
  onReceipt: (ticketId: string) => void;
  onRemoveFromWaitlist: (ticketId: string) => void;
}

const TicketContainer: React.FC<TicketContainerProps> = ({
  tickets,
  onTransfer,
  onWaitlist,
  onDownloadQR,
  onReceipt,
  onRemoveFromWaitlist,
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const ticketsContainerRef = useRef<HTMLDivElement>(null);

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

    const cardWidth = children[0].offsetWidth || 1;
    const currentIndex = Math.round(container.scrollLeft / cardWidth);

    const targetIndex = Math.min(children.length - 1, currentIndex + 1);
    
    children[targetIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  };

  const scrollToPrevious = () => {
    const container = ticketsContainerRef.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    if (!children.length) return;

    const cardWidth = children[0].offsetWidth || 1;
    const currentIndex = Math.round(container.scrollLeft / cardWidth);

    const targetIndex = Math.max(0, currentIndex - 1);
    
    children[targetIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Arrow Navigation Buttons */}
      <Box
        sx={{
          position: 'absolute',
          top: -60, // Position above the container
          right: 0,
          display: 'flex', // Show on all screen sizes
          gap: 1,
          zIndex: 1,
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

      {/* Tickets Container */}
      <Box 
        ref={ticketsContainerRef}
        id="upcoming-events-tickets-container"
        className="upcoming-events-tickets-container"
        sx={{ 
          display: 'flex', // Show on all screen sizes
          gap: { xs: 2, md: 4 }, // Smaller gap on mobile (16px), larger on desktop (24px)
          pb: 2,
          pl: { xs: 1, md: 1.65 }, // Less padding on mobile
          pr: { xs: 1, md: 6 }, // Less padding on mobile
          // Extend container width so CSS mask fades outside visible area
          width: '100%',
          // marginLeft: '-%', // Center the extended container
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
          maskSize: '100% 100%', // Make mask 150% of container width to prevent premature cutting
          WebkitMaskSize: '100% 100%',
          maskPosition: 'center', // Center the mask on the container
          WebkitMaskPosition: 'center',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          // Smooth transition between mask states
          transition: 'mask-image 0.2s ease-out, -webkit-mask-image 0.2s ease-out',
        }}
      >
        {tickets.map((ticket) => (
          <Box
            key={ticket.id}
            sx={{
              scrollSnapAlign: 'start',
              flexShrink: 0,
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
      </Box>
    </Box>
  );
};

export default TicketContainer;
