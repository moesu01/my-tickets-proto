// TypeScript types for My Tickets application

export interface Ticket {
  id: number;
  eventName: string;
  eventSeries: string;
  venue: string;
  location: string;
  ticketType: string;
  date: string;
  time: string;
  admitCount: number;
  ticketId: string;
  qrCode: string;
  eventImage: string;
  theme: string;
  status: 'upcoming' | 'past' | 'cancelled' | 'refunded' | 'transferred' | 'waitlisted';
}

export interface WaitlistItem {
  id: number;
  eventName: string;
  status: 'ongoing' | 'cancelled' | 'expired' | 'filled';
  expirationDate: string;
  ticketId?: string;
  isClaimed?: boolean;
  quantity: number;
  ticketType: string;
  totalPrice: string;
  joinedOn: string;
  venue: string;
  date: string;
  time: string;
  eventImage?: string;
}

export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface DynamicColor {
  hsl: string;
  alpha100: string;
  alpha60: string;
  alpha15: string;
}

export interface TicketCardProps {
  ticket: Ticket;
  onTransfer?: (ticketId: string) => void;
  onWaitlist?: (ticketId: string) => void;
  onDownloadQR?: (ticketId: string) => void;
  onReceipt?: (ticketId: string) => void;
  onRemoveFromWaitlist?: (ticketId: string) => void;
}

export interface WaitlistCardProps {
  item: WaitlistItem;
  onRemove?: (itemId: number) => void;
  onClaim?: (itemId: number) => void;
  onEdit?: (itemId: number) => void;
  onUnlist?: (itemId: number) => void;
  showActions: 'active' | 'listed';
}

export interface PastEventRowProps {
  ticket: Ticket;
  onViewReceipt?: (ticketId: string) => void;
  onViewTicket?: (ticketId: string) => void;
}

export interface ProfileFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  validation?: (value: string) => string | null;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  image: string;
  onGetTickets: () => void;
}

export interface EventCardProps {
  event: Event;
}

export interface RecommendedEventsContainerProps {
  events: Event[];
  isDarkMode?: boolean;
}
