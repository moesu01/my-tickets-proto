import { Ticket, WaitlistItem, Profile, Event } from '../../types';

// Mock data for development and testing
export const mockTickets: Ticket[] = [
  {
    id: 1,
    eventName: "Pursuit Of Happiness W/ Vosters & Dj Chazz Rockwell",
    eventSeries: "Matinee Social Club",
    venue: "The Brooklyn Monarch",
    location: "Brooklyn, NY",
    ticketType: "VIP-Table Seating (up to 6 guests)",
    date: "2025-10-10",
    time: "6:00 → 10:00PM",
    admitCount: 6,
    ticketId: "012390zzv9a0d9f80",
    qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjYwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==",
    eventImage: `${process.env.PUBLIC_URL}/design/event_poster.png`,
    theme: "green",
    status: "upcoming"
  },
  {
    id: 2,
    eventName: "Mach-HOMMY",
    eventSeries: "Three Peat",
    venue: "Le Poisson Rouge",
    location: "New York, NY",
    ticketType: "GA Tier 1",
    date: "2025-10-11",
    time: "11:00 → 3:00AM",
    admitCount: 4,
    ticketId: "012390zzv9a0d9f81",
    qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjYwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==",
    eventImage: `${process.env.PUBLIC_URL}/design/mach-hommy.png`,
    theme: "red",
    status: "upcoming"
  },
  {
    id: 8,
    eventName: "Mach-HOMMY",
    eventSeries: "Three Peat",
    venue: "Le Poisson Rouge",
    location: "New York, NY",
    ticketType: "GA Tier 2",
    date: "2025-10-11",
    time: "11:00 → 3:00AM",
    admitCount: 1,
    ticketId: "012390zzv9a0d9f88",
    qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjYwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==",
    eventImage: `${process.env.PUBLIC_URL}/design/mach-hommy.png`,
    theme: "red",
    status: "waitlisted"
  },
  {
    id: 3,
    eventName: "GIMME",
    eventSeries: "GIMME",
    venue: "Le Poisson Rouge",
    location: "New York, NY",
    ticketType: "GA Tier 1",
    date: "2026-02-07",
    time: "6:00PM",
    admitCount: 2,
    ticketId: "012390zzv9a0d9f82",
    qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjYwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==",
    eventImage: `${process.env.PUBLIC_URL}/design/gimme.png`,
    theme: "blue",
    status: "upcoming"
  },
  {
    id: 4,
    eventName: "Mike Nasty Presents: No Filter!",
    eventSeries: "Mike Nasty Presents",
    venue: "Le Poisson Rouge",
    location: "New York, NY",
    ticketType: "GA Tier 1",
    date: "2025-06-06",
    time: "11:00PM",
    admitCount: 2,
    ticketId: "012390zzv9a0d9f83",
    qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjYwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==",
    eventImage: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
    theme: "purple",
    status: "past"
  },
  {
    id: 5,
    eventName: "Matinee Social Club, 90s vs 00s",
    eventSeries: "Matinee Social Club",
    venue: "Le Poisson Rouge",
    location: "New York, NY",
    ticketType: "GA Tier 1",
    date: "2025-08-23",
    time: "5:00PM",
    admitCount: 2,
    ticketId: "012390zzv9a0d9f84",
    qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjYwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==",
    eventImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop",
    theme: "orange",
    status: "past"
  },
  {
    id: 6,
    eventName: "Madame Arthur Cabaret Presents: MADAM GAGA",
    eventSeries: "Madame Arthur Cabaret",
    venue: "Le Poisson Rouge",
    location: "New York, NY",
    ticketType: "GA Tier 1",
    date: "2025-09-15",
    time: "11:00PM",
    admitCount: 2,
    ticketId: "012390zzv9a0d9f85",
    qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjYwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==",
    eventImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    theme: "pink",
    status: "upcoming"
  },
  {
    id: 7,
    eventName: "Electronic Dreams Festival",
    eventSeries: "Electronic Dreams",
    venue: "Brooklyn Steel",
    location: "Brooklyn, NY",
    ticketType: "VIP Early Bird",
    date: "2025-12-15",
    time: "8:00PM",
    admitCount: 4,
    ticketId: "012390zzv9a0d9f86",
    qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjYwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==",
    eventImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    theme: "cyan",
    status: "past"
  }
];

