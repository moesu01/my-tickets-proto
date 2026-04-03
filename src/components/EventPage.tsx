import React, { useState } from 'react';
import { Box, Typography, Container, Chip, Snackbar, Alert } from '@mui/material';
import { LocationOn, AccessTime } from '@mui/icons-material';
import { SoldOutEvent, SoldOutTicketType, WaitlistItem } from '../types';
import JoinWaitlistModal from './JoinWaitlistModal';

interface EventPageProps {
  event: SoldOutEvent;
  onJoinWaitlist: (items: Omit<WaitlistItem, 'id'>[]) => void;
}

const EventPage: React.FC<EventPageProps> = ({ event, onJoinWaitlist }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [primaryTicket, setPrimaryTicket] = useState<SoldOutTicketType | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleJoinClick = (ticket: SoldOutTicketType) => {
    setPrimaryTicket(ticket);
    setModalOpen(true);
  };

  const handleJoin = (items: Omit<WaitlistItem, 'id'>[]) => {
    onJoinWaitlist(items);
    setSuccessOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 280, sm: 360 },
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={event.image}
          alt={event.title}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
        {/* Dark gradient overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.75) 100%)',
          }}
        />

        {/* SOLD OUT badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
          }}
        >
          <Chip
            label="SOLD OUT"
            size="small"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          />
        </Box>

        {/* Hero text */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            px: { xs: 2, sm: 3 },
            pb: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              mb: 0.5,
            }}
          >
            {event.eventSeries}
          </Typography>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.75rem', sm: '2.25rem' },
              color: '#fff',
              lineHeight: 1.1,
              mb: 1.5,
            }}
          >
            {event.title}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <AccessTime sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }} />
              <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>
                {event.date} · {event.time}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <LocationOn sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }} />
              <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>
                {event.venue} · {event.location}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Tickets section */}
      <Container maxWidth="sm" sx={{ py: 3 }}>
        {/* Disclaimer */}
        <Typography
          sx={{
            fontSize: '0.75rem',
            color: 'text.secondary',
            textAlign: 'center',
            mb: 2.5,
            fontStyle: 'italic',
          }}
        >
          Joining the Waitlist does NOT guarantee entry.
        </Typography>

        {/* All-in pricing note */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.75,
            mb: 2.5,
          }}
        >
          <Box
            sx={{
              width: 6, height: 6, borderRadius: '50%',
              backgroundColor: '#c8f135',
            }}
          />
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500 }}>
            All-In Pricing — No surprises at checkout
          </Typography>
        </Box>

        {/* Ticket type cards */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {event.ticketTypes.map((ticket) => (
            <Box
              key={ticket.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '12px',
                px: 2,
                py: 1.75,
                gap: 2,
              }}
            >
              {/* Left: label + sublabel + sold out chip */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {ticket.label}
                  </Typography>
                  <Chip
                    label="Sold Out"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      backgroundColor: 'rgba(0,0,0,0.06)',
                      color: 'text.secondary',
                    }}
                  />
                </Box>
                {ticket.sublabel && (
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    {ticket.sublabel}
                  </Typography>
                )}
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, mt: 0.5 }}>
                  ${ticket.price.toFixed(2)}
                </Typography>
              </Box>

              {/* Right: Join Waitlist button */}
              <Box
                onClick={() => handleJoinClick(ticket)}
                sx={{
                  flexShrink: 0,
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  border: '1.5px solid',
                  borderColor: 'text.primary',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.15s',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.05)',
                  },
                }}
              >
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                  Join Waitlist
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Modal */}
      {primaryTicket && (
        <JoinWaitlistModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          initialTicket={primaryTicket}
          allTicketTypes={event.ticketTypes}
          eventName={event.title}
          eventDate={event.date}
          eventVenue={event.venue}
          onJoin={handleJoin}
        />
      )}

      {/* Success snackbar */}
      <Snackbar
        open={successOpen}
        autoHideDuration={4500}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessOpen(false)}
          severity="success"
          sx={{ borderRadius: '10px', fontWeight: 500 }}
        >
          You're on the waitlist! We'll notify you via email if we find tickets.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EventPage;
