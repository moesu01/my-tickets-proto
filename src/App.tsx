import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
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
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const upcomingTickets = mockTickets.filter(ticket => ticket.status === 'upcoming' || ticket.status === 'waitlisted');
  const pastTickets = mockTickets.filter(ticket => ticket.status === 'past');

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      
      {/* Navbar */}
      <Navbar onThemeToggle={handleThemeToggle} isDarkMode={isDarkMode} />

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Upcoming Events Section */}
        <TicketContainer
          tickets={upcomingTickets}
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
    </ThemeProvider>
  );
}

export default App;
