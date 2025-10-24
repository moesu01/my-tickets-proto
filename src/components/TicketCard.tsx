import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  OpenInNew as ExternalLinkIcon,
  List as ListIcon,
  PlaylistAdd,
  KeyboardDoubleArrowRight,
  IosShare,
} from '@mui/icons-material';
import { TicketCardProps } from '../types';

// SVG paths from ticket_example.tsx
const svgPaths = {
  p1c776d80: "M5.5 0L11 5.5L5.5 11L0 5.5L5.5 0Z",
  p6511720: "M0 0h160v160H0zM20 20h120v120H20zM40 40h80v80H40zM60 60h40v40H60zM80 80h0v0H80z"
};

const transferSvgPaths = {
  p32940e00: "M6 3L12 9L6 15L4.5 13.5L8.25 9.75L4.5 6L6 3Z",
  p3d41b300: "M9 3V9H15V10.5H9V16.5H7.5V10.5H1.5V9H7.5V3H9Z"
};

// Color extraction interface from ticket_example.tsx
export interface ExtractedColors {
  primary: string; // 100% alpha
  secondary: string; // 60% alpha
  subtle: string; // 15% alpha
  vsubtle: string; // 5% alpha
  base: string; // The base color with L=13
}

// Function to extract dominant color from image and adjust to HSL
const extractColorsFromImage = (
  imageUrl: string,
): Promise<ExtractedColors> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      try {
        const imageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        );
        const data = imageData.data;

        // Sample pixels and find most saturated color
        let maxSaturation = 0;
        let dominantColor = { r: 66, g: 62, b: 0 }; // fallback color

        // Sample every 10th pixel for performance
        for (let i = 0; i < data.length; i += 40) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const alpha = data[i + 3];

          if (alpha < 128) continue; // Skip transparent pixels

          const hsl = rgbToHsl(r, g, b);

          if (
            hsl.s > maxSaturation &&
            hsl.l > 0.1 &&
            hsl.l < 0.9
          ) {
            maxSaturation = hsl.s;
            dominantColor = { r, g, b };
          }
        }

        // Convert to HSL and adjust lightness to 13% and saturation to 100%
        const hsl = rgbToHsl(
          dominantColor.r,
          dominantColor.g,
          dominantColor.b,
        );
        const adjustedHsl = { ...hsl, l: 0.13, s: 1.0 };

        // Convert back to RGB for the base color
        const baseRgb = hslToRgb(
          adjustedHsl.h,
          adjustedHsl.s,
          adjustedHsl.l,
        );

        const colors: ExtractedColors = {
          base: `rgb(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b})`,
          primary: `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 1)`,
          secondary: `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 0.6)`,
          subtle: `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 0.15)`,
          vsubtle: `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 0.08)`,
        };

        resolve(colors);
      } catch (error) {
        // Fallback to default colors if extraction fails
        resolve({
          base: "rgb(66, 62, 0)",
          primary: "rgba(66, 62, 0, 1)",
          secondary: "rgba(66, 62, 0, 0.6)",
          subtle: "rgba(0, 0, 0, 0.1)",
          vsubtle: "rgba(0, 0, 0, 0.05)",
        });
      }
    };

    img.onerror = () => {
      // Fallback to default colors
      resolve({
        base: "rgb(66, 62, 0)",
        primary: "rgba(66, 62, 0, 1)",
        secondary: "rgba(66, 62, 0, 0.6)",
        subtle: "rgba(0, 0, 0, 0.1)",
        vsubtle: "rgba(0, 0, 0, 0.05)",
      });
    };

    img.src = imageUrl;
  });
};

// Helper function to convert RGB color string to HSL and get hue rotation
const getHueRotation = (rgbColor: string): number => {
  // Extract RGB values from "rgb(r, g, b)" or "rgba(r, g, b, a)" format
  const match = rgbColor.match(/(\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return 0;
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  
  // Convert RGB to HSL
  const hsl = rgbToHsl(r, g, b);
  
  // Return hue in degrees (0-360)
  return Math.round(hsl.h * 360);
};

// Helper functions for color conversion
const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h, s, l };
};

