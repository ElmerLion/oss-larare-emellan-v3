// src/components/profile/ProfileInterests.tsx
import React, { useState } from "react";
import { Pencil } from "lucide-react";
import ChangeInterestsDialog from "@/components/settings/ChangeInterestsDialog";
import { Button } from "@/components/ui/button";

interface ProfileInterestsProps {
  subjects?: string[];
  interests?: string[];
  educationLevel?: string;
  isCurrentUser?: boolean;
  onComplete?: () => void;
}

export function ProfileInterests({
  subjects,
  interests,
  educationLevel,
  isCurrentUser = false,
  onComplete,
}: ProfileInterestsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  // When the dialog completes, close it and notify the parent.
  const handleDialogComplete = () => {
    setIsEditOpen(false);
    if (onComplete) onComplete();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 relative">
      {isCurrentUser && (
        <>
          {/* Shown on screens sm and up */}
          <div className="hidden sm:block absolute top-4 right-4 hover:text-gray-700">
            <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
              <Pencil className="w-4 h-4 mr-2" />
              Ändra
            </Button>
          </div>
          {/* Shown on phones */}
          <div className="block sm:hidden mb-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
              <Pencil className="w-4 h-4 mr-2" />
              Ändra
            </Button>
          </div>
        </>
      )}

      <h2 className="text-xl font-semibold mb-2">Ämnen & Intressen</h2>
      {educationLevel && (
        <p className="text-sm text-gray-500 mb-2">
          Utbildningsnivå: {educationLevel}
        </p>
      )}
      <div className="mb-4">
        <h3 className="font-medium text-gray-700">Ämnen / Kurser</h3>
        {subjects && subjects.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {subjects.map((subject) => (
              <span
                key={subject}
                className="px-3 py-1 bg-[var(--secondary2)] text-white rounded-full text-xs"
              >
                {subject}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2">Inga ämnen valda</p>
        )}
      </div>
      <div>
        <h3 className="font-medium text-gray-700">Intressen</h3>
        {interests && interests.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 bg-[var(--secondary2)] text-white rounded-full text-xs"
              >
                {interest}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2">Inga intressen valda</p>
        )}
      </div>
      {isCurrentUser && (
        <ChangeInterestsDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          onComplete={handleDialogComplete}
        />
      )}
    </div>
  );
}

export default ProfileInterests;
