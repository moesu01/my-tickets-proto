import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Fab, Tooltip } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { lightTheme, darkTheme } from './theme';
import Navbar from './components/Navbar';
import TicketContainer from './components/TicketContainer';
import MobileTicketContainer from './components/MobileTicketContainer';
import WaitlistSection from './components/WaitlistSection';
import PastEventsSection from './components/PastEventsSection';
import ProfileSection from './components/ProfileSection';
import RecommendedEventsContainer from './components/RecommendedEventsContainer';
import { getMockData } from './assets/mock-data';

function App() {
  const [pastEventsExpanded, setPastEventsExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [useMinimalData, setUseMinimalData] = useState(false);
  
  // Get the appropriate dataset based on toggle state
  const { tickets: mockTickets, waitlistItems: mockWaitlistItems, profile: mockProfile, recommendedEvents: mockRecommendedEvents } = getMockData(useMinimalData);
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

  const handleThemeToggle = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleDataToggle = () => {
    setUseMinimalData(prev => !prev);
  };

  // Update waitlistItems when data changes
  useEffect(() => {
    setWaitlistItems(mockWaitlistItems);
  }, [mockWaitlistItems]);

  const upcomingTickets = mockTickets.filter(ticket => ticket.status === 'upcoming' || ticket.status === 'waitlisted');
  const pastTickets = mockTickets.filter(ticket => ticket.status === 'past');

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      
      {/* Navbar */}
      <Navbar isDarkMode={isDarkMode} />

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Upcoming Events Section */}
        <TicketContainer
          tickets={upcomingTickets}
          waitlistItems={waitlistItems}
          title="Upcoming Events"
          isDarkMode={isDarkMode}
          onTransfer={handleTransfer}
          onWaitlist={handleWaitlist}
          onDownloadQR={handleDownloadQR}
          onReceipt={handleReceipt}
          onRemoveFromWaitlist={handleRemoveFromWaitlist}
        />

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

      {/* Theme Toggle Button */}
      <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} placement="left">
        <Fab
          color="primary"
          size="small"
          onClick={handleThemeToggle}
          sx={{
            position: 'fixed',
            top: 16,
            right: 80, // Position to the left of the data toggle button
            zIndex: 1000,
            backgroundColor: isDarkMode ? '#424242' : '#ffc107',
            '&:hover': {
              backgroundColor: isDarkMode ? '#616161' : '#ffb300',
            },
          }}
        >
          {isDarkMode ? <LightMode /> : <DarkMode />}
        </Fab>
      </Tooltip>

      {/* Data Toggle Button */}
      <Tooltip title={useMinimalData ? "Switch to Full Data" : "Switch to Minimal Data"} placement="left">
        <Fab
          color="primary"
          size="small"
          onClick={handleDataToggle}
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 1000,
            backgroundColor: useMinimalData ? '#ff9800' : '#1976d2',
            '&:hover': {
              backgroundColor: useMinimalData ? '#f57c00' : '#1565c0',
            },
          }}
        >
          {useMinimalData ? '1' : '∞'}
        </Fab>
      </Tooltip>
    </ThemeProvider>
  );
}

export default App;