export const mockWaitlistItems: WaitlistItem[] = [
  // Active entries (ongoing) - chronological order
  {
    id: 1,
    eventName: "Mach-Hommy",
    status: "ongoing",
    expirationDate: "Jan 15, 2025 before 11:59PM",
    ticketId: "TKT-001-2024",
    isClaimed: false,
    quantity: 1,
    ticketType: "GA Advance",
    totalPrice: "$144.00",
    joinedOn: "Tue Sep 16, 07:36AM"
  },
  {
    id: 4,
    eventName: "Gimme Gimme",
    status: "ongoing",
    expirationDate: "Jan 20, 2025 before 11:59PM",
    ticketId: "TKT-004-2024",
    isClaimed: false,
    quantity: 3,
    ticketType: "GA Advance",
    totalPrice: "$198.00",
    joinedOn: "Thu Sep 12, 09:22AM"
  },
  // Expired entries - chronological order
  {
    id: 2,
    eventName: "Mach-HOMMY",
    status: "expired",
    expirationDate: "Expired",
    ticketId: "TKT-002-2024",
    isClaimed: false,
    quantity: 2,
    ticketType: "VIP Tier 1",
    totalPrice: "$89.00",
    joinedOn: "Mon Aug 15, 02:15PM"
  },
  {
    id: 5,
    eventName: "Classical Concert",
    status: "expired",
    expirationDate: "Expired",
    ticketId: "TKT-005-2024",
    isClaimed: true,
    quantity: 2,
    ticketType: "Premium Seating",
    totalPrice: "$156.00",
    joinedOn: "Fri Jun 28, 04:30PM"
  },
  // Cancelled entries - chronological order
  {
    id: 3,
    eventName: "GIMME",
    status: "cancelled",
    expirationDate: "N/A",
    ticketId: "TKT-003-2024",
    isClaimed: false,
    quantity: 1,
    ticketType: "GA Tier 2",
    totalPrice: "$65.00",
    joinedOn: "Wed Jul 20, 11:45AM"
  }
];

export const mockProfile: Profile = {
  firstName: "Maxwell",
  lastName: "JuniorMaxwell 2",
  email: "firstname.last@gmail.com",
  phone: "+1 (917) 012 3456"
};

export const mockRecommendedEvents: Event[] = [
  {
    id: "rec-1",
    title: "New Amsterdam Presents: Teddy Abrams and Special Guests",
    date: "Thu Jul 31",
    time: "7:00PM",
    venue: "Le Poisson Rouge",
    image: `${process.env.PUBLIC_URL}/design/event_poster.png`,
    onGetTickets: () => console.log('Get tickets for Teddy Abrams event'),
  },
  {
    id: "rec-2",
    title: "Herbert Holler's Freedom Party NYC Annual Michael Jackson Tribute",
    date: "Fri Aug 1",
    time: "6:00PM",
    venue: "Le Poisson Rouge",
    image: `${process.env.PUBLIC_URL}/design/mach-hommy.png`,
    onGetTickets: () => console.log('Get tickets for Michael Jackson Tribute'),
  },
  {
    id: "rec-3",
    title: "THE DOLLYROTS Get On This Ride Tour w/ Black Widows + Soraia",
    date: "Thu Aug 7",
    time: "7:00PM",
    venue: "Le Poisson Rouge",
    image: `${process.env.PUBLIC_URL}/design/gimme.png`,
    onGetTickets: () => console.log('Get tickets for THE DOLLYROTS'),
  },
  {
    id: "rec-4",
    title: "Electronic Dreams Festival",
    date: "Sat Dec 15",
    time: "8:00PM",
    venue: "Brooklyn Steel",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    onGetTickets: () => console.log('Get tickets for Electronic Dreams Festival'),
  },
  {
    id: "rec-5",
    title: "Matinee Social Club, 90s vs 00s",
    date: "Sat Aug 23",
    time: "5:00PM",
    venue: "Le Poisson Rouge",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop",
    onGetTickets: () => console.log('Get tickets for Matinee Social Club'),
  },
];

// Minimal dataset for testing single ticket scenario
export const minimalMockTickets: Ticket[] = [
  {
    id: 1,
    eventName: "Pursuit Of Happiness W/ Vosters & Dj Chazz Rockwell",
    eventSeries: "Matinee Social Club",
    venue: "The Brooklyn Monarch",
    location: "Brooklyn, NY",
    ticketType: "VIP-Table Seating (up to 6 guests)",
    date: "2025-10-10",
    time: "6:00 → 10:00PM",
    admitCount: 6,
    ticketId: "012390zzv9a0d9f80",
    qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjYwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==",
    eventImage: `${process.env.PUBLIC_URL}/design/event_poster.png`,
    theme: "green",
    status: "upcoming"
  }
];

export const minimalMockWaitlistItems: WaitlistItem[] = [];

// Function to get the appropriate dataset based on mode
export const getMockData = (useMinimalData: boolean) => {
  return {
    tickets: useMinimalData ? minimalMockTickets : mockTickets,
    waitlistItems: useMinimalData ? minimalMockWaitlistItems : mockWaitlistItems,
    profile: mockProfile,
    recommendedEvents: mockRecommendedEvents
  };
};
