import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatHeaderProps {
  selectedUser: any; // Profile
  selectedGroup?: any | null;
  currentUserId: string | null;
  isEditing: boolean;
  editedName: string;
  editedDescription: string;
  editedIconUrl: string;
  setIsEditing: (val: boolean) => void;
  setEditedName: (name: string) => void;
  setEditedDescription: (desc: string) => void;
  onIconChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveEdits: () => void;
}

export function ChatHeader({
  selectedUser,
  selectedGroup,
  currentUserId,
  isEditing,
  editedName,
  editedDescription,
  editedIconUrl,
  setIsEditing,
  setEditedName,
  setEditedDescription,
  onIconChange,
  handleSaveEdits,
}: ChatHeaderProps) {
  const toast = useToast().toast;

  return (
    <div className="p-4 border-b flex items-center gap-3">
      {selectedGroup ? (
        <>
          <div className="relative">
            {isEditing ? (
              <>
                <img
                  src={editedIconUrl || "/group-placeholder.svg"}
                  alt={editedName}
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                  onClick={() => {
                    const fileInput = document.getElementById("groupIconInput");
                    fileInput?.click();
                  }}
                />
                <input
                  id="groupIconInput"
                  type="file"
                  className="hidden"
                  onChange={onIconChange}
                />
              </>
            ) : (
              <img
                src={selectedGroup.icon_url || "/group-placeholder.svg"}
                alt={selectedGroup.name}
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
                onClick={() => setIsEditing(true)}
              />
            )}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <>
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="mb-1"
                />
                <Input
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                />
              </>
            ) : (
              <div onDoubleClick={() => setIsEditing(true)} className="cursor-pointer">
                <span className="font-medium">{selectedGroup.name}</span>
                {selectedGroup.description && (
                  <p className="text-sm text-gray-600">{selectedGroup.description}</p>
                )}
              </div>
            )}
          </div>
          {selectedGroup && currentUserId === selectedGroup.owner_id && isEditing && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveEdits}>
                Spara
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                Avbryt
              </Button>
            </div>
          )}
          {selectedGroup && currentUserId === selectedGroup.owner_id && !isEditing && (
            <Button
              variant="destructive"
              size="sm"
              className="ml-auto"
              onClick={async () => {
                if (window.confirm("Är du säker på att du vill radera denna grupp?")) {
                  const { error } = await supabase
                    .from("groups")
                    .delete()
                    .eq("id", selectedGroup.id);
                  if (error) {
                    console.error("Error deleting group:", error);
                    toast({ title: "Fel", description: error.message, variant: "destructive" });
                  } else {
                    toast({ title: "Grupp raderad", description: "Gruppen har raderats", variant: "success" });
                    // Optionally, update parent's state.
                  }
                }
              }}
            >
              Radera
            </Button>
          )}
        </>
      ) : (
        <>
          <img
            src={selectedUser.avatar_url || "/placeholder.svg"}
            alt={selectedUser.full_name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <Link to={`/profil/${selectedUser.id}`} className="font-medium hover:underline">
              {selectedUser.full_name}
            </Link>
            <p className="text-sm text-gray-600">
              {selectedUser.title} {selectedUser.school ? `på ${selectedUser.school}` : ""}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
