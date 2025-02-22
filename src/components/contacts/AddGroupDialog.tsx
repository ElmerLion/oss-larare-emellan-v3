import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Group {
  id: string;
  name: string;
  description?: string;
  is_public: boolean;
  owner_id: string;
  created_at: string;
}

interface AddGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddGroupDialog({ open, onOpenChange }: AddGroupDialogProps) {
  const [newGroups, setNewGroups] = useState<Group[]>([]);
  const [invites, setInvites] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // State for creating a new group
  const [isCreatingNewGroup, setIsCreatingNewGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [creatingError, setCreatingError] = useState<string>("");

  // Fetch current user id.
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    fetchCurrentUser();
  }, []);

  // When the dialog is open, fetch groups and invites.
  useEffect(() => {
    if (!open) return;
    setLoading(true);

    const fetchGroupsData = async () => {
      try {
        // Fetch the most newly created groups.
        const { data: groupsData, error: groupsError } = await supabase
          .from("groups")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);
        if (groupsError) throw groupsError;
        setNewGroups(groupsData || []);

        // Fetch group invites for the current user.
        if (currentUserId) {
          const { data: invitesData, error: invitesError } = await supabase
            .from("group_memberships")
            .select("groups(*)")
            .eq("user_id", currentUserId)
            .eq("status", "invited");
          if (invitesError) throw invitesError;
          // Each row's "groups" key contains the group info.
          const inviteGroups = invitesData.map((entry: any) => entry.groups);
          setInvites(inviteGroups);
        }
      } catch (error) {
        console.error("Error fetching groups or invites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupsData();
  }, [open, currentUserId]);

  // Function to handle creating a new group.
  const handleCreateGroup = async () => {
    if (!currentUserId) return;
    if (!groupName.trim()) {
      setCreatingError("Gruppnamn krävs.");
      return;
    }

    setCreatingError("");
    try {
      // Insert a new group.
      const { data: groupData, error: groupError } = await supabase
        .from("groups")
        .insert({
          name: groupName.trim(),
          description: groupDescription.trim(),
          is_public: isPublic,
          owner_id: currentUserId,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Automatically add the creator as a member with role 'owner' and approved status.
      const { error: membershipError } = await supabase
        .from("group_memberships")
        .insert({
          group_id: groupData.id,
          user_id: currentUserId,
          role: "owner",
          status: "approved",
        });

      if (membershipError) throw membershipError;

      // Optionally, update local state.
      setNewGroups((prev) => [groupData, ...prev]);
      // Reset form.
      setGroupName("");
      setGroupDescription("");
      setIsPublic(true);
      setIsCreatingNewGroup(false);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating group:", error);
      setCreatingError(error.message || "Fel vid skapande av grupp.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Grupper</h2>
          <button onClick={() => onOpenChange(false)} className="text-gray-600 hover:text-gray-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isCreatingNewGroup ? (
          // Create new group form.
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Gruppnamn</label>
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Ange gruppnamn"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Beskrivning</label>
              <textarea
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="Beskriv gruppen (valfritt)"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                id="isPublic"
                className="mr-2"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-700">
                Offentlig grupp
              </label>
            </div>
            {creatingError && <p className="text-xs text-red-500">{creatingError}</p>}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsCreatingNewGroup(false)}
                className="px-4 py-2 text-xs text-gray-600 hover:underline"
              >
                Avbryt
              </button>
              <button
                onClick={handleCreateGroup}
                className="px-4 py-2 bg-sage-500 hover:bg-sage-600 text-white text-xs font-medium rounded-lg"
              >
                Skapa grupp
              </button>
            </div>
          </div>
        ) : (
          <>
            {loading ? (
              <p>Laddar grupper...</p>
            ) : (
              <>
                {invites.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Inbjudningar</h3>
                    <div className="space-y-2">
                      {invites.map((group: Group) => (
                        <div
                          key={group.id}
                          className="p-2 rounded-lg cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            // Implement your group selection / join logic here.
                            onOpenChange(false);
                          }}
                        >
                          <span className="font-medium">{group.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Nya grupper</h3>
                  <div className="space-y-2">
                    {newGroups.map((group: Group) => (
                      <div
                        key={group.id}
                        className="p-2 rounded-lg cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          // Implement your group selection / join logic here.
                          onOpenChange(false);
                        }}
                      >
                        <span className="font-medium">{group.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="border-t pt-4">
              <button
                onClick={() => setIsCreatingNewGroup(true)}
                className="w-full bg-sage-500 hover:bg-sage-600 text-white text-sm font-medium py-2 rounded-lg"
              >
                Skapa ny grupp
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
