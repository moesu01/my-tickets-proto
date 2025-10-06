import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Link,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  KeyboardArrowUp as ExpandLessIcon,
  KeyboardArrowDown as ExpandMoreIcon,
} from '@mui/icons-material';
import { Ticket } from '../types';

interface PastEventsSectionProps {
  tickets: Ticket[];
  expanded: boolean;
  onToggleExpanded: () => void;
  onReceipt: (ticketId: string) => void;
  onViewTicket: (ticketId: string) => void;
}

const PastEventsSection: React.FC<PastEventsSectionProps> = ({
  tickets,
  expanded,
  onToggleExpanded,
  onReceipt,
  onViewTicket,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const formatDate = (dateString: string, timeString: string) => {
    const date = new Date(dateString);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit'
    });
    const formattedDate = `${dayOfWeek} ${monthDay}`;
    return { date: formattedDate, time: timeString };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'refunded':
        return { label: 'Refunded', color: '#dc3545', bg: '#f8d7da' };
      case 'transferred':
        return { label: 'Transferred', color: '#0c5460', bg: '#d1ecf1' };
      case 'cancelled':
        return { label: 'Cancelled', color: '#721c24', bg: '#f8d7da' };
      default:
        return null;
    }
  };

  if (tickets.length === 0) {
    return null;
  }

  return (
    <Box id="past-events-section" className="past-events-container" sx={{ 
      mb: 4,
      p: 1.5, // 12px padding
      backgroundColor: '#fafafa',
      borderRadius: '8px',
      boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08)'
    }}>
      {/* Header - matching Figma design */}
      <Box 
        className="past-events-header" 
        onClick={onToggleExpanded}
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          pt: 1,
          px: 0,
          mb: 0,
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.8
          }
        }}
      >
        <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
            <Typography variant="h5" sx={{ 
              fontSize: '1.25rem', 
              fontWeight: 400, 
              color: '#4a5568',
              letterSpacing: '-0.6px'
            }}>
              Past Events
            </Typography>
            <Box sx={{ 
              position: 'relative',
              borderRadius: '29px',
              width: '22px',
              height: '22px'
            }}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 0.5,
                width: '22px',
                height: '22px'
              }}>
                <Typography variant="body2" sx={{ 
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: '#4a5568',
                  lineHeight: 1
                }}>
                  {tickets.length}
                </Typography>
              </Box>
              <Box sx={{
                position: 'absolute',
                inset: 0,
                border: '1px solid #a0aec0',
                borderRadius: '29px',
                pointerEvents: 'none'
              }} />
            </Box>
          </Box>
        </Box>
        {expanded ? <ExpandLessIcon sx={{ color: '#4a5568' }} /> : <ExpandMoreIcon sx={{ color: '#4a5568' }} />}
      </Box>

      <Collapse 
        in={expanded} 
        timeout={200} 
        easing="ease-out" 
        unmountOnExit
        sx={{
          '& .MuiCollapse-wrapper': {
            willChange: 'height',
          },
          '& .MuiCollapse-wrapperInner': {
            willChange: 'transform',
          }
        }}
      >
        {/* Table Header */}
        <Box className="past-events-table-header" sx={{ 
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          alignItems: 'center',
          px: 3,
          py: 1.5,
          backgroundColor: 'transparent',
          mb: 0,
          width: '100%'
        }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#4a5568' }}>
            EVENT
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#4a5568' }}>
            DATE
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#4a5568' }}>
            VENUE
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#4a5568', textAlign: 'right' }}>
            ACTIONS
          </Typography>
        </Box>

        {/* Table Container - matching Figma design */}
        <Box id="past-events-table" className="past-events-table-container" sx={{ 
          backgroundColor: '#fafafa',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          boxShadow: '0px 1px 6px 0px rgba(0,0,0,0.05)'
        }}>
          {tickets.map((ticket, index) => {
            const statusBadge = getStatusBadge(ticket.status);
            const formattedDateTime = formatDate(ticket.date, ticket.time);
            
            return (
              <Box
                key={ticket.id}
                sx={{
                  backgroundColor: 'white',
                  borderBottom: index < tickets.length - 1 ? '1px solid #e2e8f0' : 'none',
                  '&:hover': { backgroundColor: '#f8f9fa' }
                }}
              >
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  alignItems: 'center',
                  px: 3,
                  pt: 2,
                  pb: 2,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Background Image Element */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url('${process.env.PUBLIC_URL}/design/event_poster.png')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: 'blur(30px)',
                      opacity: 0.08,
                      zIndex: 0,
                    }}
                  />
                  {/* Event Name & Status */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, position: 'relative', zIndex: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: '1.3', fontWeight: 500, color: '#2d3748' }}>
                      {ticket.eventName}
                    </Typography>
                    {statusBadge && (
                      <Box
                        sx={{
                          backgroundColor: statusBadge.bg,
                          color: statusBadge.color,
                          px: 1,
                          py: 0.5,
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          display: 'inline-block',
                          textAlign: 'center',
                          width: 'fit-content'
                        }}
                      >
                        {statusBadge.label}
                      </Box>
                    )}
                  </Box>

                  {/* Date */}
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#2d3748' }}>
                      {formattedDateTime.date}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#718096' }}>
                      {formattedDateTime.time}
                    </Typography>
                  </Box>

                  {/* Venue */}
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#2d3748' }}>
                      {ticket.venue}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#718096' }}>
                      {ticket.location}
                    </Typography>
                  </Box>

                  {/* Actions */}
                  <Box sx={{ textAlign: 'right', position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'flex-end' }}>
                      <Link 
                        component="button"
                        onClick={(e) => { e.preventDefault(); onReceipt(ticket.ticketId); }}
                        sx={{
                          fontSize: '0.75rem',
                          color: '#4a5568',
                          textDecoration: 'underline',
                          textTransform: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          }
                        }}
                      >
                        Receipt
                      </Link>
                      <Link 
                        component="button"
                        onClick={(e) => { e.preventDefault(); onViewTicket(ticket.ticketId); }}
                        sx={{
                          fontSize: '0.75rem',
                          color: '#4a5568',
                          textDecoration: 'underline',
                          textTransform: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          }
                        }}
                      >
                        View
                      </Link>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
};

export default PastEventsSection;
