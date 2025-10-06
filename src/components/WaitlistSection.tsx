import React, { useState } from 'react';
import {
  Box,
  Typography,
  Link,
  Collapse,
} from '@mui/material';
import {
  KeyboardArrowUp as ExpandLessIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  SubdirectoryArrowRight as SubdirectoryArrowRightIcon,
} from '@mui/icons-material';
import { WaitlistItem } from '../types';
import WaitlistEditModal from './WaitlistEditModal';

interface WaitlistSectionProps {
  waitlistItems: WaitlistItem[];
  onRemove: (itemId: number) => void;
  onClaim: (itemId: number) => void;
  onUpdate: (updatedItem: WaitlistItem) => void;
}

const WaitlistSection: React.FC<WaitlistSectionProps> = ({
  waitlistItems,
  onRemove,
  onClaim,
  onUpdate,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isInactiveExpanded, setIsInactiveExpanded] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState<WaitlistItem | null>(null);

  const handleEditClick = (item: WaitlistItem) => {
    setSelectedItemForEdit(item);
    setEditModalOpen(true);
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
                  onClick={() => handleEditClick(item)}
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
      p: 1.5, // 12px padding
      backgroundColor: '#fafafa',
      borderRadius: '8px',
      boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08)'
    }}>
      {/* Header - matching Figma design */}
      <Box 
        className="waitlist-header" 
        onClick={() => setIsExpanded(!isExpanded)}
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
              Waitlist
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
                  {activeItems.length}
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
        {isExpanded ? <ExpandLessIcon sx={{ color: '#4a5568' }} /> : <ExpandMoreIcon sx={{ color: '#4a5568' }} />}
      </Box>

      {/* Table Header - moved outside container */}
      <Collapse in={isExpanded} timeout={200} easing="ease-out" unmountOnExit>
        <Box className="waitlist-table-header" sx={{ 
          display: 'grid',
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
          backgroundColor: '#fafafa',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          boxShadow: '0px 1px 6px 0px rgba(0,0,0,0.05)'
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
        <Box className="waitlist-disclaimer" sx={{ mx:1,mt:2, pt: 1 }}>
          <Typography variant="body2" sx={{ lineHeight: '1.5', color: '#666666', fontSize: '0.8rem', mb: 1 }}>
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
