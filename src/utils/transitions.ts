/**
 * Reusable transition utilities for hide/show animations using transform scale
 */

export interface HideShowTransitionProps {
  isVisible: boolean;
  duration?: number;
  easing?: string;
}

/**
 * Creates consistent hide/show transition styles using transform scale
 * @param isVisible - Whether the element should be visible
 * @param duration - Transition duration in seconds (default: 0.2)
 * @param easing - CSS easing function (default: 'ease-out')
 */
export const createHideShowTransition = ({
  isVisible,
  duration = 0.2,
  easing = 'ease-out'
}: HideShowTransitionProps) => ({
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
  transformOrigin: 'top',
  height: isVisible ? 'auto' : '0px',
  overflow: 'hidden',
  transition: `opacity ${duration}s ${easing}, transform ${duration}s ${easing}, height ${duration}s ${easing}, filter ${duration}s ${easing}`,
});

/**
 * Universal hide/show transition - works for any content
 * @param isVisible - Whether the element should be visible
 */
export const hideShowTransition = (isVisible: boolean) => ({
  opacity: isVisible ? 1 : 0,
  maxHeight: isVisible ? '1000px' : '0px',
  overflow: 'hidden',
  filter: isVisible ? 'blur(0px)' : 'blur(23px)',
  transition: 'opacity 0.35s ease-out, max-height 0.2s ease-out, filter 0.2s ease-out'
});

/**
 * Predefined transition configurations for common use cases
 */
export const transitions = {
  // Universal transition for any content
  A: hideShowTransition,
  
  // For quick animations
  quick: (isVisible: boolean) => createHideShowTransition({
    isVisible,
    duration: 0.15,
    easing: 'ease-out'
  }),
  
  // For slower, more elegant animations
  elegant: (isVisible: boolean) => createHideShowTransition({
    isVisible,
    duration: 0.3,
    easing: 'ease-in-out'
  }),
  
  // For bouncy animations
  bouncy: (isVisible: boolean) => createHideShowTransition({
    isVisible,
    duration: 0.25,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  })
};