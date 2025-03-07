// AuthenticatedLayout.tsx
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import BroadcastBanner from "@/components/BroadcastBanner";


interface AuthenticatedLayoutProps {
    isAuthenticated: boolean;
}

export default function AuthenticatedLayout({
    isAuthenticated,
}: AuthenticatedLayoutProps) {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex flex-col">
            <BroadcastBanner />
            {/* Optional: add a margin or padding to the content container */}
            <div className="mt-4">
                <Outlet />
            </div>
        </div>
    );
}
