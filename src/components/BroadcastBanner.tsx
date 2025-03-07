import React, { useEffect, useState } from "react";
import { useBroadcast } from "@/hooks/useBroadcast";

export type BannerColor = "yellow" | "orange" | "red";

interface BroadcastBannerProps {
    defaultColor?: BannerColor;
    onVisibilityChange?: (visible: boolean) => void;
}

export function BroadcastBanner({
    defaultColor = "yellow",
    onVisibilityChange,
}: BroadcastBannerProps): JSX.Element | null {
    const { data: broadcastData, isLoading } = useBroadcast();
    const [isClosed, setIsClosed] = useState<boolean>(false);

    // Helper key for local storage
    const storageKey = "broadcastClosed";

    // On mount, check localStorage for the closed flag and stored timestamp.
    useEffect(() => {
        const storedData = localStorage.getItem(storageKey);
        if (storedData) {
            try {
                const { closed, updatedAt } = JSON.parse(storedData);
                // If broadcastData is loaded and timestamps differ, remove flag.
                if (broadcastData && broadcastData.updated_at !== updatedAt) {
                    localStorage.removeItem(storageKey);
                    setIsClosed(false);
                } else {
                    setIsClosed(closed);
                }
            } catch (error) {
                console.error("Error parsing broadcast closed flag", error);
            }
        }
    }, [broadcastData]);

    useEffect(() => {
        if (!isLoading && onVisibilityChange) {
            onVisibilityChange(!isClosed && !!broadcastData?.enabled);
        }
    }, [isLoading, broadcastData, onVisibilityChange, isClosed]);

    if (isLoading) return null;
    if (!broadcastData?.enabled || isClosed) return null;

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
        case "blue":
            bgColor = "bg-blue-100";
            textColor = "text-blue-800";
            break;
        case "green":
            bgColor = "bg-green-100";
            textColor = "text-green-800";
            break;
    }

    return (
        <div className={`${bgColor} ${textColor} w-full p-4 fixed top-0 left-0 right-0 z-50`}>
            <div className="max-w-screen-xl mx-auto flex justify-between items-center">
                <span className="text-md">{broadcastData.message}</span>
                <button
                    onClick={() => {
                        setIsClosed(true);
                        // Store both the closed flag and the current updated_at timestamp
                        localStorage.setItem(storageKey, JSON.stringify({
                            closed: true,
                            updatedAt: broadcastData.updated_at,
                        }));
                        onVisibilityChange && onVisibilityChange(false);
                    }}
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
