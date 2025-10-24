# Development Learnings & Solutions

## Overview
This document captures key learnings, solutions, and implementation patterns discovered during development. It serves as a knowledge base for common problems and their solutions.

---

## Scroll Snap Implementation (TicketContainer.tsx)

## Key Implementation Details

### Scroll Snap Configuration
```tsx
scrollSnapType: 'x mandatory',
scrollSnapAlign: 'center', // Each ticket centers in viewport
scrollPaddingLeft: { xs: '8px', md: '13px' },
scrollPaddingRight: { xs: '8px', md: '48px' }, // Asymmetric for last ticket centering
```

### Container Padding (Asymmetric)
```tsx
pl: { xs: 1, md: 1.65 }, // Left padding: 8px mobile, ~13px desktop
pr: { xs: 1, md: 6 },    // Right padding: 8px mobile, 48px desktop
```

**Why asymmetric?** The extra right padding allows the last ticket to scroll far enough to center properly.

### Active Ticket Detection
Uses scroll position calculation with scroll padding adjustment:
```tsx
const scrollPadding = window.innerWidth < 768 ? 8 : 13;
const adjustedScrollLeft = container.scrollLeft + scrollPadding;
const currentIndex = Math.round(adjustedScrollLeft / (cardWidth + gap));
```

### Arrow Navigation
**Key Learning:** Use `activeTicketIndex` directly instead of recalculating from scroll position.

```tsx
const scrollToNext = () => {
  const currentIndex = activeTicketIndex; // Use existing state
  const targetIndex = Math.min(children.length - 1, currentIndex + 1);
  
  if (currentIndex >= children.length - 1) return; // Boundary check
  
  children[targetIndex].scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center', // Must match scrollSnapAlign
  });
};
```

### Spacer Element
**Critical for last ticket navigation:**
```tsx
{/* Extra spacer to allow last ticket to scroll into view */}
<Box
  sx={{
    flexShrink: 0,
    width: { xs: '50vw', md: '50vw' }, // Provides extra scrollable space
  }}
/>
```

## Common Issues & Solutions

### Issue: Last ticket can't be reached with arrow navigation
**Root Cause:** `scrollIntoView` with `inline: 'center'` doesn't have enough scrollable space
**Solution:** Add spacer element at end of container

### Issue: Jarring snap at last ticket
**Root Cause:** Asymmetric padding without matching scroll padding
**Solution:** Match `scrollPaddingRight` to actual right padding (`pr`)

### Issue: Arrow navigation skips tickets
**Root Cause:** Arrow calculation doesn't match scroll snap behavior
**Solution:** Use `activeTicketIndex` state instead of recalculating

### Issue: Visual glitch after scroll
**Root Cause:** JavaScript calculation happens before CSS scroll snap completes
**Solution:** Use `requestAnimationFrame` (double) to wait for scroll snap

## Best Practices

1. **Always match scroll padding to actual padding** - Prevents calculation mismatches
2. **Use `activeTicketIndex` for navigation** - Single source of truth
3. **Add spacer element for last item** - Ensures proper centering
4. **Use `requestAnimationFrame` for scroll calculations** - Waits for CSS completion
5. **Keep `inline: 'center'` consistent** - Must match `scrollSnapAlign`

## Problem-Solving Approach

### When Asked to Think About a Problem
1. **Read existing code and comments first** - Don't suggest changes without understanding what's already there
2. **Understand the root cause** - Analyze why something is happening before jumping to solutions
3. **Look for existing annotations** - Code comments often contain the solution or explanation
4. **Trust the user's analysis** - They may have already identified the correct approach
5. **Ask clarifying questions** - Better to understand the problem fully than provide wrong solutions

## Testing Checklist

- [ ] All tickets can be reached with arrow navigation
- [ ] Last ticket centers properly (no jarring snap)
- [ ] Manual scrolling works smoothly
- [ ] Active ticket detection is accurate
- [ ] Blur/scale effects work correctly
- [ ] No visual glitches during navigation

## Critical Learning: Keep Scroll Snap Fixes Simple

### The Over-Engineering Problem
**Issue**: We keep over-engineering fixes to scroll snapping when the solutions are much simpler than expected.

### Recent Example: Mobile Padding Issue
**Problem**: After removing main container padding (`px: { xs: 0, md: 2 }`), first ticket wasn't visible on mobile
**Over-engineered approach**: Complex scroll padding calculations, active ticket detection fixes, etc.
**Simple solution**: Just add `xs: 4` to the tickets container left padding (`pl: { xs: 4, md: 1.65 }`)

