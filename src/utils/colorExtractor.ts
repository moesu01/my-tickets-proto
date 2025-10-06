// Color extraction utilities for dynamic theming

export interface HSLColor {
  h: number; // Hue (0-360)
  s: number; // Saturation (0-100)
  l: number; // Lightness (0-100)
}

export interface DynamicColorVariants {
  hsl: string;
  alpha100: string;
  alpha60: string;
  alpha15: string;
}

/**
 * Extract the most saturated chromatic color from an image
 * This is a simplified implementation - in production, you'd use canvas API
 * to analyze actual image pixels
 */
export function extractDominantColor(imageUrl: string): Promise<HSLColor> {
  return new Promise((resolve) => {
    // For now, return mock colors based on image URL
    // In production, this would analyze the actual image
    const mockColors: HSLColor[] = [
      { h: 45, s: 100, l: 15 }, // Bright yellow from PURSUIT OF HAPPINESS poster
      { h: 220, s: 100, l: 15 }, // Deep blue from poster
      { h: 0, s: 70, l: 15 },   // Red
      { h: 120, s: 70, l: 15 }, // Green
      { h: 300, s: 70, l: 15 }, // Purple
    ];
    
    // Simple hash-based color selection
    const hash = imageUrl.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const colorIndex = Math.abs(hash) % mockColors.length;
    resolve(mockColors[colorIndex]);
  });
}

/**
 * Convert HSL color to CSS string
 */
export function hslToString(hsl: HSLColor): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

/**
 * Create dynamic color variants with different alpha values
 */
export function createColorVariants(hsl: HSLColor): DynamicColorVariants {
  const baseHsl = hslToString(hsl);
  
  return {
    hsl: baseHsl,
    alpha100: baseHsl,
    alpha60: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 0.6)`,
    alpha15: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 0.15)`,
  };
}

/**
 * Process background image with blur and opacity
 * This would typically be done with CSS filters in production
 */
export function processBackgroundImage(imageUrl: string): string {
  // In production, this would apply CSS filters:
  // filter: blur(30px) opacity(0.15)
  return imageUrl;
}

/**
 * Generate QR code styling based on event theme
 */
export function getQRCodeStyle(colorVariants: DynamicColorVariants) {
  return {
    backgroundColor: '#ffffff',
    border: `2px solid ${colorVariants.alpha60}`,
    borderRadius: '8px',
    padding: '8px',
  };
}
