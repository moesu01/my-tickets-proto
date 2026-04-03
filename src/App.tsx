import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import Navbar from './components/Navbar';
import TicketContainer from './components/TicketContainer';
import WaitlistSection from './components/WaitlistSection';
import ProfileSection from './components/ProfileSection';
import RecommendedEventsContainer from './components/RecommendedEventsContainer';
import ThemeDataToggle from './components/ThemeDataToggle';
import EventPage from './components/EventPage';
import { getMockData, mockSoldOutEvent } from './assets/mock-data';
import { WaitlistItem } from './types';

type Page = 'event' | 'tickets';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('event');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dataMode, setDataMode] = useState<'full' | 'minimal' | 'empty'>('full');

  const { tickets: mockTickets, waitlistItems: mockWaitlistItems, profile: mockProfile, recommendedEvents: mockRecommendedEvents } = getMockData(dataMode);
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
    setCurrentPage('event');
  };

  const handleWaitlistUpdate = (updatedItem: WaitlistItem) => {
    setWaitlistItems(prev =>
      prev.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
  };

  const handleJoinWaitlist = (newItems: Omit<WaitlistItem, 'id'>[]) => {
    setWaitlistItems(prev => {
      const maxId = prev.reduce((max, item) => Math.max(max, item.id), 0);
      const withIds = newItems.map((item, i) => ({ ...item, id: maxId + i + 1 }));
      return [...prev, ...withIds];
    });
  };

  const handleThemeToggle = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleDataToggle = () => {
    setDataMode(prev => {
      switch (prev) {
        case 'full': return 'minimal';
        case 'minimal': return 'empty';
        case 'empty': return 'full';
        default: return 'full';
      }
    });
  };

  useEffect(() => {
    setWaitlistItems(mockWaitlistItems);
  }, [mockWaitlistItems]);

  const upcomingTickets = mockTickets.filter(ticket => ticket.status === 'upcoming' || ticket.status === 'waitlisted');
  const pastTickets = mockTickets.filter(ticket => ticket.status === 'past');

  const recommendedEventsWithNav = mockRecommendedEvents.map(e => ({
    ...e,
    onGetTickets: () => setCurrentPage('event'),
  }));

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />

      <Navbar
        isDarkMode={isDarkMode}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      {currentPage === 'event' ? (
        <EventPage
          event={mockSoldOutEvent}
          onJoinWaitlist={handleJoinWaitlist}
        />
      ) : (
        <Container maxWidth="lg" sx={{ py: 3 }}>
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

          <RecommendedEventsContainer
            events={recommendedEventsWithNav}
            isDarkMode={isDarkMode}
            onNavigateToEvent={() => setCurrentPage('event')}
          />

          {waitlistItems.length > 0 && (
            <WaitlistSection
              waitlistItems={waitlistItems}
              isDarkMode={isDarkMode}
              onRemove={(id: number) => console.log('Remove from waitlist:', id)}
              onClaim={(id: number) => console.log('Claim ticket:', id)}
              onUpdate={handleWaitlistUpdate}
            />
          )}

          <ProfileSection
            profile={mockProfile}
            onUpdate={(updatedProfile: typeof mockProfile) => console.log('Update profile:', updatedProfile)}
            isDarkMode={isDarkMode}
            pastTickets={pastTickets}
            onReceipt={handleReceipt}
            onViewTicket={handleViewTicket}
          />
        </Container>
      )}

      <ThemeDataToggle
        isDarkMode={isDarkMode}
        dataMode={dataMode}
        onThemeToggle={handleThemeToggle}
        onDataToggle={handleDataToggle}
      />
    </ThemeProvider>
  );
}

export default App;
