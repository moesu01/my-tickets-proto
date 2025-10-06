import React from 'react';
import { Box, IconButton, Typography, Container } from '@mui/material';
import { Search, Person, ShoppingCart } from '@mui/icons-material';

const Navbar: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        py: 1.5, // 12px vertical padding
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
              src="/kyd_logo_nav.svg" 
              alt="kyd labs" 
              style={{ 
                height: '34px',
                width: 'auto'
              }}
            />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <IconButton 
              color="inherit" 
              sx={{ 
                color: '#718096',
                padding: '4px',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  color: '#333'
                }
              }}
              aria-label="Search"
            >
              <Search />
            </IconButton>
            
            <IconButton 
              color="inherit" 
              sx={{ 
                color: '#718096',
                padding: '4px',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  color: '#333'
                }
              }}
              aria-label="Profile"
            >
              <Person />
            </IconButton>
            
            <IconButton 
              color="inherit" 
              sx={{ 
                color: '#718096',
                padding: '4px',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  color: '#333'
                }
              }}
              aria-label="Shopping Cart"
            >
              <ShoppingCart />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Navbar;
