import React, { useState } from "react";
import { useBroadcast } from "@/hooks/useBroadcast";

export type BannerColor = "yellow" | "orange" | "red";

interface BroadcastBannerProps {
  // Optionally, you could accept a default color in case your broadcast record doesn't specify one.
  defaultColor?: BannerColor;
}

export function BroadcastBanner({
  defaultColor = "yellow",
}: BroadcastBannerProps): JSX.Element | null {
  const { data: broadcastData, isLoading } = useBroadcast();
  const [isClosed, setIsClosed] = useState(false);

  if (isLoading) return null;
  if (isClosed) return null;
  if (!broadcastData?.enabled) return null;

  // Use broadcastData.color if available, otherwise use defaultColor.
  let color: BannerColor = (broadcastData.color as BannerColor) || defaultColor;

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
        <span>{broadcastData.message}</span>
        <button
          onClick={() => setIsClosed(true)}
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
