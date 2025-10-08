import React from 'react';
import { Box, IconButton, Typography, Container, Button } from '@mui/material';
import { Person, ShoppingCart } from '@mui/icons-material';

interface NavbarProps {
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode }) => {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 10,
        zIndex: 1000,
        py: 1, // 8px vertical padding
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '480px' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'background.paper',
            borderRadius: '1.375rem',
            px: { xs: 2, sm: 3 },
            py: 1.5,
            // boxShadow: isDarkMode 
            //   ? '0px 4px 10px 0px rgba(0, 0, 0, 0.3)' 
            //   : '0px 4px 10px 0px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src={`${process.env.PUBLIC_URL}/kyd_logo_nav.svg`} 
              alt="kyd labs" 
              sx={{ 
                height: '34px',
                width: 'auto',
                filter: isDarkMode ? 'invert(1)' : 'none'
              }}
            />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              variant="text"
              startIcon={<Person />}
              sx={{
                color: 'text.secondary',
                borderRadius: '8px',
                padding: '8px 12px',
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                  color: 'text.primary'
                }
              }}
            >
              Log out
            </Button>
            
            <Typography
              sx={{
                color: 'text.secondary',
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
                color: 'text.secondary',
                borderRadius: '8px',
                padding: '8px',
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                  color: 'text.primary'
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
