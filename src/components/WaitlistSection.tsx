import React, { useState } from 'react';
import {
  Box,
  Typography,
  Link,
  Collapse,
  Tooltip,
} from '@mui/material';
import { COLORS, COLORS_DARK } from '../theme';
import {
  KeyboardArrowUp as ExpandLessIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  SubdirectoryArrowRight as SubdirectoryArrowRightIcon,
  TimerOutlined as TimerIcon,
  ConfirmationNumberOutlined as ListIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { WaitlistItem } from '../types';
import WaitlistEditModal from './WaitlistEditModal';
import WaitlistCard from './WaitlistCard';

interface WaitlistSectionProps {
  waitlistItems: WaitlistItem[];
  isDarkMode?: boolean;
  onRemove: (itemId: number) => void;
  onClaim: (itemId: number) => void;
  onUpdate: (updatedItem: WaitlistItem) => void;
}

const WaitlistSection: React.FC<WaitlistSectionProps> = ({
  waitlistItems,
  isDarkMode = false,
  onRemove,
  onClaim,
  onUpdate,
}) => {
  // Use appropriate color constants based on theme mode
  const colors = isDarkMode ? COLORS_DARK : COLORS;
  const [isExpanded, setIsExpanded] = useState(true);
  const [isInactiveExpanded, setIsInactiveExpanded] = useState(false);
  const [isActiveExpanded, setIsActiveExpanded] = useState(false);
  const [isListedExpanded, setIsListedExpanded] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState<WaitlistItem | null>(null);

  const handleEditClick = (itemId: number) => {
    const item = waitlistItems.find(waitlistItem => waitlistItem.id === itemId);
    if (item) {
      setSelectedItemForEdit(item);
      setEditModalOpen(true);
    }
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedItemForEdit(null);
  };

  const handleEditSave = (updatedItem: WaitlistItem) => {
    onUpdate(updatedItem);
    handleEditClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return { bg: '#fff3cd', color: '#000000' }; // Light yellow for OPEN
      case 'cancelled':
        return { bg: 'rgba(255,43,43,0.36)', color: '#2d3748' }; // Light red for CANCELLED
      case 'expired':
        return { bg: 'rgba(204,204,204,0.51)', color: '#2d3748' }; // Light gray for EXPIRED
      default:
        return { bg: '#e2e3e5', color: '#383d41' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'OPEN';
      case 'cancelled':
        return 'CANCELLED';
      case 'expired':
        return 'EXPIRED';
      default:
        return status.toUpperCase();
    }
  };

  // Sort waitlist items: active first (chronological), then expired/cancelled (chronological)
  const sortedWaitlistItems = [...waitlistItems].sort((a, b) => {
    // First sort by status priority: ongoing > expired > cancelled
    const statusPriority = { ongoing: 0, expired: 1, cancelled: 2 };
    const statusDiff = statusPriority[a.status as keyof typeof statusPriority] - statusPriority[b.status as keyof typeof statusPriority];
    
    if (statusDiff !== 0) return statusDiff;
    
    // Then sort by joinedOn date within each status group
    return new Date(a.joinedOn).getTime() - new Date(b.joinedOn).getTime();
  });

  // Separate active and inactive items
  const activeItems = sortedWaitlistItems.filter(item => item.status === 'ongoing');
  const inactiveItems = sortedWaitlistItems.filter(item => item.status !== 'ongoing');

  if (waitlistItems.length === 0) {
    return null;
  }

  const renderWaitlistRow = (item: WaitlistItem, index: number, isLast: boolean = false, isInactiveItem: boolean = false, isFirstInactive: boolean = false) => {
    const statusColors = getStatusColor(item.status);
    const statusLabel = getStatusLabel(item.status);
    const isInactive = item.status !== 'ongoing';
    
    // Debug logging
    console.log('Item:', item.eventName, 'isInactiveItem:', isInactiveItem, 'isFirstInactive:', isFirstInactive, 'status:', item.status);
    
    return (
      <Box key={item.id} sx={{ 
        backgroundColor: 'white',
        borderBottom: isLast ? 'none' : '1px solid #e2e8f0',
        '&:hover': { backgroundColor: '#f8f9fa' }
      }}>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1.2fr 1fr',
          alignItems: 'center',
          px: 3,
          pt: isInactiveItem ? .5 : 2,
          pb: isInactiveItem ? .5 : 2,
          width: '100%'
        }}>
          {/* Event Name & Quantity & Type */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isInactive && (
              <SubdirectoryArrowRightIcon sx={{ 
                fontSize: '1rem', 
                color: '#a0aec0',
                flexShrink: 0
              }} />
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: '1.3', fontWeight: 500, color: '#2d3748' }}>
                {item.eventName}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#555555' }}>
                {item.quantity}x {item.ticketType}
              </Typography>
            </Box>
          </Box>

          {/* Total Price */}
          <Box>
            <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#2d3748' }}>
              {item.totalPrice}
            </Typography>
          </Box>

          {/* Joined On */}
          <Box>
            <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#2d3748' }}>
              {item.joinedOn.split(',')[0]}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#718096' }}>
              {item.joinedOn.split(',')[1]}
            </Typography>
          </Box>

          {/* Expires At */}
          <Box>
            {item.status === 'expired' || item.status === 'cancelled' ? (
              <Box sx={{
                backgroundColor: statusColors.bg,
                color: statusColors.color,
                px: 1, // 8px padding
                py: 0.5,
                borderRadius: '8px',
                fontSize: '11px', // Hardcoded 11px
                fontWeight: 'bold',
                display: 'inline-block',
                textAlign: 'center'
              }}>
                {statusLabel}
              </Box>
            ) : (
              <Box>
                <Typography variant="body2" sx={{ lineHeight: '1.3', fontSize: '0.875rem', color: '#2d3748' }}>
                  {item.expirationDate.split(' ')[0]} {item.expirationDate.split(' ')[1]}
                  <br/> before
                </Typography>
              </Box>
            )}
          </Box>

          {/* Actions */}
          <Box sx={{ textAlign: 'right' }}>
            {item.status === 'ongoing' ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'flex-end' }}>
                <Link
                  component="button"
                  onClick={() => onRemove(item.id)}
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
                  Leave Waitlist
                </Link>
                <Link
                  component="button"
                  onClick={() => handleEditClick(item.id)}
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
                  Edit
                </Link>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'flex-end', opacity: 0 }}>
                <Link
                  component="button"
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
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box id="waitlist-section" className="waitlist-container" sx={{ 
      mb: 4,
      border: `1px solid ${colors.borderLight}`,
      borderRadius: '16px',
      py: 3,
      px: { xs: 0, md: 3 },
      backgroundColor: 'background.paper',
      display: 'flex',
      flexDirection: 'column',
      gap: { xs: 1, md: 1 },
      position: 'relative',
      boxShadow: '0px 4px 12px 0px rgba(0,0,0,.05), 0px 2px 4px 0px rgba(0,0,0,0.025)',

      overflow: 'hidden', // Prevent content from overflowing the container
    }}>
      {/* Waitlist Summary Header */}
      <Typography 
        variant="sectionHeader" 
        component="h1" 
        sx={{ 
          color: colors.primaryText,
          pt: { xs: 0, md: 0 },
          mb: 0,
          textAlign: { xs: 'center', md: 'left' }
        }}
      >
        WAITLIST
      </Typography>
      
      {/* ===== FIRST HEADER: Active Waitlists ===== */}
      <Box 
        className="waitlist-active-header-container"
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',

        }}
      >
        {/* Main content area with title and collapsible cards */}
        <Box
          className="waitlist-active-content"
          sx={{
            borderBottom: `1px solid ${colors.borderLight}`,
            py: 1,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: {
              xs: 'center',
              md: 'flex-start'
            }
          }}
        >
          {/* Title row with "You're on X waitlists" */}
          <Box 
            className="waitlist-active-title-row"
            onClick={() => setIsActiveExpanded(!isActiveExpanded)}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              width: '100%',
              cursor: 'pointer',
              transition: 'padding 200ms ease-out',
              '&:hover': {
                px: 1,
                '& .timer-icon': {
                  transform: 'rotate(21.5deg)',
                }
              }
            }}
          >
            <Typography 
              className="waitlist-active-title"
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 600,
                fontSize: '24px',
                color: colors.primaryText,
                letterSpacing: '-.0325em',
                lineHeight: '1.1',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textTransform: 'capitalize'
              }}
            >
              <TimerIcon className="timer-icon" sx={{ fontSize: '24px', transition: 'transform 200ms ease-out' }} />
              Joined Waitlists 
              <Box 
                className="waitlist-active-count-badge"
                sx={{ 
                  backgroundColor: '#1976d2', 
                  color: 'white', 
                  borderRadius: '100px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 500,
                  lineHeight: 1,
                  pr: 1.5,
                  pl: 1.25,
                  py: 1,
                  aspectRatio: '1/1',
                  height: '34px', // Fixed height
                  width: '34px', // Fixed width
                }}
              >
                {activeItems.length}
              </Box>
            </Typography>

            {/* Chevron button - positioned outside content to avoid collapse animation issues */}
            <Box 
              className="waitlist-active-chevron"
        sx={{
                 borderRadius: '16px',
                 border: `1px solid ${colors.borderLight}`,
                 backgroundColor: 'colors.background.paper',
                   cursor: 'pointer',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   padding: '8px 7px 8px 12px',
                   gap: 0.5,
   
                   transition: 'all 200ms ease-out',
                   '&:hover': {
                     backgroundColor: 'white',
                     boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08), 0 0 10px 0 rgba(0,0,0,0.05)',
                     transform: 'translateY(-1px)',
                     '& .MuiTypography-root': {
                       color: 'oklch(0.1 0.0 0)', // Change color of Typography on hover
                     },
                   },
                 }}
              >
                <Typography variant="body2" sx={{                     
                  fontSize: '13px',
                    color: colors.primaryText,
                    fontWeight: 500,
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.6,
                     }}>
                  {isActiveExpanded ? 'Close' : 'View all'}
                </Typography>
                {isActiveExpanded ? <CloseIcon sx={{ fontSize: '20px', color: COLORS.primaryText }} /> : <ExpandMoreIcon sx={{  color: COLORS.primaryText }} />}
              </Box>
          </Box>

          {/* Collapsible cards section */}
          <Collapse 
            className="waitlist-active-cards-collapse"
            in={isActiveExpanded} 
            timeout={200} 
            easing="ease-out" 
            unmountOnExit
          >
            <Box 
              className="waitlist-active-cards-container"
              sx={{ 
                display: 'flex',
                flexDirection: 'row',
                gap: 4,
                py: 2,
                px: { xs: 0, md: 0 },
                width: '100%',
                overflowX: 'auto',
                overflowY: 'visible',
                scrollbarWidth: 'none', // Firefox
                '&::-webkit-scrollbar': {
                  display: 'none', // Chrome, Safari, Edge
                },
              }}
            >
              {activeItems.map((item) => (
                <Box
                  key={item.id}
                  className="waitlist-active-card-wrapper"
                  sx={{
                    flexShrink: 0,
                    width: '320px',
                  }}
                >
                  <WaitlistCard 
                    item={item} 
                    onRemove={onRemove}
                    onEdit={handleEditClick}
                    showActions="active"
                  />
                </Box>
              ))}
            </Box>
          </Collapse>
        </Box>
        
      
      </Box>

      {/* ===== SECOND HEADER: Total Tickets Listed ===== */}
      <Box 
        className="waitlist-listed-header-container"
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',

        }}
      >
        {/* Main content area with title and collapsible cards */}
        <Box
          className="waitlist-listed-content"
          sx={{ 
            borderBottom: `1px solid ${colors.borderLight}`,
            py: 1,
            flex: 1,
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: { xs: 'center', md: 'flex-start' },
            overflow: 'hidden'
          }}
        >
          {/* Title row with "You've listed X tickets" */}
          <Box 
            className="waitlist-listed-title-row"
            onClick={() => setIsListedExpanded(!isListedExpanded)}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              width: '100%',
              cursor: 'pointer',
              transition: 'padding 200ms ease-out',
              '&:hover': {
                px: 1,
                '& .confirmation-icon': {
                  transform: 'rotate(21.5deg)',
                }
              }
            }}
          >
            <Typography 
              className="waitlist-listed-title"
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 600,
                fontSize: '24px',
                color: colors.primaryText,
                letterSpacing: '-.0325em',
                lineHeight: '1.1',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textTransform: 'capitalize'
              }}
            >
              <ListIcon className="confirmation-icon" sx={{ fontSize: '24px', transition: 'transform 200ms ease-out' }} />
              Listed Tickets
              <Box 
                className="waitlist-listed-count-badge"
                sx={{ 
                  backgroundColor: '#1976d2', // MUI primary blue
                  color: 'white', 
                  borderRadius: '100px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 500,
                  lineHeight: 1,
                  pr: 1.5,
                  pl: 1.25,
                  py: 1,
                  aspectRatio: '1/1',
                  height: '34px', // Fixed height
                  width: '34px', // Fixed width
                }}
              >
                1
              </Box>
            </Typography>

            {/* Chevron button - positioned outside content to avoid collapse animation issues */}
            <Box 
              className="waitlist-listed-chevron"
              sx={{ 
                borderRadius: '16px',
                border: `1px solid ${colors.borderLight}`,
                backgroundColor: 'colors.background.paper',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 7px 8px 12px',
                  gap: 0.5,
  
                  transition: 'all 200ms ease-out',
                  '&:hover': {
                    backgroundColor: 'white',
                    boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08), 0 0 10px 0 rgba(0,0,0,0.05)',
                    transform: 'translateY(-1px)',
                    '& .MuiTypography-root': {
                      color: 'oklch(0.1 0.0 0)', // Change color of Typography on hover
                    },
                  },
                }}
            >
              <Typography variant="body2" sx={{                     
                fontSize: '13px',
                  color: colors.primaryText,
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.6,
                   }}>
                {isListedExpanded ? 'Close' : 'View all'}
              </Typography>
              {isListedExpanded ? <CloseIcon sx={{ fontSize: '20px', color: COLORS.primaryText }} /> : <ExpandMoreIcon sx={{ color: COLORS.primaryText }} />}
            </Box>
          </Box>

          {/* Collapsible cards section */}
          <Collapse 
            className="waitlist-listed-cards-collapse"
            in={isListedExpanded} 
            timeout={200} 
            easing="ease-out" 
            unmountOnExit
          >
            <Box 
              className="waitlist-listed-cards-container"
              sx={{ 
                display: 'flex',
                flexDirection: 'row',
                gap: 4,
                py: 2,
                px: { xs: 2, md: 3 },
                width: '100%',
                overflowX: 'auto',
                overflowY: 'visible',
                scrollbarWidth: 'none', // Firefox
                '&::-webkit-scrollbar': {
                  display: 'none', // Chrome, Safari, Edge
                },
              }}
            >
              {waitlistItems.slice(0, 1).map((item) => (
                <Box
                  key={item.id}
                  className="waitlist-listed-card-wrapper"
                  sx={{
                    flexShrink: 0,
                    width: '320px',
                  }}
                >
                  <WaitlistCard 
                    item={item} 
                    onUnlist={onRemove}
                    showActions="listed"
                  />
                </Box>
              ))}
            </Box>
          </Collapse>
        </Box>
        
    
      </Box>

      {/* Table Header - moved outside container */}
      <Collapse in={isExpanded} timeout={200} easing="ease-out" unmountOnExit>
        <Box className="waitlist-table-header" sx={{ 
          display: 'none  ', /* hidden table  header for now, change to grid when visible */
          gridTemplateColumns: '2fr 1fr 1fr 1.2fr 1fr',
          alignItems: 'center',
          px: 3,
          py: 1.5,
          backgroundColor: 'transparent',
          mb: 0,
          width: '100%'
        }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#4a5568' }}>
            EVENT & TICKET
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#4a5568' }}>
            PRICE
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#4a5568' }}>
            JOINED ON
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#4a5568' }}>
            EXPIRES
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#4a5568', textAlign: 'right' }}>
            ACTIONS
          </Typography>
        </Box>

        {/* Table Container - matching Figma design */}
        <Box id="waitlist-table" className="waitlist-table-container" sx={{ 
          display: 'none', /* hidden table for now, remove to make visible */
          backgroundColor: '#fafafa',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          boxShadow: '0px 1px 6px 0px rgba(0,0,0,0.05)',
        }}>

        {/* Active Items */}
        <Box className="waitlist-active-items">
          {activeItems.map((item, index) => 
            renderWaitlistRow(item, index, index === activeItems.length - 1 && inactiveItems.length === 0)
          )}
        </Box>

        {/* Inactive Section */}
        {inactiveItems.length > 0 && (
          <Box className="waitlist-inactive-section">
            {/* Inactive Header */}
            <Box 
              className="waitlist-inactive-header" 
              onClick={() => setIsInactiveExpanded(!isInactiveExpanded)}
              sx={{ 
                backgroundColor: 'white',
                px: 3,
                pt: 2,
                pb: isInactiveExpanded ? .5 : 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'padding-bottom 0.3s ease-out',
                '&:hover': {
                  opacity: 0.8
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isInactiveExpanded ? <ExpandLessIcon sx={{ color: '#4a5568' }} /> : <ExpandMoreIcon sx={{ color: '#4a5568' }} />}
                <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ 
                    fontSize: '1.125rem', 
                    fontWeight: 400, 
                    color: '#4a5568',
                    letterSpacing: '-0.54px'
                  }}>
                    Past waitlist entries
                  </Typography>
                  <Tooltip title="Waitlist history is kept for 1 year" arrow>
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
                          {inactiveItems.length}
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
                  </Tooltip>
                </Box>
              </Box>
            </Box>

            {/* Inactive Items */}
            <Collapse in={isInactiveExpanded} timeout={200} easing="ease-out" unmountOnExit>
              <Box className="waitlist-inactive-items" sx={{ 
                fontSize: '0.8rem',
                '& *': {
                  fontSize: 'inherit'
                }
              }}>
                {inactiveItems.map((item, index) => 
                  renderWaitlistRow(item, index, index === inactiveItems.length - 1, true, index === 0)
                )}
              </Box>
            </Collapse>
          </Box>
        )}
        </Box>

        {/* Disclaimer Text */}
        <Box className="waitlist-disclaimer" sx={{ mx:0,mt:1.5, pt: 0 }}>
          <Typography variant="body2" sx={{ lineHeight: '1.5', color: '#666666', fontSize: '0.8rem'}}>
            We will notify you via email if we are able to find tickets for you for the show.{' '}<br/>
            <Box component="span" sx={{ fontWeight: '600' }}>This is not a ticket. If we are able to find you tickets, your card will be charged the amount above.
            </Box>            

          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
          </Typography>
        </Box>
      </Collapse>

      {/* Edit Modal */}
      <WaitlistEditModal
        open={editModalOpen}
        onClose={handleEditClose}
        waitlistItem={selectedItemForEdit}
        onSave={handleEditSave}
      />
    </Box>
  );
};

export default WaitlistSection;
