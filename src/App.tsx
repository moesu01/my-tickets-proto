import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Box } from '@mui/material';
import { theme } from './theme';
import Navbar from './components/Navbar';
import TicketContainer from './components/TicketContainer';
import MobileTicketContainer from './components/MobileTicketContainer';
import WaitlistSection from './components/WaitlistSection';
import PastEventsSection from './components/PastEventsSection';
import ProfileSection from './components/ProfileSection';
import RecommendedEventsContainer from './components/RecommendedEventsContainer';
import { mockTickets, mockWaitlistItems, mockProfile, mockRecommendedEvents } from './assets/mock-data';

function App() {
  const [pastEventsExpanded, setPastEventsExpanded] = useState(true);
  const [waitlistItems, setWaitlistItems] = useState(mockWaitlistItems);

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

  const handleRemoveFromWaitlist = (ticketId: string) => {
    console.log('Remove from waitlist:', ticketId);
  };

  const handleViewTicket = (ticketId: string) => {
    console.log('View ticket:', ticketId);
  };

  const handleWaitlistUpdate = (updatedItem: typeof mockWaitlistItems[0]) => {
    setWaitlistItems(prev => 
      prev.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
  };

  const upcomingTickets = mockTickets.filter(ticket => ticket.status === 'upcoming' || ticket.status === 'waitlisted');
  const pastTickets = mockTickets.filter(ticket => ticket.status === 'past');

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
          
          {/* Mobile Tickets Container - DISABLED */}
          {/* <MobileTicketContainer
            tickets={upcomingTickets}
            onTransfer={handleTransfer}
            onWaitlist={handleWaitlist}
            onDownloadQR={handleDownloadQR}
            onReceipt={handleReceipt}
            onRemoveFromWaitlist={handleRemoveFromWaitlist}
          /> */}
          
          {/* Desktop/Tablet/Mobile Tickets Container */}
          <TicketContainer
            tickets={upcomingTickets}
            onTransfer={handleTransfer}
            onWaitlist={handleWaitlist}
            onDownloadQR={handleDownloadQR}
            onReceipt={handleReceipt}
            onRemoveFromWaitlist={handleRemoveFromWaitlist}
          />
        </Box>

        {/* Recommended Events Section */}
        <RecommendedEventsContainer events={mockRecommendedEvents} />

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