const hslToRgb = (h: number, s: number, l: number) => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onTransfer,
  onWaitlist,
  onReceipt,
  onRemoveFromWaitlist,
}) => {
  const [colors, setColors] = useState<ExtractedColors>({
    base: "rgb(66, 62, 0)",
    primary: "rgba(66, 62, 0, 1)",
    secondary: "rgba(66, 62, 0, 0.6)",
    subtle: "rgba(0, 0, 0, 0.15)",
    vsubtle: "rgba(0, 0, 0, 0.05)",
  });
  const [removeModalOpen, setRemoveModalOpen] = useState(false);

  useEffect(() => {
    if (ticket.eventImage) {
      extractColorsFromImage(ticket.eventImage)
        .then((extractedColors) => {
          setColors(extractedColors);
        })
        .catch(console.error);
    } else {
      // Reset to default colors when no image
      const defaultColors = {
        base: "rgb(66, 62, 0)",
        primary: "rgba(66, 62, 0, 1)",
        secondary: "rgba(66, 62, 0, 0.6)",
        subtle: "rgba(0, 0, 0, 0.1)",
        vsubtle: "rgba(0, 0, 0, 0.05)",
      };
      setColors(defaultColors);
    }
  }, [ticket.eventImage]);

  const handleTransfer = () => {
    onTransfer?.(ticket.ticketId);
  };

  const handleWaitlist = () => {
    onWaitlist?.(ticket.ticketId);
  };

  const handleReceipt = () => {
    onReceipt?.(ticket.ticketId);
  };

  const handleRemoveFromWaitlist = () => {
    setRemoveModalOpen(true);
  };

  const handleConfirmRemove = () => {
    onRemoveFromWaitlist?.(ticket.ticketId);
    setRemoveModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    
    // Set event time to end of day (23:59:59) to ensure events scheduled for "today" 
    // are considered upcoming until the day is over
    date.setHours(23, 59, 59, 999);
    // Reset today to start of day for accurate day comparison
    today.setHours(0, 0, 0, 0);
    
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    // Always return the formatted date structure
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Always show relative time with appropriate units
    let relativeTime = '';
    if (diffDays === 0) relativeTime = 'Today';
    else if (diffDays === 1) relativeTime = 'Tomorrow';
    else if (diffDays < 7) relativeTime = `In ${diffDays} days`;
    else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      const remainingDays = diffDays % 7;
      if (remainingDays === 0) {
        relativeTime = weeks === 1 ? 'In 1 week' : `In ${weeks} weeks`;
      } else {
        relativeTime = `In ${weeks} week${weeks > 1 ? 's' : ''} ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
      }
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      if (remainingDays < 7) {
        relativeTime = months === 1 ? 'In 1 month' : `In ${months} months`;
      } else {
        const weeks = Math.floor(remainingDays / 7);
        relativeTime = `In ${months} month${months > 1 ? 's' : ''} ${weeks} week${weeks > 1 ? 's' : ''}`;
      }
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingDays = diffDays % 365;
      if (remainingDays < 30) {
        relativeTime = years === 1 ? 'In 1 year' : `In ${years} years`;
      } else {
        const months = Math.floor(remainingDays / 30);
        relativeTime = `In ${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
      }
    }
    
    // Handle past dates
    if (diffDays < 0) {
      const absDays = Math.abs(diffDays);
      if (absDays === 1) relativeTime = '1 day ago';
      else if (absDays < 7) relativeTime = `${absDays} days ago`;
      else if (absDays < 30) {
        const weeks = Math.floor(absDays / 7);
        relativeTime = weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
      } else if (absDays < 365) {
        const months = Math.floor(absDays / 30);
        relativeTime = months === 1 ? '1 month ago' : `${months} months ago`;
      } else {
        const years = Math.floor(absDays / 365);
        relativeTime = years === 1 ? '1 year ago' : `${years} years ago`;
      }
    }
    
    return {
      relativeTime: relativeTime,
      actualDayOfWeek: days[date.getDay()], // Always include the actual day of week
      month: months[date.getMonth()],
      day: date.getDate().toString().padStart(2, '0'),
      year: date.getFullYear().toString().slice(-2)
    };
  };

  const formatTime = (timeString: string) => {
    // Extract start time and period from various formats
    let startTime = timeString;
    let period = '';
    
    // Handle range format "6:00 → 10:00PM" or "6:00PM → 10:00PM"
    if (timeString.includes(' → ')) {
      const parts = timeString.split(' → ');
      startTime = parts[0];
      // Extract period from end time if start time doesn't have it
      const endTimeMatch = parts[1].match(/(\d{1,2}):(\d{2})(AM|PM)/i);
      if (endTimeMatch) {
        period = endTimeMatch[3].toUpperCase();
      }
    }
    
    // Handle single time format "6:00PM"
    if (!timeString.includes(' → ')) {
      startTime = timeString;
    }
    
    // Extract time and period from start time
    const timeMatch = startTime.match(/(\d{1,2}):(\d{2})(AM|PM)/i);
    if (timeMatch) {
      let [, hours, minutes, startPeriod] = timeMatch;
      period = startPeriod.toUpperCase();
      
      let doorHours = parseInt(hours);
      
      // Subtract 1 hour
      doorHours -= 1;
      
      // Handle hour rollover
      if (doorHours <= 0) {
        doorHours += 12;
        period = period === 'AM' ? 'PM' : 'AM';
      }
      
      const doorTime = `${doorHours}:${minutes} ${period}`;
      const showTime = `${hours}:${minutes} ${startPeriod.toUpperCase()}`;
      
      return {
        doorsTime: doorTime,
        showTime: showTime
      };
    }
    
    // Handle case where start time doesn't have period but we extracted it from end time
    if (period) {
      const timeMatch = startTime.match(/(\d{1,2}):(\d{2})/);
      if (timeMatch) {
        let [, hours, minutes] = timeMatch;
        let doorHours = parseInt(hours);
        
        // Subtract 1 hour
        doorHours -= 1;
        
        // Handle hour rollover
        if (doorHours <= 0) {
          doorHours += 12;
          period = period === 'AM' ? 'PM' : 'AM';
        }
        
        const doorTime = `${doorHours}:${minutes} ${period}`;
        const showTime = `${hours}:${minutes} ${period}`;
        
        return {
          doorsTime: doorTime,
          showTime: showTime
        };
      }
    }
    
    // Fallback if parsing fails
    return {
      doorsTime: startTime,
      showTime: startTime
    };
  };

  // Generate dynamic shadow styles
  const dropShadowStyle = {
    boxShadow: `0px 4px 16px -4px ${colors.secondary.replace('.6)', '0.25)')}`,
  };

  const innerShadowStyle = {
    boxShadow: `0px 0px 37.6px 0px inset #f0f0f0`,
    opacity: 1,
  };

  return (
    <Box
      className="ticket-card"
      sx={{
        width: '350px',
        maxWidth: { xs: '300px', md: '350px' },
        height: '100%',
        
        flexShrink: 0,
        borderRadius: '16px',
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        // Individual section shadows instead of mask
      }}
    >
      {/* Combined top and middle section */}
      <Box
        className="combined-ticket-section"
        sx={{
          borderRadius: '4px 4px 16px 16px', // Using top section's border radius
          backgroundColor: '#ffffff',
          ...innerShadowStyle,
          ...dropShadowStyle,
          overflow: 'hidden',
          position: 'relative',
          flex: 1, // Grow to fill available space

          // Background image and blur applied via pseudo-element
          ...(ticket.eventImage && {
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url('${ticket.eventImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'blur(25px)',
              opacity: 0.12,
              borderRadius: '10px',
              zIndex: 0,
            }
          }),
          // Border
          border: `1px solid ${colors.subtle}`,
          borderBottom: `1.5px dotted ${colors.subtle.replace('.15)', '0.2)')}`,
          // Content layout
          display: 'flex',
          flexDirection: 'column',
          padding: '12px',
          '& > *': {
            position: 'relative',
            zIndex: 1,
          }
        }}
      >
        {/* Title section */}
        <Box
          className="title-section"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'stretch',


          }}
        >
          <Box className="title-content" sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: colors.primary,
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.25,
                mb: 0.5,
              }}
            >
              {ticket.eventSeries}
            </Typography>
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 700,
                color: colors.primary,
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.2,
                textTransform: 'capitalize',
              }}
            >
              {ticket.eventName}
            </Typography>
          </Box>
        </Box>

        {/* Details section */}
        <Box 
          className="details-section" 
          sx={{ 
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            '& > *': {
              borderTop: `1px solid ${colors.subtle}`,
              pt: 1,
            },
          }}
        >
          {/* Venue */}
          <Box
            className="venue-row"
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              flexDirection: 'column',
              justifyContent: 'space-between',
              pt: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                color: colors.primary,
                fontWeight: 500,
                fontFamily: "'ibm plex mono', sans-serif",
                letterSpacing: '.05em',
                lineHeight: 1,
                mb: 0.5,
              }}
            >
              VENUE
            </Typography>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center',justifyContent: 'space-between', gap: 0.75 }}>
              <Typography
                sx={{
                 fontSize: '13px',
                  color: colors.primary,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '-3%',
                  lineHeight: 1.3,
                }}
              >
                {ticket.venue}
              </Typography>
              <Typography
                sx={{
                  fontSize: '13px',
                  color: colors.primary,
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '-0.36px',
                  lineHeight: 1.3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                {ticket.location}
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const address = `${ticket.venue}, ${ticket.location}`;
                    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
                    window.open(mapsUrl, '_blank');
                  }}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.7,
                    },
                  }}
                >
                  <ExternalLinkIcon sx={{ fontSize: '13px', color: colors.secondary }} />
                </Link>

              </Typography>
            </Box>
          </Box>

          {/* Ticket type */}
          <Box
            className="ticket-type-row"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              pt: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                color: colors.primary,
                fontWeight: 500,
                fontFamily: "'ibm plex mono', sans-serif",
                letterSpacing: '.05em',
                lineHeight: 1,
                mb: 0.5,
              }}
            >
              TICKET
            </Typography>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.75 }}>
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent:'space-between', gap: 0.75 }}>
    
                <Typography
                  sx={{
                    fontSize: '13px',
                    color: colors.primary,
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: '-3%',
                    lineHeight: 1.3,
                  }}
                >
                  {ticket.ticketType}
                </Typography>
                <Box
                  sx={{
                    backgroundColor: 'transparent',
                    borderRadius: '16px',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: colors.primary,
                      fontWeight: 500,
                      fontFamily: "'ibm plex mono', sans-serif",
                      lineHeight: 1,
                    }}
                  >
                    1x
                  </Typography>
                </Box>
              </Box>
              
            </Box>
          </Box>
        </Box>

        {/* Extended details section */}
        <Box
          className="extended-details-section"
          sx={{
            display: 'flex',
            gap: 1.5,
            mt: 2,
            flex: 1,
          }}
        >
          {/* Left section - Details */}


          
          <Box
            className="ticket-info-section"
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              // height: '100%',
              gap: 2,
              '& > *': {
                borderTop: `1px solid ${colors.subtle}`,
                pt: 1,
              },
            }}
          >
            
            {/* Date Group */}
            <Box className="date-group">
              <Typography
                sx={{
                  fontSize: '12px',
                  color: colors.primary,
                  fontWeight: 500,
                  fontFamily: "'ibm plex mono', sans-serif",
                  letterSpacing: '.05em',
                  lineHeight: 1,
                  mb: 0.5,
                }}
              >
                DATE
              </Typography>
              <Typography
                sx={{
                  fontSize: '13px',
                  color: colors.primary,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '-3%',
                  lineHeight: 1.3,
                }}
              >
                {(() => {
                  const formatted = formatDate(ticket.date);
                  
                  return (
                    <>
                      <span style={{ fontWeight: 600 }}>
                        {formatted.relativeTime}
                      </span>
                      <br />
                      <span style={{ fontWeight: 600, textTransform: 'uppercase' }}>
                        {formatted.actualDayOfWeek} • {formatted.month} {formatted.day}
                      </span>
                    </>
                  );
                })()}
              </Typography>
            </Box>

            {/* Time Group */}
            <Box className="time-group">
              <Typography
                sx={{
                  fontSize: '12px',
                  color: colors.primary,
                  fontWeight: 500,
                  fontFamily: "'ibm plex mono', sans-serif",
                  letterSpacing: '.05em',
                  lineHeight: 1,
                  mb: 0.5,
                }}
              >
                TIME
              </Typography>
              <Typography
                sx={{
                  fontSize: '13px',
                  color: colors.primary,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '-0.36px',
                  lineHeight: 1,
                }}
              >
                {/* Doors {formatTime(ticket.time).doorsTime}<br /> */}
                {formatTime(ticket.time).showTime}
              </Typography>
            </Box>

            {/* Receipt and Share Links Group */}
            <Box className="links-group" sx={{ borderTop: 'none' }}>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5,}}>
                {/* <Link
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleReceipt(); }}
                  sx={{
                    fontSize: '13px',
                    color: colors.primary,
                    textDecoration: 'underline',
                    fontWeight: 400,
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.25,
                  }}
                >
                  Receipt
                </Link> */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      p: 1,
                      border: `1px solid ${colors.subtle}`,
                      borderRadius: '8px',
                      transition: 'background 0.15s',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#fff',
                      },
                    }}
                  >
                    <Link
                      href="#"
                      sx={{
                        fontSize: '13px',
                        color: colors.primary,
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontFamily: "'Inter', sans-serif",
                        lineHeight: 1.25,
                      }}
                    >
                      Share 
                    </Link>
                    <IosShare sx={{ fontSize: '14px', color: colors.secondary }} />
                  </Box>
              </Box>
            </Box>

            {/* Admit Group */}
            {/* <Box className="admit-group">
              <Typography
                sx={{
                  fontSize: '13px',
                  color: colors.primary,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '-0.36px',
                  lineHeight: 1.2,
                }}
              >
                Admit {ticket.admitCount}
              </Typography>
            </Box> */}

       
          </Box>

          {/* Right section - QR Code or Waitlisted Text */}
          <Box
            className="qr-code-section"
            sx={{
              flex: 1.5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '10px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.05)',
              borderRadius: '8px',
            }}
          >
            {ticket.status === 'waitlisted' ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: 1
              }}>
                <ListIcon 
                  sx={{ 
                    fontSize: '24px', 
                    color: colors.primary,
                    opacity: 0.7
                  }} 
                />
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: colors.primary,
                    fontFamily: "'Inter', sans-serif",
                    textAlign: 'center',
                    lineHeight: 1.3,
                  }}
                >
                  This ticket is<br/>listed for sale
                </Typography>
              </Box>
            ) : (
              <img 
                src={`${process.env.PUBLIC_URL}/design/kyd_qr.svg`} 
                alt="QR Code" 
                style={{ 
                  maxWidth: '150px',
                  maxHeight: '150px',
                  width: 'auto',
                  height: 'auto',
                  filter: `hue-rotate(${getHueRotation(colors.primary)}deg) brightness(1.4) saturate(1.5)`
                }}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* Bottom section with transfer/waitlist buttons */}
      <Box
        className="bottom-section"
        onClick={(e) => {
          // Handle clicks on the container, delegate to specific buttons
          const target = e.target as HTMLElement;
          if (target.closest('.transfer-button')) {
            handleTransfer();
          } else if (target.closest('.waitlist-button')) {
            handleWaitlist();
          } else if (target.closest('.remove-waitlist-button')) {
            handleRemoveFromWaitlist();
          }
        }}
        sx={{
          height: 70,
          borderRadius: '16px 16px 4px 4px',
          backgroundColor: '#f0f0f0',
          ...innerShadowStyle,
          ...dropShadowStyle,
          overflow: 'hidden',
          position: 'relative',
          // Background image and blur applied via pseudo-element
          ...(ticket.eventImage && {
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url('${ticket.eventImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: '0 120%',
              backgroundRepeat: 'no-repeat',
              filter: 'blur(25px)',
              opacity: 0.15,
              zIndex: 0,
            }
          }),
          // Border - left, right, bottom only
          borderLeft: `1px solid ${colors.vsubtle}`,
          borderRight: `1px solid ${colors.vsubtle}`,
          borderBottom: `1px solid ${colors.vsubtle}`,
          borderTop: 'none',
          // Content layout
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          gap: 0.75,
          '& > *': {
            position: 'relative',
            zIndex: 1,
          }
        }}
      >
        {ticket.status === 'waitlisted' ? (
          /* Remove from waitlist button - single button for waitlisted tickets */
          <Box
            className="remove-waitlist-button"
            sx={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 12px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                color: '#e53e3e',
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.6,
              }}
            >
              Remove from waitlist
            </Typography>
          </Box>
        ) : (
          <>
            {/* Transfer button */}
            <Box
              className="transfer-button"
              sx={{
                flex: 1,
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: '12px',
                  color: '#333333',
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.6,
                }}
              >
                Transfer ticket
              </Typography>
              <Box sx={{ width: 20, height: 20 }}>
                <KeyboardDoubleArrowRight 
                  sx={{ 
                    width: 20, 
                    height: 20, 
                    color: 'rgba(0, 0, 0, 0.39)' 
                  }} 
                />
              </Box>
            </Box>

            {/* Waitlist button */}
            <Box
              className="waitlist-button"
              sx={{
                flex: 1,
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: '12px',
                  color: '#333333',
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.6,
                }}
              >
                List my ticket
              </Typography>
              <Box sx={{ width: 20, height: 20 }}>
                <PlaylistAdd 
                  sx={{ 
                    width:20, 
                    height: 20, 
                    color: 'rgba(0, 0, 0, 0.39)' 
                  }} 
                />
              </Box>
            </Box>
          </>
        )}
      </Box>

      {/* Remove from waitlist modal */}
      <Dialog
        open={removeModalOpen}
        onClose={() => setRemoveModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '24px',
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#2d3748',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Remove from Waitlist
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pb: 3 }}>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1rem',
              lineHeight: 1.5,
              color: '#4a5568',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            This ticket is on the waitlist and you will be refunded the price when it is sold. 
            Are you sure you want to remove this from the waitlist?
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ gap: 2, pt: 2 }}>
          <Button
            onClick={() => setRemoveModalOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              borderColor: '#e2e8f0',
              color: '#4a5568',
              '&:hover': {
                borderColor: '#cbd5e0',
                backgroundColor: '#f7fafc',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRemove}
            variant="contained"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              backgroundColor: '#e53e3e',
              '&:hover': {
                backgroundColor: '#c53030',
              },
            }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default TicketCard;