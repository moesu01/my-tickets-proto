import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { Person, ConfirmationNumber } from '@mui/icons-material';

type Page = 'event' | 'tickets';

interface NavbarProps {
  isDarkMode: boolean;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, currentPage, onNavigate }) => {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 10,
        zIndex: 1000,
        py: 1,
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '480px' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: isDarkMode 
              ? 'rgba(18, 18, 18, 0.8)' 
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            filter: 'saturate(2)',
            borderRadius: '1.375rem',
            px: { xs: 2, sm: 3 },
            py: 1.5,

            boxShadow: (theme) => isDarkMode 
              ? `0px 4px 20px 0px rgba(0, 0, 0, 0.4), inset 0px 0px 1px 0px ${theme.palette.background.paper}` 
              : `0px 4px 20px 0px rgba(0, 0, 0, 0.1), inset 0px 0px 1px 0px ${theme.palette.background.paper}`,

          }}
        >
          {/* Logo */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
            onClick={() => onNavigate('event')}
          >
            <Box
              component="img"
              src={`${process.env.PUBLIC_URL}/kyd_logo_nav.svg`}
              alt="kyd labs"
              sx={{
                height: '34px',
                width: 'auto',
                filter: isDarkMode ? 'invert(1)' : 'none',
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
                  color: 'text.primary',
                },
              }}
            >
              Log out
            </Button>

            <Typography
              sx={{ color: 'text.secondary', fontSize: '16px', fontWeight: 400, mx: 0.5 }}
            >
              |
            </Typography>

            <Button
              variant="text"
              startIcon={<ConfirmationNumber sx={{ fontSize: '1.1rem !important' }} />}
              onClick={() => onNavigate(currentPage === 'tickets' ? 'event' : 'tickets')}
              sx={{
                color: currentPage === 'tickets' ? 'text.primary' : 'text.secondary',
                borderRadius: '8px',
                padding: '8px 12px',
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: currentPage === 'tickets' ? 700 : 500,
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                  color: 'text.primary',
                },
              }}
            >
              My Tickets
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Navbar;
