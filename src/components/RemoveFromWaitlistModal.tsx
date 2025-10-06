import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';

interface RemoveFromWaitlistModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ticketId: string;
}

const RemoveFromWaitlistModal: React.FC<RemoveFromWaitlistModalProps> = ({
  open,
  onClose,
  onConfirm,
  ticketId,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          padding: '24px',
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#2d3748',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Remove from Waitlist
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pb: 3 }}>
        <Typography
          variant="body1"
          sx={{
            fontSize: '1rem',
            lineHeight: 1.5,
            color: '#4a5568',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          This ticket is on the waitlist and you will be refunded the price when it is sold. 
          Are you sure you want to remove this from the waitlist?
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ gap: 2, pt: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            fontFamily: "'Inter', sans-serif",
            borderColor: '#e2e8f0',
            color: '#4a5568',
            '&:hover': {
              borderColor: '#cbd5e0',
              backgroundColor: '#f7fafc',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            fontFamily: "'Inter', sans-serif",
            backgroundColor: '#e53e3e',
            '&:hover': {
              backgroundColor: '#c53030',
            },
          }}
        >
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveFromWaitlistModal;
