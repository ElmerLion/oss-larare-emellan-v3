import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
  onGroupCreated?: (group: any) => void;
}

export function GroupDialog({
  open,
  onOpenChange,
  currentUserId,
  onGroupCreated,
}: GroupDialogProps) {
  // Mode: "list" shows latest groups/invitations; "create" shows the form.
  const [mode, setMode] = useState<"list" | "create">("list");
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  // New states for icon and public toggle
  const [groupIcon, setGroupIcon] = useState<File | null>(null);
  const [iconUrl, setIconUrl] = useState<string>("");
  const [isPublic, setIsPublic] = useState(true);

  // Confirmation dialog state for joining a group.
  const [groupToJoin, setGroupToJoin] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { toast } = useToast();

  // Query for the 5 latest public groups.
  const { data: latestGroups } = useQuery({
    queryKey: ["latestPublicGroups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  // Query for pending invitations.
  const { data: invitations, refetch: refetchInvitations } = useQuery({
    queryKey: ["groupInvitations", currentUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_memberships")
        .select(`group:groups(*)`)
        .eq("user_id", currentUserId)
        .eq("status", "pending");
      if (error) throw error;
      return data?.map((membership: any) => membership.group) || [];
    },
  });

  // Query for groups the user is already in.
  const { data: userGroups } = useQuery({
    queryKey: ["userGroups", currentUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_memberships")
        .select("group_id")
        .eq("user_id", currentUserId)
        .eq("status", "approved");
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentUserId,
  });

  // Filter out groups the user is already in.
  const filteredLatestGroups = useMemo(() => {
    if (!latestGroups || !userGroups) return latestGroups || [];
    const userGroupIds = new Set(userGroups.map((ug: any) => ug.group_id));
    return latestGroups.filter((group: any) => !userGroupIds.has(group.id));
  }, [latestGroups, userGroups]);

  // Helper: join an existing group (via confirmation dialog).
  const handleJoinGroup = async (group: any) => {
    try {
      const { error } = await supabase
        .from("group_memberships")
        .insert({
          group_id: group.id,
          user_id: currentUserId,
          role: "member",
          status: "approved",
        })
        .select()
        .single();
      if (error) throw error;
      toast({
        title: "Gå med",
        description: "Du har gått med i gruppen",
        variant: "success",
      });
      setIsConfirmOpen(false);
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Fel",
        description: err.message || "Något gick fel",
        variant: "destructive",
      });
    }
  };

  // Helper: Accept an invitation by updating status to "approved"
  const handleAcceptInvitation = async (group: any) => {
    try {
      const { error } = await supabase
        .from("group_memberships")
        .update({ status: "approved" })
        .eq("group_id", group.id)
        .eq("user_id", currentUserId)
        .select()
        .single();
      if (error) throw error;
      toast({
        title: "Gå med",
        description: "Du har gått med i gruppen",
        variant: "success",
      });
      // Refetch invitations so that the accepted invitation is removed from the list.
      refetchInvitations();
    } catch (err: any) {
      toast({
        title: "Fel",
        description: err.message || "Något gick fel",
        variant: "destructive",
      });
    }
  };

  // Upload icon file to Supabase Storage.
  const handleIconUpload = async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `group_icons/${currentUserId}/${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage
        .from("group_icons")
        .upload(fileName, file);
      if (error) throw error;
      const { data: urlData, error: urlError } = await supabase.storage
        .from("group_icons")
        .createSignedUrl(fileName, 60 * 60 * 24 * 7); // URL valid for 7 days
      if (urlError) throw urlError;
      setIconUrl(urlData.signedUrl);
    } catch (err: any) {
      toast({
        title: "Fel",
        description: err.message || "Kunde inte ladda upp ikon",
        variant: "destructive",
      });
    }
  };

  // Handler for file input change.
  const onIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setGroupIcon(file);
      await handleIconUpload(file);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast({
        title: "Fel",
        description: "Gruppnamn krävs",
        variant: "destructive",
      });
      return;
    }
    try {
      const { data: groupData, error: groupError } = await supabase
        .from("groups")
        .insert({
          name: groupName,
          description: groupDescription,
          owner_id: currentUserId,
          is_public: isPublic,
          icon_url: iconUrl,
        })
        .select()
        .single();
      if (groupError) throw groupError;

      const { error: membershipError } = await supabase
        .from("group_memberships")
        .insert({
          group_id: groupData.id,
          user_id: currentUserId,
          role: "owner",
          status: "approved",
        })
        .select()
        .single();
      if (membershipError) throw membershipError;

      toast({
        title: "Grupp skapad",
        description: "Gruppen har skapats",
        variant: "success",
      });
      if (onGroupCreated) {
        onGroupCreated(groupData);
      }
      onOpenChange(false);
      setGroupName("");
      setGroupDescription("");
      setIconUrl("");
      setGroupIcon(null);
      setIsPublic(true);
      setMode("list");
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message || "Något gick fel",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white rounded-lg shadow-sm">
          <DialogHeader>
            <DialogTitle>
              {mode === "list" ? "Välj Grupp" : "Skapa ny Grupp"}
            </DialogTitle>
          </DialogHeader>
          {mode === "list" ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold">
                  Senaste publika grupper
                </h3>
                {filteredLatestGroups && filteredLatestGroups.length > 0 ? (
                  <div className="space-y-2 mt-2">
                    {filteredLatestGroups.map((group: any) => (
                      <div
                        key={group.id}
                        className="p-2 border rounded hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          // Open confirmation dialog before joining
                          setGroupToJoin(group);
                          setIsConfirmOpen(true);
                        }}
                      >
                        <div className="font-medium">{group.name}</div>
                        {group.description && (
                          <p className="text-xs text-gray-500">
                            {group.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    Inga publika grupper hittades.
                  </p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold">Inbjudningar</h3>
                {invitations && invitations.length > 0 ? (
                  <div className="space-y-2 mt-2">
                    {invitations.map((group: any) => (
                      <div
                        key={group.id}
                        className="p-2 border rounded hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleAcceptInvitation(group)}
                      >
                        <div className="font-medium">{group.name}</div>
                        {group.description && (
                          <p className="text-xs text-gray-500">
                            {group.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    Inga inbjudningar.
                  </p>
                )}
              </div>
              <div className="mt-4">
                <Button
                  className="text-white hover:text-white bg-[var(--primary)] hover:bg-[var(--hover-green)]"
                  variant="outline"
                  onClick={() => setMode("create")}
                >
                  Skapa ny grupp
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Gruppnamn</label>
                <Input
                  placeholder="Ange gruppnamn"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Beskrivning</label>
                <Input
                  placeholder="Ange en kort beskrivning"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Gruppikon</label>
                <Input type="file" onChange={onIconChange} />
                {iconUrl && (
                  <img
                    src={iconUrl}
                    alt="Gruppikon"
                    className="w-16 h-16 rounded object-cover mt-2"
                  />
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                <label htmlFor="isPublic" className="text-sm">
                  Gör gruppen offentlig
                </label>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  className="text-white hover:text-white bg-[var(--primary)] hover:bg-[var(--hover-green)]"
                  onClick={handleCreateGroup}
                >
                  Skapa grupp
                </Button>
                <Button variant="outline" onClick={() => setMode("list")}>
                  Avbryt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for joining a group */}
      {isConfirmOpen && groupToJoin && (
        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent className="bg-white rounded-lg shadow-sm">
            <DialogHeader>
              <DialogTitle>Bekräfta</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p>
                Är du säker på att du vill gå med i gruppen "{groupToJoin.name}"?
              </p>
            </div>
            <DialogFooter>
              <Button
                onClick={async () => {
                  await handleJoinGroup(groupToJoin);
                  setGroupToJoin(null);
                }}
                className="text-white hover:text-white bg-[var(--primary)] hover:bg-[var(--hover-green)]"
              >
                Ja, gå med
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsConfirmOpen(false);
                  setGroupToJoin(null);
                }}
              >
                Avbryt
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
