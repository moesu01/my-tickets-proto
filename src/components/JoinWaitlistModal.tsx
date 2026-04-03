import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Button,
} from '@mui/material';
import { Close, DragIndicator, AccessTime } from '@mui/icons-material';
import { SoldOutTicketType, WaitlistItem } from '../types';

interface JoinWaitlistModalProps {
  open: boolean;
  onClose: () => void;
  initialTicket: SoldOutTicketType;
  allTicketTypes: SoldOutTicketType[];
  eventName: string;
  eventDate: string;
  eventVenue: string;
  onJoin: (items: Omit<WaitlistItem, 'id'>[]) => void;
}

const EXPIRATION_OPTIONS = [
  { value: 'none', label: "Keep me on until I find tickets" },
  { value: '24h', label: '24 hours before event' },
  { value: '3d', label: '3 days before event' },
  { value: '1w', label: '1 week before event' },
  { value: '2w', label: '2 weeks before event' },
];

type Mode = 'best' | 'fill';

const JoinWaitlistModal: React.FC<JoinWaitlistModalProps> = ({
  open,
  onClose,
  initialTicket,
  allTicketTypes,
  eventName,
  eventDate,
  eventVenue,
  onJoin,
}) => {
  const [mode, setMode] = useState<Mode>('best');

  // qty=0 = not selected; qty≥1 = selected
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    allTicketTypes.forEach(t => { init[t.id] = 0; });
    init[initialTicket.id] = 1;
    return init;
  });

  // Priority order for "best available" mode
  const [selectionOrder, setSelectionOrder] = useState<string[]>([initialTicket.id]);

  const [expiration, setExpiration] = useState('');

  const dragItem = useRef<string | null>(null);
  const dragOverItem = useRef<string | null>(null);

  const selectedIds = selectionOrder;
  const unselectedIds = allTicketTypes.map(t => t.id).filter(id => !selectedIds.includes(id));
  const hasMultipleSelected = selectedIds.length > 1;
  const canSubmit = selectedIds.length > 0;

  const adjustQty = (ticketId: string, delta: number) => {
    const current = quantities[ticketId] ?? 0;
    const next = Math.max(0, current + delta);
    if (next === current) return;

    setQuantities(prev => ({ ...prev, [ticketId]: next }));

    if (current === 0 && next > 0) {
      setSelectionOrder(order => order.includes(ticketId) ? order : [...order, ticketId]);
    } else if (current > 0 && next === 0) {
      setSelectionOrder(order => order.filter(id => id !== ticketId));
    }
  };

  const handleDragStart = (id: string) => { dragItem.current = id; };
  const handleDragEnter = (id: string) => { dragOverItem.current = id; };
  const handleDragEnd = () => {
    if (!dragItem.current || !dragOverItem.current || dragItem.current === dragOverItem.current) {
      dragItem.current = null; dragOverItem.current = null; return;
    }
    setSelectionOrder(order => {
      const next = [...order];
      const from = next.indexOf(dragItem.current!);
      const to = next.indexOf(dragOverItem.current!);
      if (from === -1 || to === -1) return order;
      next.splice(from, 1);
      next.splice(to, 0, dragItem.current!);
      return next;
    });
    dragItem.current = null; dragOverItem.current = null;
  };

  const handleSubmit = () => {
    const today = new Date();
    const joinedOn =
      today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) +
      ', ' + today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const effectiveExpiration = expiration || 'none';
    const expirationLabel = EXPIRATION_OPTIONS.find(o => o.value === effectiveExpiration)?.label ?? effectiveExpiration;

    const items: Omit<WaitlistItem, 'id'>[] = selectedIds.map((id, rank) => {
      const t = allTicketTypes.find(x => x.id === id)!;
      const label = mode === 'best' && selectedIds.length > 1
        ? `${t.label} (#${rank + 1})`
        : t.label;
      return {
        eventName,
        status: 'ongoing',
        expirationDate: expirationLabel,
        isClaimed: false,
        quantity: quantities[id],
        ticketType: label,
        totalPrice: `$${(t.price * quantities[id]).toFixed(2)}`,
        joinedOn,
        venue: eventVenue,
        date: eventDate,
        time: '',
      };
    });

    onJoin(items);
    onClose();
  };

  const QtyControls = ({ id }: { id: string }) => {
    const qty = quantities[id] ?? 0;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
        <Box
          onClick={e => { e.stopPropagation(); adjustQty(id, -1); }}
          sx={{
            width: 24, height: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%',
            border: '1px solid rgba(0,0,0,0.15)',
            cursor: qty === 0 ? 'not-allowed' : 'pointer',
            opacity: qty === 0 ? 0.3 : 1,
            fontSize: '14px', userSelect: 'none',
            '&:hover': { backgroundColor: qty > 0 ? 'rgba(0,0,0,0.06)' : undefined },
          }}
        >
          −
        </Box>
        <Typography sx={{ minWidth: 14, textAlign: 'center', fontWeight: 600, fontSize: '0.8rem' }}>
          {qty}
        </Typography>
        <Box
          onClick={e => { e.stopPropagation(); adjustQty(id, 1); }}
          sx={{
            width: 24, height: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%',
            border: '1px solid rgba(0,0,0,0.15)',
            cursor: 'pointer',
            fontSize: '14px', userSelect: 'none',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.06)' },
          }}
        >
          +
        </Box>
      </Box>
    );
  };

  // Row used in "best available" mode
  const BestRow = ({ id, rank }: { id: string; rank: number }) => {
    const ticket = allTicketTypes.find(t => t.id === id)!;
    return (
      <Box
        draggable
        onDragStart={() => handleDragStart(id)}
        onDragEnter={() => handleDragEnter(id)}
        onDragEnd={handleDragEnd}
        onDragOver={e => e.preventDefault()}
        sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          px: 1.25, py: 1,
          borderRadius: '10px',
          border: '1px solid rgba(0,0,0,0.12)',
          backgroundColor: 'rgba(0,0,0,0.02)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          cursor: 'grab',
        }}
      >
        <DragIndicator sx={{ color: 'text.disabled', fontSize: '1rem', flexShrink: 0 }} />
        <Box sx={{
          width: 18, height: 18, borderRadius: '50%',
          backgroundColor: 'rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'text.secondary' }}>
            {rank + 1}
          </Typography>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.2 }}>{ticket.label}</Typography>
          {ticket.sublabel && (
            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>{ticket.sublabel}</Typography>
          )}
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', flexShrink: 0 }}>${ticket.price.toFixed(2)}</Typography>
        <QtyControls id={id} />
      </Box>
    );
  };

  // Row used in "fill my order" mode or for unselected tickets
  const StandardRow = ({ id }: { id: string; dimmed?: boolean }) => {
    const ticket = allTicketTypes.find(t => t.id === id)!;
    return (
      <Box
        sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          px: 1.25, py: 1,
          borderRadius: '10px',
          border: '1px solid rgba(0,0,0,0.08)',
          backgroundColor: 'transparent',
        }}
      >
        <Box sx={{ width: 16, flexShrink: 0 }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.2 }}>{ticket.label}</Typography>
          {ticket.sublabel && (
            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>{ticket.sublabel}</Typography>
          )}
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', flexShrink: 0 }}>${ticket.price.toFixed(2)}</Typography>
        <QtyControls id={id} />
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: '16px', overflow: 'hidden', m: { xs: 1.5, sm: 2 } } }}
    >
      <DialogTitle sx={{ pb: 0, pt: 2.5, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.2rem' }}>Get in line</Typography>
          <IconButton onClick={onClose} size="small"><Close fontSize="small" /></IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 1.5, pb: 0 }}>
        {/* Mode toggle */}
        <Box
          sx={{
            display: 'flex',
            backgroundColor: 'rgba(0,0,0,0.06)',
            borderRadius: '10px',
            p: 0.5,
            mb: 2,
          }}
        >
          {([['best', 'Best available'], ['fill', 'Fill my order']] as [Mode, string][]).map(([val, label]) => (
            <Box
              key={val}
              onClick={() => setMode(val)}
              sx={{
                flex: 1, textAlign: 'center',
                py: 0.75, borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: mode === val ? '#fff' : 'transparent',
                boxShadow: mode === val ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
                transition: 'background-color 0.15s, box-shadow 0.15s',
              }}
            >
              <Typography sx={{
                fontSize: '0.8rem', fontWeight: mode === val ? 700 : 500,
                color: mode === val ? 'text.primary' : 'text.secondary',
              }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Mode description */}
        <Typography sx={{ color: 'text.secondary', fontSize: '0.78rem', mb: 1.75, lineHeight: 1.5 }}>
          {mode === 'best'
            ? 'Rank ticket types by preference. We\'ll request your top choice first — if it comes through, the rest are cancelled.'
            : 'Select ticket types independently. We\'ll fill each one as availability opens up.'}
        </Typography>

        {/* BEST AVAILABLE mode */}
        {mode === 'best' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 1.5 }}>
            {selectedIds.map((id, rank) => (
              <BestRow key={id} id={id} rank={rank} />
            ))}

            {/* Priority hint — anchored below ranked list */}
            {hasMultipleSelected && (
              <Typography sx={{
                fontSize: '0.72rem', color: 'text.secondary',
                px: 0.5, pb: 0.5, lineHeight: 1.5,
              }}>
                ↑ Priority order — drag to reorder. First match wins, the rest cancel.
              </Typography>
            )}

            {unselectedIds.length > 0 && (
              <>
                <Typography sx={{
                  fontSize: '0.7rem', fontWeight: 600, color: 'text.disabled',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  pt: 0.5, pb: 0.25, pl: 0.5,
                }}>
                  Also join waitlist for
                </Typography>
                {unselectedIds.map(id => (
                  <StandardRow key={id} id={id} dimmed />
                ))}
              </>
            )}
          </Box>
        )}

        {/* FILL MY ORDER mode */}
        {mode === 'fill' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 1.5 }}>
            {allTicketTypes.map(t => (
              <StandardRow key={t.id} id={t.id} />
            ))}
          </Box>
        )}

        {/* Expiration */}
        <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.08)', mt: 1, pt: 2, mb: 1 }}>
          <Box
            sx={{
              display: 'flex', alignItems: 'center', gap: 1.5,
              px: 1.5, py: 1.25,
              borderRadius: '10px',
              border: '1px solid rgba(0,0,0,0.08)',
              backgroundColor: '#f5f5f5',
            }}
          >
            <AccessTime sx={{ fontSize: '1rem', color: 'text.secondary', flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, flexShrink: 0 }}>
              Auto-cancel if not filled
            </Typography>
            <FormControl size="small" sx={{ flex: 1 }}>
              <Select
                value={expiration}
                onChange={e => setExpiration(e.target.value)}
                displayEmpty
                variant="standard"
                disableUnderline
                sx={{ fontSize: '0.82rem', backgroundColor: '#fff', borderRadius: '6px', px: 1 }}
                MenuProps={{ PaperProps: { sx: { backgroundColor: '#fff' } } }}
                renderValue={val =>
                  val
                    ? EXPIRATION_OPTIONS.find(o => o.value === val)?.label
                    : <Typography sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>Select an option</Typography>
                }
              >
                {EXPIRATION_OPTIONS.map(opt => (
                  <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.82rem' }}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1.5 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={!canSubmit}
          onClick={handleSubmit}
          sx={{
            borderRadius: '10px', py: 1.5,
            fontWeight: 700, fontSize: '0.875rem',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            backgroundColor: canSubmit ? '#c8f135' : undefined,
            color: canSubmit ? '#111' : undefined,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#b8e020', boxShadow: 'none' },
            '&.Mui-disabled': { backgroundColor: '#e8f5b0', color: '#999' },
          }}
        >
          Join Waitlist
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JoinWaitlistModal;
