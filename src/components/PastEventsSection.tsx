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
import { COLORS, COLORS_DARK } from '../theme';
import { transitions } from '../utils/transitions';

interface PastEventsSectionProps {
  tickets: Ticket[];
  expanded: boolean;
  onToggleExpanded: () => void;
  onReceipt: (ticketId: string) => void;
  onViewTicket: (ticketId: string) => void;
  isDarkMode?: boolean;
}

const PastEventsSection: React.FC<PastEventsSectionProps> = ({
  tickets,
  expanded,
  onToggleExpanded,
  onReceipt,
  onViewTicket,
  isDarkMode = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Use appropriate color constants based on theme mode
  const colors = isDarkMode ? COLORS_DARK : COLORS;

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
      mb: 0,
      mx: 4,
      borderTop: `1px solid ${colors.borderLight}`,
      borderRadius: '0px',
      py: 1,
      px: { xs: 0, md: 0 },
      backgroundColor: 'background.paper',
      display: 'flex',
      flexDirection: 'column',
      gap: { xs: 1, md: 1 },
      position: 'relative',
      boxShadow: '0px 4px 12px 0px rgba(0,0,0,.05), 0px 2px 4px 0px rgba(0,0,0,0.025)',
    }}>
      {/* Header Section */}
      <Box 
        component="header"
        id="past-events-header"
        className="past-events-header"
        onClick={onToggleExpanded}
        sx={{ 
          display: 'flex', 
          alignItems: { xs: 'center', md: 'center' }, 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          mb: 0,
          px: 0,
          pt: 2,
          gap: 2,
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.8
          }
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
            }}
          >
            Order History
          </Typography>
          
          {/* Main Headline with Count */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1,
            flexDirection: { xs: 'column', md: 'row' },
          }}>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 600,
                fontSize: '1.75rem',
                color: colors.primaryText,
                letterSpacing: '-.0325em',
                lineHeight: '1.1',
                textTransform: 'capitalize',
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              Past Events
            </Typography>
            
            {/* Event Count Badge */}
            <Box sx={{ 
              backgroundColor: 'transparent', // Positive green (MUI success.main or similar)
              color: colors.primaryText, 
              border: `1px solid ${colors.primaryText}`,
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
              {tickets.length}
            </Box>
          </Box>
        </Box>

        {/* Expand/Collapse Button */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
        }}>
          {expanded ? <ExpandLessIcon sx={{ color: colors.primaryText }} /> : <ExpandMoreIcon sx={{ color: colors.primaryText }} />}
        </Box>
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
          <Typography variant="body2" sx={{ fontFamily: "'IBM Plex Mono', sans-serif", fontWeight: '500', letterSpacing: '0.05em', lineHeight: '1.2', fontSize: '0.875rem', color: colors.primaryText, }}>
            EVENT
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "'IBM Plex Mono', sans-serif", fontWeight: '500', letterSpacing: '0.05em', fontSize: '0.75rem', color: colors.primaryText }}>
            DATE
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "'IBM Plex Mono', sans-serif", fontWeight: '500', letterSpacing: '0.05em', fontSize: '0.75rem', color: colors.primaryText }}>
            VENUE
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "'IBM Plex Mono', sans-serif", fontWeight: '500', letterSpacing: '0.05em', fontSize: '0.75rem', color: colors.primaryText, textAlign: 'right' }}>
            TICKET
          </Typography>
        </Box>

        {/* Table Container - matching Figma design */}
        <Box id="past-events-table" className="past-events-table-container" sx={{ 
          backgroundColor: 'background.paper',
          borderRadius: '8px',
          overflow: 'hidden',
          border: `1px solid ${colors.borderLight}`,
          boxShadow: '0px 1px 6px 0px rgba(0,0,0,0.05)'
        }}>
          {tickets.map((ticket, index) => {
            const statusBadge = getStatusBadge(ticket.status);
            const formattedDateTime = formatDate(ticket.date, ticket.time);
            
            return (
              <Box
                key={ticket.id}
                sx={{
                  backgroundColor: 'background.paper',
                  borderBottom: index < tickets.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
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
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: '1.3', fontWeight: 500, color: colors.primaryText }}>
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
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: colors.primaryText }}>
                      {formattedDateTime.date}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: colors.iconColor }}>
                      {formattedDateTime.time}
                    </Typography>
                  </Box>

                  {/* Venue */}
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: colors.primaryText }}>
                      {ticket.venue}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: colors.iconColor }}>
                      {ticket.location}
                    </Typography>
                  </Box>

                  {/* Ticket Info */}
                  <Box sx={{ textAlign: 'right', position: 'relative', zIndex: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: colors.primaryText }}>
                      {ticket.ticketType}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'white' }}>
                      {ticket.totalPrice || 'N/A'}
                    </Typography>
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
