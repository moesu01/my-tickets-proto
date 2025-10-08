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

## Future Considerations

- Consider using Intersection Observer API for more reliable active ticket detection
- Monitor browser compatibility for scroll snap features
- Test on various screen sizes and devices
