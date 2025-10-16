import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { WaitlistCardProps } from '../types';

// Color extraction interface from EventCard
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

const WaitlistCard: React.FC<WaitlistCardProps> = ({ 
  item, 
  onRemove, 
  onClaim, 
  onEdit, 
  onUnlist, 
  showActions 
}) => {
  const [colors, setColors] = useState<ExtractedColors>({
    base: "rgb(66, 62, 0)",
    primary: "rgba(66, 62, 0, 1)",
    secondary: "rgba(66, 62, 0, 0.6)",
    subtle: "rgba(0, 0, 0, 0.15)",
    vsubtle: "rgba(0, 0, 0, 0.05)",
  });

  useEffect(() => {
    if (item.eventImage) {
      extractColorsFromImage(item.eventImage)
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
  }, [item.eventImage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return { bg: '#fff3cd', color: '#000000' }; // Light yellow for OPEN
      case 'cancelled':
        return { bg: 'rgba(255,43,43,0.36)', color: '#2d3748' }; // Light red for CANCELLED
      case 'expired':
        return { bg: 'rgba(204,204,204,0.51)', color: '#2d3748' }; // Light gray for EXPIRED
      case 'filled':
        return { bg: '#d4edda', color: '#155724' }; // Light green for FILLED
      default:
        return { bg: '#e2e3e5', color: '#383d41' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'OPEN';
      case 'cancelled':
        return 'CANCELLED';
      case 'expired':
        return 'EXPIRED';
      case 'filled':
        return 'FILLED';
      default:
        return status.toUpperCase();
    }
  };

  const statusColors = getStatusColor(item.status);
  const statusLabel = getStatusLabel(item.status);

  return (
    <Box
      id={`waitlist-card-${item.id}`}
      className="waitlist-card"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        position: 'relative',
        width: { xs: '100%', md: '320px' },
        maxWidth: { xs: '280px', md: 'none' },
        height: '100%',
        boxSizing: 'border-box',
        border: `1px solid ${colors.subtle}`,
        boxShadow: `0px 0px 20px ${colors.vsubtle}`,
        backgroundColor: '#fff',
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Content Section */}
      <Box
        id={`waitlist-card-content-${item.id}`}
        className="waitlist-card-content"
        sx={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          alignItems: 'flex-start',
          p: 2,
          pb: 1,
          flexShrink: 0,
          width: '100%',
          flex: 1, // Grow to take up extra space
        }}
      >
        {/* Event Title and Details Container */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            mb: 1,
            flex: 1, // Grow to take up extra space
            gap: .5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              id={`waitlist-card-title-${item.id}`}
              className="waitlist-card-title"
              sx={{
                fontSize: '.875rem',
                fontWeight: 900,
                color: colors.primary,
                textAlign: 'left',
                width: '100%',
                textTransform: 'capitalize',
                lineHeight: 1.2,
              }}
            >
              {item.eventName}
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                color: colors.secondary,
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '-.02em',
                lineHeight: 1.3,
              }}
            >
              {item.date} • {item.time} <br />
              {item.venue}
            </Typography>
          </Box>

          <Box
            id={`waitlist-card-image-${item.id}`}
            className="waitlist-card-image"
            sx={{
              aspectRatio: '1/1',
              flex: '0 0 25%',
              maxWidth: '25%',
              backgroundColor: colors.base,
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {item.eventImage && (
              <img
                id={`waitlist-card-image-element-${item.id}`}
                className="waitlist-card-image-element"
                src={item.eventImage}
                alt={item.eventName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}
          </Box>
        </Box>

        {/* Date/Time and Venue Container */}
        <Box
          id={`waitlist-card-datetime-venue-container-${item.id}`}
          className="waitlist-card-datetime-venue-container"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            alignItems: 'stretch',
            flexShrink: 0,
            width: '100%',
            mt: 1,
            '& > *': {
              borderTop: `1px solid ${colors.subtle}`,
              pt: 1,
            },
          }}
        >
  

          {/* Ticket Type/Quantity */}
          <Box
            id={`waitlist-card-ticket-type-${item.id}`}
            className="waitlist-card-ticket-type"
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              py: 0.5,
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                color: colors.primary,
                fontWeight: 500,
                fontFamily: "'ibm plex mono', sans-serif",
                letterSpacing: '.02em',
                lineHeight: 1.5,
              }}
            >
              TICKET
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                color: colors.primary,
                fontWeight: 900,
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '-0.36px',
                lineHeight: 1.5,
                textAlign: 'right',
              }}
            >
              
                {item.quantity}x {item.ticketType}  <br /><Box sx={{ fontWeight: 500 }}> {item.totalPrice} </Box>
       
              
            </Typography>
          </Box>

          {/* Joined Date */}
          <Box
            id={`waitlist-card-joined-${item.id}`}
            className="waitlist-card-joined"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 0.5,
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                color: colors.primary,
                fontWeight: 500,
                fontFamily: "'ibm plex mono', sans-serif",
                letterSpacing: '.02em',
                lineHeight: 1.5,
              }}
            >
              JOINED ON
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                color: colors.primary,
                fontWeight: 900,
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '-0.36px',
                lineHeight: 1.5,
              }}
            >
              {item.joinedOn.split(',')[0]}
            </Typography>
          </Box>

          {/* Expiration Date or Status */}
          <Box
            id={`waitlist-card-expiration-${item.id}`}
            className="waitlist-card-expiration"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 0.5,
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                color: colors.primary,
                fontWeight: 500,
                fontFamily: "'ibm plex mono', sans-serif",
                letterSpacing: '.02em',
                lineHeight: 1.5,
              }}
            >
              EXPIRES ON
            </Typography>
            {item.status === 'expired' || item.status === 'cancelled' || item.status === 'filled' ? (
              <Box sx={{
                backgroundColor: statusColors.bg,
                color: statusColors.color,
                px: 1,
                py: 0.5,
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 'bold',
                display: 'inline-block',
                textAlign: 'center'
              }}>
                {statusLabel}
              </Box>
            ) : (
              <Typography
                sx={{
                  fontSize: '12px',
                  color: colors.primary,
                  fontWeight: 900,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '-0.36px',
                  lineHeight: 1.5,
                }}
              >
                {item.expirationDate.split(' ')[0]} {item.expirationDate.split(' ')[1]}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Image and Button Container */}
      <Box
        id={`waitlist-card-image-button-container-${item.id}`}
        className="waitlist-card-image-button-container"
        sx={{
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          width: '100%',
          borderRadius: '16px',
        }}
      >
  

        {/* Action Buttons Section */}
        <Box
          id={`waitlist-card-button-container-${item.id}`}
          className="waitlist-card-button-container"
          sx={{
            backgroundColor: colors.vsubtle,
            p: 2,
            pt: 1,
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
            // CSS mask for fade effect at top
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 100%)',
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            
          }}
        >
          {showActions === 'active' ? (
            // Active waitlist actions
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <Box
                id={`waitlist-card-leave-button-${item.id}`}
                className="waitlist-card-leave-button"
                onClick={() => onRemove?.(item.id)}
                sx={{
                borderRadius: '8px',
                border: `1px solid ${colors.subtle}`,
                backgroundColor: 'rgba(255,255,255,1)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px 12px',
                  width: '100%',
                  flex: '0 0 65%',
                  transition: 'all 200ms ease-out',
                  '&:hover': {
                    backgroundColor: 'white',
                    boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08), 0 0 10px 0 rgba(0,0,0,0.05)',
                    transform: 'translateY(-1px)',
                    '& .MuiTypography-root': {
                      color: 'oklch(0.1 0.0 0)', // Change color of Typography on hover
                    },
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: '13px',
                    color: 'oklch(0.5 0.0 0)',
                    fontWeight: 500,
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.6,
                  }}
                >
                  Leave Waitlist
                </Typography>
              </Box>
              <Box
                id={`waitlist-card-edit-button-${item.id}`}
                className="waitlist-card-edit-button"
                onClick={() => onEdit?.(item.id)}
                sx={{
                  border: `1px solid ${colors.subtle}`,
                  backgroundColor: 'rgba(255,255,255,1)',
                  borderRadius: '8px',
                  boxShadow: ' 0px 2px 4px 0px rgba(0,0,0,0)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px 12px',
                  width: '100%',
                  transition: 'all 200ms ease-out',
                  '&:hover': {
                    backgroundColor: 'white',
                    boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08), 0 0 10px 0 rgba(0,0,0,0.05)',
                    transform: 'translateY(-1px)',
                    '& .MuiTypography-root': {
                      color: 'oklch(0.1 0.0 0)', // Change color of Typography on hover
                    },
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: '13px',
                    color: 'oklch(0.5 0.0 0)',
                    fontWeight: 500,
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.6,
                  }}
                >
                  Change
                </Typography>
              </Box>
            </Box>
          ) : (
            // Listed tickets actions
            <Box
              id={`waitlist-card-unlist-button-${item.id}`}
              className="waitlist-card-unlist-button"
              onClick={() => onUnlist?.(item.id)}
              sx={{
                border: `1px solid ${colors.subtle}`,
                backgroundColor: 'rgba(255,255,255,1)',
                borderRadius: '8px',
                boxShadow: ' 0px 2px 4px 0px rgba(0,0,0,0)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 12px',
                width: '100%',
                transition: 'all 200ms ease-out',
                '&:hover': {
                  backgroundColor: 'white',
                  boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08), 0 0 10px 0 rgba(0,0,0,0.05)',
                  transform: 'translateY(-1px)',
                  '& .MuiTypography-root': {
                    color: 'oklch(0.1 0.0 0)', // Change color of Typography on hover
                  },
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: '13px',
                  color: 'oklch(0.5 0.0 0)',
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.6,
                }}
              >
                {item.status === 'filled' ? `+${item.totalPrice}` : 'Unlist'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default WaitlistCard;
