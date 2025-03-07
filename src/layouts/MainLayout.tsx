// MainLayout.tsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import BroadcastBanner from "@/components/BroadcastBanner";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";

export default function MainLayout() {
    const [isBannerVisible, setIsBannerVisible] = useState(false);
    // Assume bannerHeight is 60px – adjust if needed.
    const bannerHeight = 55;

    return (
        <div className="min-h-screen">
            {/* BroadcastBanner calls onVisibilityChange to update isBannerVisible */}
            <BroadcastBanner onVisibilityChange={setIsBannerVisible} />
            {/* Pass the offset to Header */}
            <Header offset={isBannerVisible ? bannerHeight : 0} />
            <div className="flex" style={{ marginTop: isBannerVisible ? bannerHeight : 0 }}>
                {/* Pass the offset to AppSidebar */}
                <AppSidebar offset={isBannerVisible ? bannerHeight : 0} />
                <main className="flex-grow p-4 mt-12">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
