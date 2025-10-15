import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowOutward } from '@mui/icons-material';
import { EventCardProps } from '../types';

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

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [colors, setColors] = useState<ExtractedColors>({
    base: "rgb(66, 62, 0)",
    primary: "rgba(66, 62, 0, 1)",
    secondary: "rgba(66, 62, 0, 0.6)",
    subtle: "rgba(0, 0, 0, 0.15)",
    vsubtle: "rgba(0, 0, 0, 0.05)",
  });

  useEffect(() => {
    if (event.image) {
      extractColorsFromImage(event.image)
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
  }, [event.image]);

  // Generate dynamic shadow styles using extracted colors
  const dropShadowStyle = {
    boxShadow: `0px 0px 20px ${colors.vsubtle}`,
  };

  return (
    <Box
      id={`event-card-${event.id}`}
      className="event-card"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        position: 'relative',
        width: '240px',
        height: '100%',
        boxSizing: 'border-box',
        boxShadow: `inset 0 0 0 1px ${colors.subtle}, 0px 0px 20px ${colors.vsubtle}`,
        backgroundColor: '#fff',
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 200ms ease-out',
        willChange: 'transform, opacity, background-color, box-shadow',
        '&:hover': {
          boxShadow: `inset 0 0 0 1px ${colors.subtle}, 0px 0px 20px -8px ${colors.secondary}`,
        },
        '&:hover .event-card-button': {
          backgroundColor: 'rgba(0, 0, 0, .85)',
          border: `1px solid rgba(255, 255, 255, 0.25)`,
          paddingX: '16px',
          boxShadow: '0px 6px 16px 0px rgba(0,0,0,0.2), 0px 3px 6px 0px rgba(0,0,0,0.15)',
          transform: 'translateY(-1px)',
        },
        '&:hover .event-card-button .MuiSvgIcon-root': {
          transform: 'rotate(45deg)',
        },
      }}
    >
      {/* Content Section */}
      <Box
        id={`event-card-content-${event.id}`}
        className="event-card-content"
        sx={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          alignItems: 'flex-start',
          p:1.5,
          pb:1,
          flexShrink: 0,
          width: '100%',
          
          flex: 1, // Grow to take up extra space
        }}
      >
    

        {/* Event Title */}
        <Typography
          id={`event-card-title-${event.id}`}
          className="event-card-title"
          sx={{
            fontSize: '.875rem',
            fontWeight: 900,
            color: colors.primary,
            textAlign: 'left',
            width: '100%',
            textTransform: 'capitalize',
            lineHeight: 1.2,
            flex: 1, // Grow to take up extra space
          }}
        >
          {event.title}
        </Typography>

        {/* Date/Time and Venue Container */}
        <Box
          id={`event-card-datetime-venue-container-${event.id}`}
          className="event-card-datetime-venue-container"
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
          {/* Date/Time */}
          <Box
            id={`event-card-datetime-${event.id}`}
            className="event-card-datetime"
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
                color: colors.secondary,
                fontWeight: 500,
                fontFamily: "'ibm plex mono', sans-serif",
                letterSpacing: '.05em',
                lineHeight: 1,
              }}
            >
              DATE
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                color: colors.secondary,
                fontWeight: 900,
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '-0.36px',
                lineHeight: 1,
              }}
            >
              {event.date} • {event.time}
            </Typography>
          </Box>

          {/* Venue */}
          <Box
            id={`event-card-venue-${event.id}`}
            className="event-card-venue"
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
                color: colors.secondary,
                fontWeight: 500,
                fontFamily: "'ibm plex mono', sans-serif",
                letterSpacing: '.05em',
                lineHeight: 1,
              }}
            >
              VENUE
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                color: colors.secondary,
                fontWeight: 900,
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '-0.36px',
                lineHeight: 1,
              }}
            >
              {event.venue}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Image and Button Container */}
      <Box
        id={`event-card-image-button-container-${event.id}`}
        className="event-card-image-button-container"
        sx={{
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          width: '100%',
          borderRadius: '16px',
          // mb:'-5px', /* because of weird extra gap at bottom of container */
        }}
      >
        {/* Image Section */}
        <Box
          id={`event-card-image-${event.id}`}
          className="event-card-image"
          sx={{
            aspectRatio: '1/1',
            position: 'relative',
            flexShrink: 0,
            width: '100%',
            overflow: 'hidden',
            backgroundColor: colors.base,

          }}
        >
          <img
            id={`event-card-image-element-${event.id}`}
            className="event-card-image-element"
            src={event.image}
            alt={event.title}
            style={{
              position: 'absolute',
              inset: 0,
              maxWidth: 'none',
              objectFit: 'cover',
              objectPosition: '50% 50%',
              pointerEvents: 'none',
              width: '100%',
              height: '100%',
                          // CSS mask for fade effect at bottom
            maskImage: 'linear-gradient(to bottom, black 0%, black 65%, transparent 98%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 65%, transparent 98%)',
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            }}
          />
        </Box>

        {/* Get Tickets Button */}
        <Box
          id={`event-card-button-container-${event.id}`}
          className="event-card-button-container"
          sx={{
            backgroundColor: colors.base,
            p: 2,
            pt:1,
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
          }}
        >
          <Box
            id={`event-card-button-${event.id}`}
            className="event-card-button"
            onClick={event.onGetTickets}
            sx={{
              border: `1px solid rgba(255, 255, 255, 0.25)`,
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: '8px',
              boxShadow: '0px 4px 12px 0px rgba(0,0,0,.25), 0px 2px 4px 0px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              width: '100%',
              transition: 'all 200ms ease-out',
            }}
          >
            <Typography
              sx={{
                fontSize: '13px',
                color: '#ffffff',
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.6,
              }}
            >
              Get Tickets 
            </Typography>
            <ArrowOutward 
              sx={{
                fontSize: '20px',
                color: 'rgba(255, 255, 255, 0.75)',
                ml: 1,
                transition: 'transform 0.2s ease-out',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EventCard;
