import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import TicketCard from './TicketCard';
import { Ticket } from '../types';

interface MobileTicketContainerProps {
  tickets: Ticket[];
  onTransfer: (ticketId: string) => void;
  onWaitlist: (ticketId: string) => void;
  onDownloadQR: (ticketId: string) => void;
  onReceipt: (ticketId: string) => void;
  onRemoveFromWaitlist: (ticketId: string) => void;
}

type ViewMode = 'stacked' | 'expanded';

const MobileTicketContainer: React.FC<MobileTicketContainerProps> = ({
  tickets,
  onTransfer,
  onWaitlist,
  onDownloadQR,
  onReceipt,
  onRemoveFromWaitlist,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('stacked');
  const containerRef = useRef<HTMLDivElement>(null);

  // Sort tickets by date (most upcoming first - closest to today)
  // Then reverse for flexbox so first card appears in front
  const sortedTickets = [...tickets].sort((a, b) => {
    const today = new Date();
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    // Calculate days from today for each ticket
    const daysA = Math.abs(dateA.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    const daysB = Math.abs(dateB.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    
    // Sort by closest to today first
    return daysA - daysB;
  }).reverse(); // Reverse for flexbox - first card in front

  const handleCardClick = () => {
    if (viewMode === 'stacked') {
      // First click: expand all cards
      setViewMode('expanded');
    }
  };

  const handleClose = () => {
    setViewMode('stacked');
  };

  const getCardStyle = (index: number) => {
    const baseStyle = {
      transition: `transform 0.4s ease-out,
                   margin-top 0.2s ease-out,
\                   filter 0.2s ease-out `,
      cursor: 'pointer',
      zIndex: tickets.length - index,
      willChange: 'transform, margin-top, filter',
    };

    // Calculate proper negative margin based on card height and scale
    const cardHeight = 400; // Approximate height of a ticket card
    const baseIncrement = 20; // Base increment
    const scale = index === 0 ? 1.0 : index === 1 ? 0.85 : index === 2 ? 0.1 : 0.01; // Custom scale factors
    const scaledIncrement = baseIncrement * scale; // Scale the increment proportionally
    const negativeMargin = index === 0 ? 0 : -(cardHeight + 100 + (index * scaledIncrement));

    switch (viewMode) {
      case 'stacked':
        return {
          ...baseStyle,
          transform: `scale(${1 - index * 0.1})`,
          marginTop: `${negativeMargin}px`,
          opacity: 1,
          filter: `brightness(${1 - index * 0.15})`,
        };
      
      case 'expanded':
        return {
          ...baseStyle,
          transform: 'scale(1)',
          marginTop: '0px',
          marginBottom: '24px',
          opacity: 1,
          zIndex: tickets.length - index, // Keep same z-index as stacked
          filter: 'brightness(1)',
        };
      
      default:
        return baseStyle;
    }
  };

  const getContainerStyle = () => {
    const baseStyle = {
      position: 'relative' as const,
      height: viewMode === 'stacked' ? '500px' : '100vh',
      overflow: viewMode === 'expanded' ? 'auto' : 'hidden',
      padding: '0',
      maxHeight: viewMode === 'expanded' ? '100vh' : 'none',
      backgroundColor: 'transparent',
      borderRadius: '0',
      margin: '0',
      display: 'flex',
      alignItems: viewMode === 'stacked' ? 'center' : 'flex-start',
      justifyContent: 'center',
      transition: 'height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), overflow 0.3s ease-out',
      willChange: 'height, overflow',
      // Always hide scrollbars to prevent flash
      scrollbarWidth: 'none', // Firefox
      '&::-webkit-scrollbar': {
        display: 'none', // Chrome, Safari, Edge
      },
    };

    return baseStyle;
  };

  return (
    <Box
      ref={containerRef}
      className="mobile-ticket-container"
      sx={{
        ...getContainerStyle(),
        // Mobile-specific styles
        '@media (min-width: 768px)': {
          display: 'none', // Hide on tablet and desktop
        },
      }}
    >
      {/* Cards container */}
      <Box
        className={`mobile-ticket-cards-container mobile-ticket-cards-container--${viewMode}`}
        sx={{
          height: viewMode === 'stacked' ? '500px' : '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: viewMode === 'stacked' ? 'flex-start' : 'flex-start',
          padding: '0',
          overflow: viewMode === 'expanded' ? 'auto' : 'hidden',
          pt: viewMode === 'stacked' ? '100px' : '0',
          transition: 'height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), padding-top 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'height, overflow, padding-top',
          // Always hide scrollbars to prevent flash
          scrollbarWidth: 'none', // Firefox
          '&::-webkit-scrollbar': {
            display: 'none', // Chrome, Safari, Edge
          },
        }}
      >
        {sortedTickets.map((ticket, index) => (
          <Box
            key={ticket.id}
            className={`mobile-ticket-card mobile-ticket-card--${index} mobile-ticket-card--${viewMode}`}
            sx={{
              ...getCardStyle(index),
              width: '90%',
              maxWidth: '350px',
              '&:hover': viewMode === 'stacked' ? {
                transform: `scale(${1.05 - index * 0.1})`,
              } : {},
            }}
            onClick={handleCardClick}
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

      {/* Close button - only show in expanded mode */}
      {viewMode === 'expanded' && (
        <Box
          className="mobile-ticket-close-button"
          sx={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: 500,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 1000,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              transform: 'translateX(-50%) scale(1.05)',
            },
          }}
          onClick={handleClose}
        >
          Close
        </Box>
      )}

      {/* Tap instruction overlay - only show in stacked mode */}
      {viewMode === 'stacked' && (
        <Box
          className="mobile-ticket-instruction-overlay"
          sx={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: '#333',
            padding: '12px 20px',
            borderRadius: '25px',
            fontSize: '14px',
            fontWeight: 500,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            zIndex: 1,
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { transform: 'translateX(-50%) scale(1)' },
              '50%': { transform: 'translateX(-50%) scale(1.05)' },
              '100%': { transform: 'translateX(-50%) scale(1)' },
            },
          }}
        >
          Tap to expand • {sortedTickets.length} tickets
        </Box>
      )}
    </Box>
  );
};

export default MobileTicketContainer;
