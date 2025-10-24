import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';

interface ThemeDataToggleProps {
  isDarkMode: boolean;
  dataMode: 'full' | 'minimal' | 'empty';
  onThemeToggle: () => void;
  onDataToggle: () => void;
}

const ThemeDataToggle: React.FC<ThemeDataToggleProps> = ({
  isDarkMode,
  dataMode,
  onThemeToggle,
  onDataToggle,
}) => {
  // Get display text and tooltip based on data mode
  const getDataModeDisplay = () => {
    switch (dataMode) {
      case 'full':
        return { text: '∞', tooltip: 'Switch to Minimal Data' };
      case 'minimal':
        return { text: '1', tooltip: 'Switch to Empty Data' };
      case 'empty':
        return { text: '0', tooltip: 'Switch to Full Data' };
      default:
        return { text: '∞', tooltip: 'Switch to Minimal Data' };
    }
  };

  const dataModeDisplay = getDataModeDisplay();
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        padding: '4px',
        boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Theme Toggle */}
      <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} placement="left">
        <IconButton
          onClick={onThemeToggle}
          sx={{
            width: 40,
            height: 40,
            borderRadius: '20px',
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
            border: isDarkMode ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
            boxShadow: isDarkMode ? '0px 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 0.05)',
              boxShadow: isDarkMode ? '0px 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {isDarkMode ? <DarkMode sx={{ fontSize: 20 }} /> : <LightMode sx={{ fontSize: 20 }} />}
        </IconButton>
      </Tooltip>

      {/* Data Toggle */}
      <Tooltip title={dataModeDisplay.tooltip} placement="left">
        <IconButton
          onClick={onDataToggle}
          sx={{
            width: 40,
            height: 40,
            borderRadius: '20px',
            backgroundColor: dataMode !== 'full' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
            border: dataMode !== 'full' ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
            boxShadow: dataMode !== 'full' ? '0px 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
            color: 'text.secondary',
            fontSize: '18px',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: dataMode !== 'full' ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 0.05)',
              boxShadow: dataMode !== 'full' ? '0px 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {dataModeDisplay.text}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ThemeDataToggle;
