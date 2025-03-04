import React from "react";
import { AppSidebar } from "@/components/AppSidebar";

export function AdminModeration(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />
      <main className="pl-64 p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Moderation</h1>
        <p>This is a placeholder for the Admin Moderation page.</p>
      </main>
    </div>
  );
}
