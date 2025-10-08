import { createTheme } from '@mui/material/styles';

// Color constants
export const COLORS = {
  primaryText: '#353535', // Main text color for headers and important content
  borderLight: 'rgba(0,0,0,.15)',
  iconColor: 'rgba(0,0,0,.35)',
} as const;
// Color constants DARK THEME
export const COLORS_DARK = {
  primaryText: '#ffffff', // Main text color for headers and important content
  borderLight: 'rgba(255,255,255,.15)',
  iconColor: 'rgba(255,255,255,.35)',
} as const;

// Custom MUI theme for My Tickets app
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#007bff', // Accent blue from design system
      light: '#4da6ff',
      dark: '#0056b3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6c757d', // Medium gray for secondary elements
      light: '#adb5bd',
      dark: '#495057',
      contrastText: '#ffffff',
    },
    background: {
      default: '#E1E2E6', // Light gray background
      paper: '#f8f9fa', // Light gray background
    },
    text: {
      primary: '#333333', // Dark gray text
      secondary: '#666666', // Medium gray text
    },
    grey: {
      50: '#f8f9fa',
      100: '#e9ecef',
      200: '#dee2e6',
      300: '#ced4da',
      400: '#adb5bd',
      500: '#6c757d',
      600: '#495057',
      700: '#343a40',
      800: '#212529',
      900: '#000000',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    button: {
      fontSize: '1rem',
      fontWeight: 500,
      textTransform: 'none', // Remove uppercase transformation
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 12, // 0.75rem equivalent
  },
  components: {
    // Card component customization
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem',
          minWidth: '350px', // Desktop min width
          '@media (max-width: 768px)': {
            minWidth: '100%',
            padding: '1rem',
          },
        },
      },
    },
    // Button component customization
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem',
          fontWeight: 500,
          transition: 'all 0.2s ease',
          minHeight: '44px', // Touch-friendly minimum height
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    // Typography component customization
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#333333',
        },
      },
    },
    // Container component customization
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '1rem',
          paddingRight: '1rem',
          '@media (min-width: 600px)': {
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
          },
        },
      },
    },
    // Chip component customization for status badges
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          fontWeight: 500,
          fontSize: '0.875rem',
        },
      },
    },
    // TextField component customization
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.5rem',
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768, // Mobile breakpoint
      lg: 1024, // Desktop breakpoint
      xl: 1200,
    },
  },
});

// Dark theme variant
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4da6ff', // Lighter blue for dark mode
      light: '#80bfff',
      dark: '#007bff',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#adb5bd', // Lighter gray for dark mode
      light: '#ced4da',
      dark: '#6c757d',
      contrastText: '#ffffff',
    },
    background: {
      default: '#292929', // Dark background
      paper: '#080808', // Darker paper background
    },
    text: {
      primary: '#ffffff', // White text for dark mode
      secondary: '#b3b3b3', // Light gray text
    },
    grey: {
      50: '#f8f9fa',
      100: '#e9ecef',
      200: '#dee2e6',
      300: '#ced4da',
      400: '#adb5bd',
      500: '#6c757d',
      600: '#495057',
      700: '#343a40',
      800: '#212529',
      900: '#000000',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    button: {
      fontSize: '1rem',
      fontWeight: 500,
      textTransform: 'none', // Remove uppercase transformation
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 12, // 0.75rem equivalent
  },
  components: {
    // Card component customization
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          padding: '1.5rem',
          minWidth: '350px', // Desktop min width
          '@media (max-width: 768px)': {
            minWidth: '100%',
            padding: '1rem',
          },
        },
      },
    },
    // Button component customization
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem',
          fontWeight: 500,
          transition: 'all 0.2s ease',
          minHeight: '44px', // Touch-friendly minimum height
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    // Typography component customization
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#ffffff',
        },
      },
    },
    // Container component customization
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '1rem',
          paddingRight: '1rem',
          '@media (min-width: 600px)': {
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
          },
        },
      },
    },
    // Chip component customization for status badges
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          fontWeight: 500,
          fontSize: '0.875rem',
        },
      },
    },
    // TextField component customization
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.5rem',
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768, // Mobile breakpoint
      lg: 1024, // Desktop breakpoint
      xl: 1200,
    },
  },
});

// Default export for backward compatibility
export const theme = lightTheme;

// Export theme type for TypeScript
export type Theme = typeof lightTheme;
