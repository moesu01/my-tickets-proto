import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { EventCardProps } from '../types';

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // Generate dynamic shadow styles (same as TicketCard)
  const dropShadowStyle = {
    boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.15)`,
  };

  return (
    <Box
      id={`event-card-${event.id}`}
      className="event-card"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        position: 'relative',
        width: '240px',
        height: 'auto',
        border: '1px solid rgba(0,0,0,0.1)',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        overflow: 'hidden',
        ...dropShadowStyle,
      }}
    >
      {/* Image Section */}
      <Box
        id={`event-card-image-${event.id}`}
        className="event-card-image"
        sx={{
          aspectRatio: '1/1',
          position: 'relative',
          flexShrink: 0,
          width: '100%',
          overflow: 'hidden',
          // CSS mask for fade effect at bottom
          maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
        }}
      >
        <img
          id={`event-card-image-element-${event.id}`}
          className="event-card-image-element"
          src={event.image}
          alt={event.title}
          style={{
            position: 'absolute',
            inset: 0,
            maxWidth: 'none',
            objectFit: 'cover',
            objectPosition: '50% 50%',
            pointerEvents: 'none',
            width: '100%',
            height: '100%',
          }}
        />
      </Box>

      {/* Content Section */}
      <Box
        id={`event-card-content-${event.id}`}
        className="event-card-content"
        sx={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          alignItems: 'flex-start',
          px: 1,
          py: 1.5,
          flexShrink: 0,
          width: '100%',
        }}
      >
        {/* Date/Time */}
        <Box
          id={`event-card-datetime-${event.id}`}
          className="event-card-datetime"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            alignItems: 'center',
            flexShrink: 0,
            width: '100%',
          }}
        >
          <Typography
            id={`event-card-datetime-text-${event.id}`}
            className="event-card-datetime-text"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 400,
              color: '#666666',
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            {event.date} • {event.time}
          </Typography>
        </Box>

        {/* Event Title */}
        <Typography
          id={`event-card-title-${event.id}`}
          className="event-card-title"
          sx={{
            fontSize: '.875rem',
            fontWeight: 900,
            color: '#333333',
            textAlign: 'center',
            width: '100%',
            textTransform: 'capitalize',
            lineHeight: 1.2,
          }}
        >
          {event.title}
        </Typography>

        {/* Venue */}
        <Box
          id={`event-card-venue-${event.id}`}
          className="event-card-venue"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            alignItems: 'center',
            flexShrink: 0,
            width: '100%',
          }}
        >
          <Typography
            id={`event-card-venue-text-${event.id}`}
            className="event-card-venue-text"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 400,
              color: '#666666',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.0225rem',
            }}
          >
            {event.venue}
          </Typography>
        </Box>
      </Box>

      {/* Get Tickets Button */}
      <Box
        id={`event-card-button-container-${event.id}`}
        className="event-card-button-container"
        sx={{
          backgroundColor: '#f0f0f0',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 1,
          flexShrink: 0,
          width: '100%',
        }}
      >
        <Box
          id={`event-card-button-${event.id}`}
          className="event-card-button"
          onClick={event.onGetTickets}
          sx={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 12px',
            width: '100%',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
        >
          <Typography
            sx={{
              fontSize: '12px',
              color: '#333333',
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.6,
            }}
          >
            Get Tickets
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default EventCard;
