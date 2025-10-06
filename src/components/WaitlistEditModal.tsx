import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  AccessTime as ClockIcon,
  ConfirmationNumber as TicketIcon,
} from '@mui/icons-material';
import { WaitlistItem } from '../types';

interface WaitlistEditModalProps {
  open: boolean;
  onClose: () => void;
  waitlistItem: WaitlistItem | null;
  onSave: (updatedItem: WaitlistItem) => void;
}

interface TicketOption {
  id: string;
  name: string;
  type: string;
  price: number;
  available: boolean;
}

const WaitlistEditModal: React.FC<WaitlistEditModalProps> = ({
  open,
  onClose,
  waitlistItem,
  onSave,
}) => {
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [ticketCounts, setTicketCounts] = useState<{ [key: string]: number }>({});
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [autoRemoveEnabled, setAutoRemoveEnabled] = useState(false);

  // Mock ticket options - in real app this would come from API
  const ticketOptions: TicketOption[] = [
    { id: 'ga-advance', name: 'GA Advance', type: 'General Admission', price: 48, available: true },
    { id: 'ga-tier1', name: 'GA Tier 1', type: 'General Admission', price: 55, available: true },
    { id: 'ga-tier2', name: 'GA Tier 2', type: 'General Admission', price: 65, available: true },
    { id: 'vip-table', name: 'VIP Table Seating', type: 'VIP', price: 120, available: true },
    { id: 'premium', name: 'Premium Seating', type: 'Premium', price: 78, available: true },
  ];

  const expirationOptions = [
    '3 days before',
    '1 week before',
    '2 weeks before',
  ];

  useEffect(() => {
    if (waitlistItem) {
      // Initialize with current waitlist item data
      // Find matching ticket option based on ticket type
      const matchingTicket = ticketOptions.find(t => 
        t.name.toLowerCase().includes(waitlistItem.ticketType.toLowerCase()) ||
        waitlistItem.ticketType.toLowerCase().includes(t.name.toLowerCase())
      );
      
      if (matchingTicket) {
        setSelectedTickets([matchingTicket.id]);
        setTicketCounts({ [matchingTicket.id]: waitlistItem.quantity });
      } else {
        // Default to first ticket option if no match found
        setSelectedTickets([ticketOptions[0].id]);
        setTicketCounts({ [ticketOptions[0].id]: waitlistItem.quantity });
      }
      
      setExpirationDate(waitlistItem.expirationDate);
    }
  }, [waitlistItem]);

  const handleTicketToggle = (ticketId: string) => {
    const newSelectedTickets = selectedTickets.includes(ticketId)
      ? selectedTickets.filter(id => id !== ticketId)
      : [...selectedTickets, ticketId];
    
    setSelectedTickets(newSelectedTickets);
    
    // Initialize count for new tickets
    const newCounts = { ...ticketCounts };
    if (!newCounts[ticketId]) {
      newCounts[ticketId] = 1;
    }
    // Remove counts for deselected tickets
    Object.keys(newCounts).forEach(id => {
      if (!newSelectedTickets.includes(id)) {
        delete newCounts[id];
      }
    });
    setTicketCounts(newCounts);
  };

  const handleCountChange = (ticketId: string, delta: number) => {
    const currentCount = ticketCounts[ticketId] || 1;
    const newCount = Math.max(1, currentCount + delta);
    setTicketCounts(prev => ({
      ...prev,
      [ticketId]: newCount
    }));
  };

  const calculateTotalPrice = () => {
    return selectedTickets.reduce((total, ticketId) => {
      const ticket = ticketOptions.find(t => t.id === ticketId);
      const count = ticketCounts[ticketId] || 1;
      return total + (ticket ? ticket.price * count : 0);
    }, 0);
  };

  const getTotalQuantity = () => {
    return Object.values(ticketCounts).reduce((sum, count) => sum + count, 0);
  };

  const handleSave = () => {
    if (!waitlistItem || selectedTickets.length === 0) return;

    // For simplicity, we'll use the first selected ticket type
    // In a real app, you might want to handle multiple ticket types differently
    const primaryTicketType = selectedTickets[0];
    const primaryCount = ticketCounts[primaryTicketType] || 1;
    const primaryTicket = ticketOptions.find(t => t.id === primaryTicketType);

    const updatedItem: WaitlistItem = {
      ...waitlistItem,
      ticketType: primaryTicket?.name || primaryTicketType,
      quantity: primaryCount,
      totalPrice: `$${calculateTotalPrice().toFixed(2)}`,
      expirationDate: expirationDate,
    };

    onSave(updatedItem);
    onClose();
  };

  if (!waitlistItem) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          maxHeight: '90vh',
          color: '#333333',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
        px: 3,
        pt: 3
      }}>
        <Typography variant="h6" sx={{ fontWeight: 400, color: '#333333' }}>
          Waitlist request
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: '#666666' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        {/* Event Info */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 500, 
            color: '#333333',
            fontSize: '16px',
            lineHeight: '20px',
            mb: 1
          }}>
            {waitlistItem.eventName}
          </Typography>
        </Box>

        {/* Ticket Selection */}
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <Select
              value={selectedTickets[0] || ''}
              onChange={(e) => {
                const ticketId = e.target.value;
                setSelectedTickets([ticketId]);
                setTicketCounts({ [ticketId]: 1 });
              }}
              displayEmpty
              sx={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                color: '#333333',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '& .MuiSelect-select': {
                  color: '#333333',
                  padding: '12px 16px'
                },
                '& .MuiSvgIcon-root': {
                  color: '#666666'
                }
              }}
            >
              {ticketOptions.map((ticket) => (
                <MenuItem 
                  key={ticket.id} 
                  value={ticket.id}
                  sx={{
                    backgroundColor: '#FFFFFF',
                    color: '#333333',
                    '&:hover': {
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                >
                  {ticket.name} - ${ticket.price}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Ticket Type Card */}
        <Box sx={{ mb: 3 }}>
          {selectedTickets.map((ticketId) => {
            const ticket = ticketOptions.find(t => t.id === ticketId);
            const count = ticketCounts[ticketId] || 1;
            return (
              <Box key={ticketId} sx={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                mb: 2,
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                {/* Header */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                  py: 1.5,
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TicketIcon sx={{ color: '#666666', fontSize: '20px' }} />
                    <Typography variant="body1" sx={{
                      color: '#333333',
                      fontSize: '18px',
                      fontWeight: 400,
                      textTransform: 'uppercase'
                    }}>
                      {ticket?.type || 'General Admission'}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{
                    color: '#007bff',
                    fontSize: '20px',
                    fontWeight: 500,
                    textAlign: 'right',
                    textTransform: 'uppercase'
                  }}>
                    ${ticket?.price || 0}.00
                  </Typography>
                </Box>

                {/* Quantity Controls */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '80px'
                }}>
                  {/* Minus Button */}
                  <Box sx={{
                    flex: 1,
                    height: '100%',
                    background: 'linear-gradient(to right, #f8f9fa, rgba(248,249,250,0))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: count > 1 ? 'pointer' : 'not-allowed',
                    opacity: count > 1 ? 1 : 0.5
                  }}
                  onClick={() => count > 1 && handleCountChange(ticketId, -1)}
                  >
                    <RemoveIcon sx={{ color: '#666666', fontSize: '24px' }} />
                  </Box>

                  {/* Quantity Display */}
                  <Box sx={{
                    width: '56px',
                    height: '56px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 1,
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0'
                  }}>
                    <Typography variant="h4" sx={{
                      color: '#333333',
                      fontSize: '32px',
                      fontWeight: 500,
                      lineHeight: '34px'
                    }}>
                      {count}
                    </Typography>
                  </Box>

                  {/* Plus Button */}
                  <Box sx={{
                    flex: 1,
                    height: '100%',
                    background: 'linear-gradient(to right, rgba(248,249,250,0), #f8f9fa)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleCountChange(ticketId, 1)}
                  >
                    <AddIcon sx={{ color: '#666666', fontSize: '24px' }} />
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Auto Remove Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Header with checkbox */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 1.5,
              py: 1.5,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <ClockIcon sx={{ color: '#666666', fontSize: '16px' }} />
                <Typography variant="body2" sx={{
                  color: '#333333',
                  fontSize: '16px',
                  fontWeight: 400
                }}>
                  Auto-remove after time
                </Typography>
              </Box>
              <Checkbox
                checked={autoRemoveEnabled}
                onChange={(e) => setAutoRemoveEnabled(e.target.checked)}
                sx={{
                  color: '#e2e8f0',
                  '&.Mui-checked': {
                    color: '#007bff',
                  }
                }}
              />
            </Box>

            {/* Dropdown that appears inline when checked */}
            {autoRemoveEnabled && (
              <Box sx={{
                borderTop: '1px solid #e2e8f0',
                px: 1.5,
                py: 1
              }}>
                <FormControl fullWidth>
                  <Select
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      color: '#333333',
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '& .MuiSelect-select': {
                        color: '#333333',
                        padding: '8px 12px'
                      },
                      '& .MuiSvgIcon-root': {
                        color: '#666666'
                      }
                    }}
                  >
                    {expirationOptions.map((option) => (
                      <MenuItem 
                        key={option} 
                        value={option}
                        sx={{
                          backgroundColor: '#FFFFFF',
                          color: '#333333',
                          '&:hover': {
                            backgroundColor: '#f8f9fa'
                          }
                        }}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ 
            flex: 1,
            height: '42px',
            borderColor: '#e2e8f0',
            color: '#666666',
            backgroundColor: 'transparent',
            '&:hover': {
              borderColor: '#007bff',
              backgroundColor: 'rgba(0, 123, 255, 0.1)',
              color: '#007bff'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={selectedTickets.length === 0}
          sx={{ 
            flex: 1,
            height: '42px',
            backgroundColor: '#000000',
            color: '#FFFFFF',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#333333'
            },
            '&:disabled': {
              backgroundColor: '#e2e8f0',
              color: '#999999'
            }
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WaitlistEditModal;
