import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Collapse,
} from '@mui/material';
import {
  KeyboardArrowDown as ExpandMoreIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import CarouselIndicators from './CarouselIndicators';
import { WaitlistItem } from '../types';
import WaitlistCard from './WaitlistCard';

interface WaitlistCollapsibleHeaderProps {
  icon: React.ReactElement;
  title: string;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
  classNamePrefix: string;
  colors: any;
  children: React.ReactNode;
  itemCount: number;
  items: WaitlistItem[];
  onRemove?: (itemId: number) => void;
  onEdit?: (itemId: number) => void;
  onUnlist?: (itemId: number) => void;
  showActions: 'active' | 'listed';
}

const WaitlistCollapsibleHeader: React.FC<WaitlistCollapsibleHeaderProps> = ({
  icon,
  title,
  count,
  isExpanded,
  onToggle,
  classNamePrefix,
  colors,
  children,
  itemCount,
  items,
  onRemove,
  onEdit,
  onUnlist,
  showActions,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Handle scroll events for tracking active card
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const children = Array.from(container.children) as HTMLElement[];
      if (children.length > 0) {
        const cardWidth = children[0].offsetWidth || 1;
        const gap = 16; // Approximate gap between cards
        const scrollPadding = 16; // scrollPaddingLeft value
        const adjustedScrollLeft = container.scrollLeft + scrollPadding;
        const currentIndex = Math.round(adjustedScrollLeft / (cardWidth + gap));
        setActiveCardIndex(Math.min(children.length - 1, Math.max(0, currentIndex)));
      }
    };

    container.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [itemCount]);
  return (
    <Box 
      className={`${classNamePrefix}-header-container`}
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
      }}
    >
      {/* Main content area with title and collapsible cards */}
      <Box
        className={`${classNamePrefix}-content`}
        sx={{
          borderBottom: `1px solid ${colors.borderLight}`,
          py: 1,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: {
            xs: 'center',
            md: 'flex-start'
          }
        }}
      >
        {/* 
          Title row with icon, title, and count
          HOVER EFFECTS: When hovering over this entire row:
          - Icon rotates 21.5 degrees
          - Chevron button gets its hover effects (white background, shadow, lift, text color change)
          - This triggers the "view all" button hover state when hovering anywhere on the title row
        */}
        <Box 
          className={`${classNamePrefix}-title-row`}
          onClick={onToggle}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            width: '100%',
            cursor: 'pointer',
            px: { xs: 2, md: 0 },
            transition: 'padding 200ms ease-out',
            '&:hover': {
              px: { xs: 2, md: 1 },
              [`& .${classNamePrefix}-icon-svg`]: {
                transform: 'rotate(21.5deg)',
              },
              [`& .${classNamePrefix}-chevron`]: {
                backgroundColor: 'white',
                boxShadow: { xs: 'none', md: '0px 1px 3px 0px rgba(0,0,0,0.08), 0 0 10px 0 rgba(0,0,0,0.05)' },
                transform: 'translateY(-1px)',
                '& .MuiTypography-root': {
                  color: 'oklch(0.1 0.0 0)',
                },
              }
            }
          }}
        >
          <Typography 
            className={`${classNamePrefix}-title`}
            variant="h5" 
            component="h2" 
            sx={{ 
              fontWeight: 600,
              fontSize: '24px',
              color: colors.primaryText,
              letterSpacing: '-.0325em',
              lineHeight: '1.1',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textTransform: 'capitalize'
            }}
          >
            <Box
              className={`${classNamePrefix}-icon`}
              sx={{ 
                fontSize: '24px', 
                transition: 'transform 200ms ease-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#1976d2',
                color: 'white',
                borderRadius: '100px',
                height: '34px',
                padding: '0 14px 0 10px',
                gap: 1,
              }}
            >
              <Box className={`${classNamePrefix}-icon-svg`} sx={{ transition: 'transform 200ms ease-out',display:'flex', alignItems:'center', justifyContent:'center' }}>
                {icon}
              </Box>
              <Typography
                sx={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'white',
                  lineHeight: 1,
                }}
              >
                {count}
              </Typography>
            </Box>
            {title}
          </Typography>

          {/* 
            Chevron button - positioned outside content to avoid collapse animation issues
            INDIVIDUAL HOVER EFFECTS: When hovering directly on this button:
            - Background changes to white with subtle shadow and lift effect
            - Text color changes to darker shade
            - These same effects are also triggered when hovering over the parent title row
          */}
          <Box 
            className={`${classNamePrefix}-chevron`}
            sx={{ 
              borderRadius: '16px',
              border: { xs: 'none', md: `1px solid ${colors.borderLight}` },
              backgroundColor: 'colors.background.paper',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: { xs: '8px 0px', md: '8px 7px 8px 7px' },
              gap: 0.5,
              transition: 'all 200ms ease-out',
            }}
          >
            <Typography variant="body2" sx={{                     
              fontSize: '13px',
              color: colors.primaryText,
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.6,
              display: { xs: 'none', md: 'block' }
            }}>
              {isExpanded ? 'Close' : 'View all'}
            </Typography>
            {isExpanded ? <CloseIcon sx={{ fontSize: '20px', color: colors.primaryText }} /> : <ExpandMoreIcon sx={{ color: colors.primaryText }} />}
          </Box>
        </Box>

        {/* Collapsible cards section */}
        <Collapse 
          className={`${classNamePrefix}-cards-collapse`}
          in={isExpanded} 
          timeout={200} 
          easing="ease-out" 
          unmountOnExit
          sx={{
            width: '100%',
          }}
        >
          {/* Event List Container */}
          <Box 
            className={`${classNamePrefix}-list-container`}
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            {items.map((item, index) => (
              <Box
                key={item.id}
                className={`${classNamePrefix}-list-item`}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  px: { xs: 2, md: 0 },
                  py: {xs:2, md:3},
                  borderBottom: index < items.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
                  gap: {xs:2, md:2},
                }}
              >
                {/* Main Row: Image + Details + Desktop Buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 2,
                    px: {xs:0, md:2},
                  }}
                >
     
                  {/* Event Details */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flex: 1,
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: {xs:'.875rem', md:'1rem'},
                        color: colors.secondaryText,
                        opacity: 0.85,
                        fontFamily: "'Inter', sans-serif",
                        letterSpacing: '-.02em',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.date} 
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: {xs:'.875rem', md:'1.125rem'},
                        fontWeight: 600,
                        color: colors.primaryText,
                        textAlign: 'left',
                        textTransform: 'capitalize',
                        lineHeight: 1.2,
                      }}
                    >
                      {item.eventName}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: {xs:'.875rem', md:'1rem'},
                        color: colors.secondaryText,
                        opacity: 0.85,
                        fontFamily: "'Inter', sans-serif",
                        letterSpacing: '-.02em',
                        lineHeight: 1.3,
                        fontWeight: 500,
                      }}
                    >
                    <span style={{ fontWeight: 500 }}> {item.totalPrice}  •  Expiring: {item.expirationDate.split(' ')[0]} {item.expirationDate.split(' ')[1]}{item.expirationDate.split(' ')[2]}</span> 
                      {/* {item.expirationDate.split(' ')[0]} {item.expirationDate.split(' ')[1]}   */}
                    </Typography>

                    {/* Action Buttons - Desktop: Moved here after expiring date */}
                    <Box 
                      sx={{ 
                        display: { xs: 'none', md: 'flex' },
                        flexDirection: 'row',
                        gap: 1,
                        alignItems: 'stretch',
                        mt: 1,
                      }}
                    >
                      {showActions === 'active' ? (
                        <>
                          {/* Leave Waitlist Button */}
                          <Box 
                            className={`${classNamePrefix}-leave-button`}
                            onClick={() => onRemove?.(item.id)}
                            sx={{ 
                              borderRadius: '16px',
                              border: `1px solid ${colors.borderLight}`,
                              backgroundColor: 'colors.background.paper',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '8px 12px',
                              transition: 'all 200ms ease-out',
                              '&:hover': {
                                backgroundColor: 'white',
                                boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08), 0 0 10px 0 rgba(0,0,0,0.05)',
                                transform: 'translateY(-1px)',
                                '& .MuiTypography-root': {
                                  color: 'oklch(0.1 0.0 0)',
                                },
                              }
                            }}
                          >
                            <Typography variant="body2" sx={{                     
                              fontSize: '13px',
                              color: colors.primaryText,
                              fontWeight: 500,
                              fontFamily: "'Inter', sans-serif",
                              lineHeight: 1.6,
                            }}>
                              Leave Waitlist
                            </Typography>
                          </Box>
                          
                          {/* Change Button */}
                          <Box 
                            className={`${classNamePrefix}-change-button`}
                            onClick={() => onEdit?.(item.id)}
                            sx={{ 
                              borderRadius: '16px',
                              border: `1px solid ${colors.borderLight}`,
                              backgroundColor: 'colors.background.paper',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '8px 12px',
                              transition: 'all 200ms ease-out',
                              '&:hover': {
                                backgroundColor: 'white',
                                boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08), 0 0 10px 0 rgba(0,0,0,0.05)',
                                transform: 'translateY(-1px)',
                                '& .MuiTypography-root': {
                                  color: 'oklch(0.1 0.0 0)',
                                },
                              }
                            }}
                          >
                            <Typography variant="body2" sx={{                     
                              fontSize: '13px',
                              color: colors.primaryText,
                              fontWeight: 500,
                              fontFamily: "'Inter', sans-serif",
                              lineHeight: 1.6,
                            }}>
                              Change
                            </Typography>
                          </Box>
                        </>
                      ) : (
                        /* Unlist Button for Listed Tickets */
                        <Box 
                          className={`${classNamePrefix}-unlist-button`}
                          onClick={() => onUnlist?.(item.id)}
                          sx={{ 
                            borderRadius: '16px',
                            border: `1px solid ${colors.borderLight}`,
                            backgroundColor: 'colors.background.paper',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px 7px',
                            transition: 'all 200ms ease-out',
                            '&:hover': {
                              backgroundColor: 'white',
                              boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08), 0 0 10px 0 rgba(0,0,0,0.05)',
                              transform: 'translateY(-1px)',
                              '& .MuiTypography-root': {
                                color: 'oklch(0.1 0.0 0)',
                              },
                            }
                          }}
                        >
                          <Typography variant="body2" sx={{                     
                            fontSize: '13px',
                            color: colors.primaryText,
                            fontWeight: 500,
                            fontFamily: "'Inter', sans-serif",
                            lineHeight: 1.6,
                          }}>
                            Unlist
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                                  {/* Event Image */}
                  <Box
                    sx={{
                      display:{xs:'block', md:'block'},//hiding image for now
                      aspectRatio: '1/1',
                      maxWidth: {xs:'60px', md:'120px'},
                      backgroundColor: '#e2e8f0', // Default background, will be updated with extracted colors
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    {item.eventImage && (
                      <img
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

                {/* Action Buttons - Mobile: Full-width row below details */}
                <Box 
                  sx={{ 
                    display: { xs: 'flex', md: 'none' },
                    flexDirection: 'row',
                    gap: 1,
                    width: '100%',
                  }}
                >
                  {showActions === 'active' ? (
                    <>
                      {/* Leave Waitlist Button - 65% */}
                      <Box 
                        className={`${classNamePrefix}-leave-button-mobile`}
                        onClick={() => onRemove?.(item.id)}
                        sx={{ 
                          borderRadius: '16px',
                          border: `1px solid ${colors.borderLight}`,
                          backgroundColor: 'colors.background.paper',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '8px 12px',
                          flex: '0 0 65%',
                          transition: 'all 200ms ease-out',
                          '&:hover': {
                            backgroundColor: 'white',
                            boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08), 0 0 10px 0 rgba(0,0,0,0.05)',
                            transform: 'translateY(-1px)',
                            '& .MuiTypography-root': {
                              color: 'oklch(0.1 0.0 0)',
                            },
                          }
                        }}
                      >
                        <Typography variant="body2" sx={{                     
                          fontSize: '13px',
                          color: colors.primaryText,
                          fontWeight: 500,
                          fontFamily: "'Inter', sans-serif",
                          lineHeight: 1.6,
                        }}>
                          Leave Waitlist
                        </Typography>
                      </Box>
                      
                      {/* Change Button - 35% */}
                      <Box 
                        className={`${classNamePrefix}-change-button-mobile`}
                        onClick={() => onEdit?.(item.id)}
                        sx={{ 
                          borderRadius: '16px',
                          border: `1px solid ${colors.borderLight}`,
                          backgroundColor: 'colors.background.paper',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '8px 12px',
                          flex: '0 0 35%',
                          transition: 'all 200ms ease-out',
                          '&:hover': {
                            backgroundColor: 'white',
                            boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08), 0 0 10px 0 rgba(0,0,0,0.05)',
                            transform: 'translateY(-1px)',
                            '& .MuiTypography-root': {
                              color: 'oklch(0.1 0.0 0)',
                            },
                          }
                        }}
                      >
                        <Typography variant="body2" sx={{                     
                          fontSize: '13px',
                          color: colors.primaryText,
                          fontWeight: 500,
                          fontFamily: "'Inter', sans-serif",
                          lineHeight: 1.6,
                        }}>
                          Change
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    /* Unlist Button for Listed Tickets - Full width on mobile */
                    <Box 
                      className={`${classNamePrefix}-unlist-button-mobile`}
                      onClick={() => onUnlist?.(item.id)}
                      sx={{ 
                        borderRadius: '16px',
                        border: `1px solid ${colors.borderLight}`,
                        backgroundColor: 'colors.background.paper',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8px 12px',
                        width: '100%',
                        transition: 'all 200ms ease-out',
                        '&:hover': {
                          backgroundColor: 'white',
                          boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08), 0 0 10px 0 rgba(0,0,0,0.05)',
                          transform: 'translateY(-1px)',
                          '& .MuiTypography-root': {
                            color: 'oklch(0.1 0.0 0)',
                          },
                        }
                      }}
                    >
                      <Typography variant="body2" sx={{                     
                        fontSize: '13px',
                        color: colors.primaryText,
                        fontWeight: 500,
                        fontFamily: "'Inter', sans-serif",
                        lineHeight: 1.6,
                      }}>
                        Unlist
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>

      
          
 
        </Collapse>
      </Box>
    </Box>
  );
};

export default WaitlistCollapsibleHeader;
