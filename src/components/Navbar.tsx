import React from 'react';
import { Box, IconButton, Typography, Container, Button } from '@mui/material';
import { Person, ShoppingCart } from '@mui/icons-material';

const Navbar: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        py: 1, // 8px vertical padding
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img 
              src={`${process.env.PUBLIC_URL}/kyd_logo_nav.svg`} 
              alt="kyd labs" 
              style={{ 
                height: '34px',
                width: 'auto'
              }}
            />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              variant="text"
              startIcon={<Person />}
              sx={{
                color: '#718096',
                borderRadius: '8px',
                padding: '8px 12px',
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  color: '#333'
                }
              }}
            >
              Log out
            </Button>
            
            <Typography
              sx={{
                color: '#718096',
                fontSize: '16px',
                fontWeight: 400,
                mx: 1
              }}
            >
              |
            </Typography>
            
            <Button
              variant="text"
              sx={{
                color: '#718096',
                borderRadius: '8px',
                padding: '8px',
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  color: '#333'
                }
              }}
            >
              <ShoppingCart />
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Navbar;
