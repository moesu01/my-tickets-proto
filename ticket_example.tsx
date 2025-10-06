import React, { useEffect, useState } from "react";
import svgPaths from "../imports/svg-5xt6mqyyup";
import transferSvgPaths from "../imports/svg-iv16wwxr0w";

interface DynamicColorTicketProps {
  backgroundImage?: string;
  eventTitle?: string;
  venue?: string;
  location?: string;
  ticketType?: string;
  date?: string;
  time?: string;
  admitCount?: string;
  ticketId?: string;
  onColorsExtracted?: (colors: ExtractedColors) => void;
  // Background image controls
  imageBlur?: number;
  imageOpacity?: number;
  backgroundColor?: string;
  // Bottom section controls
  bottomSectionBackgroundColor?: string;
  // Shadow controls
  dropShadowBlur?: number;
  dropShadowOpacity?: number;
  dropShadowOffsetX?: number;
  dropShadowOffsetY?: number;
  innerShadowBlur?: number;
  innerShadowOpacity?: number;
  innerShadowColor?: string;
}

export interface ExtractedColors {
  primary: string; // 100% alpha
  secondary: string; // 60% alpha
  subtle: string; // 15% alpha
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
        };

        resolve(colors);
      } catch (error) {
        // Fallback to default colors if extraction fails
        resolve({
          base: "rgb(66, 62, 0)",
          primary: "rgba(66, 62, 0, 1)",
          secondary: "rgba(66, 62, 0, 0.6)",
          subtle: "rgba(66, 62, 0, 0.15)",
        });
      }
    };

    img.onerror = () => {
      // Fallback to default colors
      resolve({
        base: "rgb(66, 62, 0)",
        primary: "rgba(66, 62, 0, 1)",
        secondary: "rgba(66, 62, 0, 0.6)",
        subtle: "rgba(66, 62, 0, 0.15)",
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

export const DynamicColorTicket: React.FC<
  DynamicColorTicketProps
> = ({
  backgroundImage,
  eventTitle = "Pursuit of happiness w/ vosters & dj chazz rockwell",
  venue = "The Monarch",
  location = "Brooklyn, NY",
  ticketType = "VIP - Table Seating (up to 6 guests)",
  date = "AUG | 07 | 25",
  time = "6:00 → 10:00PM",
  admitCount = "6",
  ticketId = "012390zzv9a0d9f80",
  onColorsExtracted,
  imageBlur = 17.15,
  imageOpacity = 0.15,
  backgroundColor = "#ffffff",
  bottomSectionBackgroundColor = "#d0d0d0",
  // Shadow defaults
  dropShadowBlur = 15,
  dropShadowOpacity = 0.15,
  dropShadowOffsetX = 0,
  dropShadowOffsetY = 8,
  innerShadowBlur = 37.6,
  innerShadowOpacity = 1,
  innerShadowColor = "#f0f0f0",
}) => {
  const [colors, setColors] = useState<ExtractedColors>({
    base: "rgb(66, 62, 0)",
    primary: "rgba(66, 62, 0, 1)",
    secondary: "rgba(66, 62, 0, 0.6)",
    subtle: "rgba(66, 62, 0, 0.15)",
  });

  useEffect(() => {
    if (backgroundImage) {
      extractColorsFromImage(backgroundImage)
        .then((extractedColors) => {
          setColors(extractedColors);
          onColorsExtracted?.(extractedColors);
        })
        .catch(console.error);
    } else {
      // Reset to default colors when no image
      const defaultColors = {
        base: "rgb(66, 62, 0)",
        primary: "rgba(66, 62, 0, 1)",
        secondary: "rgba(66, 62, 0, 0.6)",
        subtle: "rgba(66, 62, 0, 0.15)",
      };
      setColors(defaultColors);
      onColorsExtracted?.(defaultColors);
    }
  }, [backgroundImage, onColorsExtracted]);

  // Generate dynamic shadow styles
  const dropShadowStyle = {
    boxShadow: `${dropShadowOffsetX}px ${dropShadowOffsetY}px ${dropShadowBlur}px rgba(0, 0, 0, ${dropShadowOpacity})`,
  };

  const innerShadowStyle = {
    boxShadow: `0px 0px ${innerShadowBlur}px 0px inset ${innerShadowColor}`,
    opacity: innerShadowOpacity,
  };

  return (
    <div
      className="box-border background-[transparent] content-stretch flex flex-col items-start justify-start relative shrink-0 rounded-[16px] overflow-hidden"
      style={dropShadowStyle}
    >
      {/* Top ticket section */}
      <div
        className="h-[169px] relative rounded-bl-[16px] rounded-br-[16px] rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[327px] overflow-hidden"
        style={{ backgroundColor, ...innerShadowStyle }}
        data-name="mobile ticket"
      >
        <div className="box-border content-stretch flex flex-col gap-3 h-[169px] items-center justify-center overflow-clip px-0 py-3 relative w-[327px]">
          {/* Blurred background image */}
          {backgroundImage && (
            <div
              className="absolute bg-center bg-cover bg-no-repeat filter left-[0.5px] rounded-[10px] w-full h-full top-[68px]"
              data-name="background image"
              style={{
                backgroundImage: `url('${backgroundImage}')`,
                filter: `blur(${imageBlur}px)`,
                opacity: imageOpacity,
              }}
            />
          )}

          {/* Main content */}
          <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full">
            <div className="relative size-full">
              <div className="box-border content-stretch flex flex-col items-start justify-between px-3 py-0 relative size-full">
                {/* Title section */}
                <div
                  className="relative shrink-0 w-full"
                  data-name="title"
                >
                  <div
                    className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-start justify-between leading-[0] not-italic relative w-full"
                    style={{ color: colors.primary }}
                  >
                    <div className="basis-0 content-stretch flex flex-col gap-1 grow items-start justify-start min-h-px min-w-px relative shrink-0">
                      <div className="flex flex-col font-['ABC_Diatype_Unlicensed_Trial:Medium',_sans-serif] justify-center relative shrink-0 text-[14px] text-nowrap tracking-[-0.28px]">
                        <p className="leading-[1.25] whitespace-pre">
                          Matinee Social Club
                        </p>
                      </div>
                      <div
                        className="capitalize flex flex-col font-['ABC_Diatype_Unlicensed_Trial:Heavy',_sans-serif] justify-center min-w-full relative shrink-0 text-[16px]"
                        style={{ width: "min-content" }}
                      >
                        <p className="leading-[1.2] font-bold">
                          {eventTitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col font-['ABC_Diatype_Unlicensed_Trial:Regular',_sans-serif] justify-center relative shrink-0 text-[12px] text-nowrap">
                      <p className="[text-underline-position:from-font] decoration-solid leading-[1.25] underline whitespace-pre">
                        Receipt
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details section */}
                <div className="relative shrink-0 w-full">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-3 items-start justify-start relative w-full">
                    {/* Venue */}
                    <div className="box-border content-stretch flex items-center justify-between pb-0 pt-1.5 px-0 relative shrink-0 w-full">
                      <div
                        aria-hidden="true"
                        className="absolute border-[1px_0px_0px] border-solid inset-0 pointer-events-none"
                        style={{ borderColor: colors.subtle }}
                      />
                      <div
                        className="basis-0 flex flex-col font-['ABC_Diatype_Unlicensed_Trial:Regular',_sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] tracking-[-0.36px]"
                        style={{ color: colors.secondary }}
                      >
                        <p className="leading-none">VENUE</p>
                      </div>
                      <div className="content-stretch flex gap-3 items-start justify-start relative shrink-0">
                        <div
                          className="flex flex-col font-['ABC_Diatype_Unlicensed_Trial:Heavy',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap tracking-[-0.36px]"
                          style={{ color: colors.primary }}
                        >
                          <p className="leading-none whitespace-pre font-bold">
                            {venue}
                          </p>
                        </div>
                        <div
                          className="flex flex-col font-['ABC_Diatype_Unlicensed_Trial:Heavy',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap tracking-[-0.36px]"
                          style={{ color: colors.primary }}
                        >
                          <p className="leading-none whitespace-pre font-bold">
                            {location}
                          </p>
                        </div>
                        <div className="h-2.5 relative shrink-0 w-[11px]">
                          <svg
                            className="block size-full"
                            fill="none"
                            preserveAspectRatio="none"
                            viewBox="0 0 11 10"
                          >
                            <g clipPath="url(#clip0_1_1297)">
                              <path
                                d={svgPaths.p1c776d80}
                                fill={colors.secondary}
                                fillOpacity="0.9"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_1_1297">
                                <rect
                                  fill="white"
                                  height="10"
                                  width="11"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Ticket type */}
                    <div className="box-border content-stretch flex gap-0.5 items-center justify-start px-0 py-1.5 relative shrink-0 w-full">
                      <div
                        aria-hidden="true"
                        className="absolute border-[1px_0px_0px] border-solid inset-0 pointer-events-none"
                        style={{ borderColor: colors.subtle }}
                      />
                      <div
                        className="basis-0 flex flex-col font-['ABC_Diatype_Unlicensed_Trial:Regular',_sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] tracking-[-0.36px]"
                        style={{ color: colors.secondary }}
                      >
                        <p className="leading-none">TICKET</p>
                      </div>
                      <div className="content-stretch flex gap-3 items-start justify-start relative shrink-0">
                        <div
                          className="flex flex-col font-['ABC_Diatype_Unlicensed_Trial:Heavy',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap tracking-[-0.36px]"
                          style={{ color: colors.primary }}
                        >
                          <p className="leading-none whitespace-pre font-bold">
                            {ticketType}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-0 left-[-1px] pointer-events-none right-[-1px] shadow-[0px_0px_2px_0px_inset_rgba(0,0,0,0.1)] top-[-1px]" />
        <div
          aria-hidden="true"
          className="absolute border-[1px_1px_0px] border-solid bottom-0 left-[-1px] pointer-events-none right-[-1px] rounded-bl-[16px] rounded-br-[16px] rounded-tl-[5px] rounded-tr-[5px] top-[-1px]"
          style={{ borderColor: colors.subtle }}
        />
      </div>

      {/* Extended ticket section with details */}
      <div
        className="h-[218px] relative rounded-[16px] shrink-0 w-[327px] overflow-hidden"
        style={{ backgroundColor, ...innerShadowStyle }}
        data-name="mobile ticket"
      >
        <div className="box-border content-stretch flex gap-3 h-[218px] items-center justify-start overflow-clip p-[12px] relative w-[327px]">
          {/* Blurred background image */}
          {backgroundImage && (
            <div
              className="absolute bg-center bg-cover bg-no-repeat filter left-[0.5px] rounded-[10px] w-full h-[326px] translate-y-[-50%]"
              style={{
                top: "calc(50% - 47px)",
                backgroundImage: `url('${backgroundImage}')`,
                filter: `blur(${imageBlur}px)`,
                opacity: imageOpacity,
              }}
            />
          )}

          <div className="basis-0 content-stretch flex flex-col grow h-full items-start justify-between min-h-px min-w-px relative shrink-0">
            {/* Date */}
            <div className="box-border content-stretch flex flex-col gap-0.5 items-start justify-start pb-0 pt-1.5 px-0 relative shrink-0 w-full">
              <div
                aria-hidden="true"
                className="absolute border-[1px_0px_0px] border-solid inset-0 pointer-events-none"
                style={{ borderColor: colors.subtle }}
              />
              <div
                className="flex flex-col font-['ABC_Diatype_Unlicensed_Trial:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap tracking-[-0.36px]"
                style={{ color: colors.secondary }}
              >
                <p className="leading-none whitespace-pre">
                  DATE
                </p>
              </div>
              <div
                className="content-stretch flex gap-1.5 items-start justify-start relative shrink-0 w-full font-['ABC_Diatype_Unlicensed_Trial:Heavy',_sans-serif] text-[12px] tracking-[-0.36px]"
                style={{ color: colors.primary }}
              >
                <p className="leading-none whitespace-pre font-bold">
                  {date}
                </p>
              </div>
            </div>

            {/* Time */}
            <div className="box-border content-stretch flex flex-col gap-0.5 items-start justify-start pb-0 pt-1.5 px-0 relative shrink-0 w-full">
              <div
                aria-hidden="true"
                className="absolute border-[1px_0px_0px] border-solid inset-0 pointer-events-none"
                style={{ borderColor: colors.subtle }}
              />
              <div
                className="flex flex-col font-['ABC_Diatype_Unlicensed_Trial:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap tracking-[-0.36px]"
                style={{ color: colors.secondary }}
              >
                <p className="leading-none whitespace-pre">
                  TIME
                </p>
              </div>
              <div
                className="content-stretch flex items-start justify-between leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap tracking-[-0.36px] w-full font-['ABC_Diatype_Unlicensed_Trial:Heavy',_sans-serif]"
                style={{ color: colors.primary }}
              >
                <p className="leading-none text-nowrap whitespace-pre font-bold">
                  {time}
                </p>
              </div>
            </div>

            {/* Admit count */}
            <div className="box-border content-stretch flex items-start justify-between pb-0 pt-1.5 px-0 relative shrink-0 w-full">
              <div
                aria-hidden="true"
                className="absolute border-[1px_0px_0px] border-solid inset-0 pointer-events-none"
                style={{ borderColor: colors.subtle }}
              />
              <div
                className="flex flex-col font-['ABC_Diatype_Unlicensed_Trial:Heavy',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap tracking-[-0.36px]"
                style={{ color: colors.primary }}
              >
                <p className="leading-[24px] whitespace-pre font-bold">
                  ADMIT
                </p>
              </div>
              <div
                className="flex flex-col font-['ABC_Diatype_Unlicensed_Trial:Heavy',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-nowrap tracking-[-0.6px]"
                style={{ color: colors.primary }}
              >
                <p className="leading-[24px] whitespace-pre">
                  {admitCount}
                </p>
              </div>
            </div>

            {/* Ticket ID */}
            <div className="box-border content-stretch flex flex-col h-6 items-start justify-between pb-0 pt-1.5 px-0 relative shrink-0 w-full">
              <div
                aria-hidden="true"
                className="absolute border-[1px_0px_0px] border-solid inset-0 pointer-events-none"
                style={{ borderColor: colors.subtle }}
              />
              <div className="flex flex-col font-['IBM_Plex_Mono:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.3px]">
                <p className="leading-[24px] whitespace-pre">
                  {ticketId}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code placeholder */}
          <div
            className="relative rounded-[8px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] shrink-0 size-[194px]"
            style={{ backgroundColor }}
          >
            <div className="absolute left-1/2 size-40 top-1/2 translate-x-[-50%] translate-y-[-50%]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 160 160"
              >
                <path d={svgPaths.p6511720} fill="black" />
              </svg>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute border-[0px_1px] border-solid bottom-0 left-[-1px] pointer-events-none right-[-1px] rounded-[16px] top-0"
          style={{ borderColor: colors.subtle }}
        />
      </div>

      {/* Bottom section with transfer/waitlist buttons */}
      <div
        className="relative rounded-bl-[4px] rounded-br-[4px] rounded-tl-[16px] rounded-tr-[16px] h-[70px] w-[327px] overflow-hidden"
        style={{
          backgroundColor: bottomSectionBackgroundColor,
          ...innerShadowStyle,
        }}
        data-name="transfer or waitlist"
      >
        <div className="flex flex-row items-center justify-center relative size-full">
          <div className="box-border content-stretch flex gap-3 items-center justify-center overflow-clip p-[12px] relative size-full">
            {/* Blurred background image */}
            {backgroundImage && (
              <div
                className="absolute bg-center bg-cover bg-no-repeat filter left-[0.5px] rounded-[10px] w-full h-[326px] translate-y-[-50%]"
                style={{
                  top: "calc(50% - 184px)",
                  backgroundImage: `url('${backgroundImage}')`,
                  filter: `blur(${imageBlur}px)`,
                  opacity: imageOpacity,
                }}
                data-name="background image"
              />
            )}

            {/* Transfer button */}
            <div
              className="basis-0 bg-white from-[#f0f1f100] grow min-h-px min-w-px relative rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.08)] shrink-0 to-[#ffffff]"
              data-name="transfer"
            >
              <div className="flex flex-row items-center relative size-full">
                <div className="box-border content-stretch flex items-center justify-between px-3 py-2.5 relative w-full">
                  <div className="flex flex-col font-['ABC_Diatype_Unlicensed_Trial:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#333333] text-[12px] text-nowrap">
                    <p className="leading-[19.2px] whitespace-pre">
                      Transfer ticket
                    </p>
                  </div>
                  <div
                    className="relative shrink-0 size-[18px]"
                    data-name="CaretDoubleRight"
                  >
                    <svg
                      className="block size-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 18 18"
                    >
                      <g id="CaretDoubleRight">
                        <path
                          d={transferSvgPaths.p32940e00}
                          fill="var(--fill-0, black)"
                          fillOpacity="0.39"
                          id="Vector"
                        />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Waitlist button */}
            <div
              className="basis-0 bg-white from-[#f0f1f100] grow min-h-px min-w-px relative rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.08)] shrink-0 to-[#ffffff]"
              data-name="waitlist"
            >
              <div className="flex flex-row items-center relative size-full">
                <div className="box-border content-stretch flex items-center justify-between px-3 py-2.5 relative w-full">
                  <div className="flex flex-col font-['ABC_Diatype_Unlicensed_Trial:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#333333] text-[12px] text-nowrap">
                    <p className="leading-[19.2px] whitespace-pre">
                      List my ticket
                    </p>
                  </div>
                  <div
                    className="relative shrink-0 size-[18px]"
                    data-name="ListPlus"
                  >
                    <svg
                      className="block size-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 18 18"
                    >
                      <g id="ListPlus">
                        <path
                          d={transferSvgPaths.p3d41b300}
                          fill="var(--fill-0, black)"
                          fillOpacity="0.39"
                          id="Vector"
                        />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute border-[0px_1px_1px] border-[rgba(8,0,71,0.15)] border-solid bottom-[-1px] left-[-1px] pointer-events-none right-[-1px] rounded-bl-[5px] rounded-br-[5px] rounded-tl-[16px] rounded-tr-[16px] top-0"
        />
      </div>
    </div>
  );
};