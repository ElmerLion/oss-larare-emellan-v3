import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { DeleteAccountDialog } from "@/components/settings/DeleteAccountDialog";
import { ChangePasswordDialog } from "@/components/settings/ChangePasswordDialog";
import ChangeInterestsDialog from "@/components/settings/ChangeInterestsDialog";
import { Button } from "@/components/ui/button";

export default function Installningar() {
  const [isInterestsOpen, setIsInterestsOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F6F6F7]">
      {/* Use ml-0 on mobile and ml-64 on large screens */}
      <div className="flex-1 ml-0 lg:ml-64">
        <main className="min-h-[calc(100vh-4rem)] bg-[#F6F6F7]">
          <div className="p-6">
            {/* Constrain the inner container and add horizontal padding */}
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-2xl font-bold mb-8">Inställningar</h1>

              {/* Account settings section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold">Kontoinställningar</h2>
                <div className="flex flex-col gap-4">
                  <ChangePasswordDialog />
                  <Button variant="outline" onClick={() => setIsInterestsOpen(true)}>
                    Ändra intressen och ämnen
                  </Button>
                </div>
              </div>

              {/* Danger zone section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-red-600 mb-4">Farozon</h2>
                <p className="text-gray-600 mb-4">
                  Åtgärder i detta avsnitt kan inte ångras. Var försiktig.
                </p>
                <DeleteAccountDialog />
              </div>
            </div>
          </div>
        </main>
      </div>
      <ChangeInterestsDialog
        open={isInterestsOpen}
        onOpenChange={setIsInterestsOpen}
      />
    </div>
  );
}
