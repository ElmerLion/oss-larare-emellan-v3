// src/components/BroadcastBanner.tsx
import React, { useState } from "react";

export type BannerColor = "yellow" | "orange" | "red";

interface BroadcastBannerProps {
  message: string;
  color?: BannerColor;
  isVisible?: boolean;
  onClose?: () => void;
}

export function BroadcastBanner({
  message,
  color = "yellow",
  isVisible = true,
  onClose,
}: BroadcastBannerProps): JSX.Element | null {
  if (!isVisible) return null;

  // Define background and text colors based on the selected color.
  let bgColor = "";
  let textColor = "";

  switch (color) {
    case "orange":
      bgColor = "bg-orange-100";
      textColor = "text-orange-800";
      break;
    case "red":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      break;
    case "yellow":
    default:
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      break;
  }

  return (
    <div className={`${bgColor} ${textColor} w-full p-4`}>
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 font-bold"
          aria-label="Stäng meddelande"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default BroadcastBanner;