### Key Insight
**The scroll snap system just needs enough left padding to center the first ticket properly.** No complex calculations or matching padding values required.

### Best Practice Going Forward
1. **Try the simplest fix first** - Usually just adjusting padding
2. **Don't overthink scroll padding calculations** - The browser handles most of it
3. **Test visually first** - If it looks right, it probably is right
4. **Avoid complex JavaScript calculations** unless absolutely necessary

## CSS Mask Delay Issue & Solution

### Issue: Delay before CSS mask updates when using arrow navigation
**Root Cause:** The CSS mask updates are tied to `scrollPosition` state, which only updates during scroll events. When using `scrollIntoView({ behavior: 'smooth' })`, there's a delay before scroll events start firing during the smooth animation.

**Problem Sequence:**
1. Arrow click → `scrollIntoView()` starts smooth scroll
2. Smooth scrolling animation begins (takes time)
3. Scroll events fire during animation
4. `setScrollPosition()` updates state
5. React re-render with new mask styles
6. **Result:** Mask changes are delayed until scroll animation progresses

**Solution:** Preemptively update scroll position state before smooth scroll starts
```tsx
// In scrollToNext() and scrollToPrevious()
const cardWidth = children[0].offsetWidth || 1;
const gap = 16; // Approximate gap between cards
const estimatedScrollLeft = targetIndex * (cardWidth + gap);
setScrollPosition(estimatedScrollLeft); // Immediate mask update

children[targetIndex].scrollIntoView({
  behavior: 'smooth', // Smooth scroll still works
  block: 'nearest',
  inline: 'center',
});
```

**Key Learning:** When CSS effects depend on scroll state, update the state immediately before starting scroll animations to eliminate visual delays.

## Data Toggle Implementation (Three Modes)

### Overview
Added a third data toggle mode that cycles through: Full Data → Minimal Data (1 event) → Empty Data (0 events) → Full Data

### Implementation Details

#### Mock Data Structure (`src/assets/mock-data/index.ts`)
```tsx
// Three datasets for different modes
export const mockTickets: Ticket[] = [...]; // Full dataset
export const minimalMockTickets: Ticket[] = [...]; // Single event
export const emptyMockTickets: Ticket[] = []; // Empty array

// Updated function signature
export const getMockData = (dataMode: 'full' | 'minimal' | 'empty') => {
  switch (dataMode) {
    case 'minimal': return { tickets: minimalMockTickets, ... };
    case 'empty': return { tickets: emptyMockTickets, ... };
    case 'full': 
    default: return { tickets: mockTickets, ... };
  }
};
```

#### App Component State Management (`src/App.tsx`)
```tsx
// Changed from boolean to string state
const [dataMode, setDataMode] = useState<'full' | 'minimal' | 'empty'>('full');

// Cycle through three states
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

// Conditional rendering
{dataMode !== 'empty' && <WaitlistSection ... />}
```

#### Toggle Component Display (`src/components/ThemeDataToggle.tsx`)
```tsx
// Dynamic display based on mode
const getDataModeDisplay = () => {
  switch (dataMode) {
    case 'full': return { text: '∞', tooltip: 'Switch to Minimal Data' };
    case 'minimal': return { text: '1', tooltip: 'Switch to Empty Data' };
    case 'empty': return { text: '0', tooltip: 'Switch to Full Data' };
  }
};
```

#### Empty State UI (`src/components/TicketContainer.tsx`)
```tsx
// Early return for empty state
if (tickets.length === 0) {
  return (
    <Box>
      <Typography variant="sectionHeader">YOUR TICKETS</Typography>
      <Typography variant="h5">No events, let's find you something!</Typography>
    </Box>
  );
}
```

### Key Design Decisions

1. **Three-state cycle**: Full → Minimal → Empty → Full (not binary toggle)
2. **Hide WaitlistSection**: Completely hidden in empty mode (not just empty state)
3. **Consistent styling**: Empty state maintains same visual hierarchy as normal state
4. **Early return pattern**: Clean separation of empty vs normal rendering logic

### Benefits

- **Testing flexibility**: Easy to test different data scenarios
- **User experience**: Clear progression through different states
- **Code organization**: Clean separation of concerns for each mode
- **Maintainability**: Easy to add more modes in the future

## Future Considerations

- Consider using Intersection Observer API for more reliable active ticket detection
- Monitor browser compatibility for scroll snap features
- Test on various screen sizes and devices
- **Remember: Scroll snap fixes are usually simpler than they seem**
- Consider adding more data modes (e.g., "many" for stress testing)
