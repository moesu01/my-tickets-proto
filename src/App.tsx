import React, { useState, useRef, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Box } from '@mui/material';
import { theme } from './theme';
import Navbar from './components/Navbar';
import TicketCard from './components/TicketCard';
import MobileTicketContainer from './components/MobileTicketContainer';
import WaitlistSection from './components/WaitlistSection';
import PastEventsSection from './components/PastEventsSection';
import ProfileSection from './components/ProfileSection';
import { mockTickets, mockWaitlistItems, mockProfile } from './assets/mock-data';

function App() {
  const [pastEventsExpanded, setPastEventsExpanded] = useState(true);
  const [waitlistItems, setWaitlistItems] = useState(mockWaitlistItems);
  const [scrollPosition, setScrollPosition] = useState(0);
  const ticketsContainerRef = useRef<HTMLDivElement>(null);

  const handleTransfer = (ticketId: string) => {
    console.log('Transfer ticket:', ticketId);
  };

  const handleWaitlist = (ticketId: string) => {
    console.log('Add to waitlist:', ticketId);
  };

  const handleDownloadQR = (ticketId: string) => {
    console.log('Download QR code:', ticketId);
  };

  const handleReceipt = (ticketId: string) => {
    console.log('View receipt:', ticketId);
  };

  const handleViewTicket = (ticketId: string) => {
    console.log('View ticket:', ticketId);
  };

  const handleWaitlistUpdate = (updatedItem: typeof mockWaitlistItems[0]) => {
    setWaitlistItems(prev => 
      prev.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
  };

  const upcomingTickets = mockTickets.filter(ticket => ticket.status === 'upcoming');
  const pastTickets = mockTickets.filter(ticket => ticket.status === 'past');

  // Handle scroll events for dynamic mask
  useEffect(() => {
    const container = ticketsContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      setScrollPosition(scrollLeft);
    };

    container.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Navbar */}
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Upcoming Events Section */}
        <Box 
          id="upcoming-events-section"
          className="upcoming-events-section"
          sx={{ mb: 4 }}
        >
          {/* Header */}
          <Box 
            id="upcoming-events-header"
            className="upcoming-events-header"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 3,
              px: 0
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography 
                variant="h5" 
                component="h2" 
                sx={{ 
                  fontWeight: 400,
                  fontSize: '20px',
                  color: '#4a5568',
                  letterSpacing: '-0.6px',
                  lineHeight: '24px'
                }}
              >
                Upcoming Events
              </Typography>
              <Box sx={{ 
                backgroundColor: '#4a5568', 
                color: 'white', 
                borderRadius: '50%', 
                width: 20, 
                height: 20, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 500,
                ml: 0.5
              }}>
                {upcomingTickets.length}
              </Box>
            </Box>
          </Box>
          
          {/* Mobile Tickets Container */}
          <MobileTicketContainer
            tickets={upcomingTickets}
            onTransfer={handleTransfer}
            onWaitlist={handleWaitlist}
            onDownloadQR={handleDownloadQR}
            onReceipt={handleReceipt}
          />
          
          {/* Desktop/Tablet Tickets Container */}
          <Box 
            ref={ticketsContainerRef}
            id="upcoming-events-tickets-container"
            className="upcoming-events-tickets-container"
            sx={{ 
              display: { xs: 'none', md: 'flex' }, // Hide on mobile, show on tablet and desktop
              gap: 2, // 24px spacing between cards
              pb: 2,
              pl: 1, // Add left padding for shadow space
              pr: 6,
              overflowX: 'auto', // Enable horizontal scrolling
              overflowY: 'visible', // Prevent vertical scrolling
              // Hide scrollbars
              scrollbarWidth: 'none', // Firefox
              '&::-webkit-scrollbar': {
                display: 'none', // Chrome, Safari, Edge
              },
              // Dynamic CSS mask based on scroll position
              maskImage: scrollPosition > 0 
                ? 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)'
                : 'linear-gradient(to right, black 0%, black 90%, transparent 100%)',
              WebkitMaskImage: scrollPosition > 0 
                ? 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)'
                : 'linear-gradient(to right, black 0%, black 90%, transparent 100%)',
              maskSize: '100% 100%', // Make mask 150% of container width to prevent premature cutting
              WebkitMaskSize: '100% 100%',
              maskPosition: 'center', // Center the mask on the container
              WebkitMaskPosition: 'center',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              // Smooth transition between mask states
              transition: 'mask-image 0.2s ease-out, -webkit-mask-image 0.2s ease-out',
            }}
          >
            {upcomingTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onTransfer={handleTransfer}
                onWaitlist={handleWaitlist}
                onDownloadQR={handleDownloadQR}
                onReceipt={handleReceipt}
              />
            ))}
          </Box>
        </Box>

        {/* Past Events Section */}
        <PastEventsSection 
          tickets={pastTickets}
          expanded={pastEventsExpanded}
          onToggleExpanded={() => setPastEventsExpanded(!pastEventsExpanded)}
          onReceipt={handleReceipt}
          onViewTicket={handleViewTicket}
        />

        {/* Waitlist Section */}
        <WaitlistSection 
          waitlistItems={waitlistItems}
          onRemove={(id: number) => console.log('Remove from waitlist:', id)}
          onClaim={(id: number) => console.log('Claim ticket:', id)}
          onUpdate={handleWaitlistUpdate}
        />

        {/* Profile Section */}
        <ProfileSection 
          profile={mockProfile}
          onUpdate={(updatedProfile: typeof mockProfile) => console.log('Update profile:', updatedProfile)}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
