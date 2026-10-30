import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export function BrandLogo({ className = "", size = 32 }: BrandLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      className={className}
    >
      {/* Industrial Octagonal Frame */}
      <polygon
        points="30,6 70,6 94,30 94,70 70,94 30,94 6,70 6,30"
        fill="#121214"
        stroke="#27272A"
        strokeWidth="2.5"
      />

      {/* Corner Crosshairs */}
      <line x1="16" y1="30" x2="24" y2="30" stroke="#3F3F46" strokeWidth="1.5" />
      <line x1="20" y1="26" x2="20" y2="34" stroke="#3F3F46" strokeWidth="1.5" />
      <line x1="76" y1="30" x2="84" y2="30" stroke="#3F3F46" strokeWidth="1.5" />
      <line x1="80" y1="26" x2="80" y2="34" stroke="#3F3F46" strokeWidth="1.5" />

      {/* Tower Pylon Base Structure */}
      <path
        d="M 28 82 L 42 46 L 58 46 L 72 82"
        stroke="#71717A"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Pylon Cross Bracing */}
      <line x1="34" y1="68" x2="66" y2="68" stroke="#3F3F46" strokeWidth="2" />
      <line x1="39" y1="55" x2="61" y2="55" stroke="#3F3F46" strokeWidth="2" />

      {/* Control Tower Observation Deck */}
      <polygon
        points="36,46 64,46 70,34 30,34"
        fill="#1A1A1E"
        stroke="#FF5F15"
        strokeWidth="2"
      />

      {/* Command Windows Slits */}
      <line
        x1="36"
        y1="40"
        x2="64"
        y2="40"
        stroke="#FF5F15"
        strokeWidth="1.5"
        strokeDasharray="4 2"
      />

      {/* Radome / Autonomous Antenna Mast */}
      <line
        x1="50"
        y1="34"
        x2="50"
        y2="18"
        stroke="#FAFAFA"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Transmitter Beacon */}
      <circle cx="50" cy="18" r="4" fill="#FF5F15" />

      {/* Radar Sweep Horizon Arc */}
      <path
        d="M 36 22 A 16 16 0 0 1 64 22"
        stroke="#FF5F15"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
    </svg>
  );
}

export default BrandLogo;
