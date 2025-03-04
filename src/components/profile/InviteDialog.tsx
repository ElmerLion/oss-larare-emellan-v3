import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
  inviteeId: string;
}

export function InviteDialog({
  open,
  onOpenChange,
  currentUserId,
  inviteeId,
}: InviteDialogProps) {
  const { toast } = useToast();

  // Fetch groups that the current user owns.
  const {
    data: ownedGroups,
    isLoading: isLoadingOwned,
    error: ownedError,
    refetch,
  } = useQuery({
    queryKey: ["ownedGroups", currentUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("owner_id", currentUserId);
      if (error) throw error;
      return data;
    },
  });

  // Fetch memberships for the invitee.
  const {
    data: inviteeMemberships,
    isLoading: isLoadingInviteeMemberships,
    error: inviteeError,
  } = useQuery({
    queryKey: ["inviteeMemberships", inviteeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_memberships")
        .select("group_id")
        .eq("user_id", inviteeId);
      if (error) throw error;
      return data;
    },
    enabled: !!inviteeId,
  });

  const handleInvite = async (groupId: string) => {
    // Insert a new membership with status 'pending'
    const { error } = await supabase
      .from("group_memberships")
      .insert({
        group_id: groupId,
        user_id: inviteeId,
        role: "member",
        status: "pending",
      })
      .select()
      .single();
    if (error) {
      toast({ title: "Fel", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Inbjudan skickad",
        description: "Användaren har blivit inbjuden",
        variant: "success",
      });
      refetch();
      onOpenChange(false);
    }
  };

  // Filter out groups where the invitee already has a membership.
  const filteredGroups = ownedGroups?.filter((group: any) => {
    return !inviteeMemberships?.some((membership: any) => membership.group_id === group.id);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-lg shadow-sm">
        <DialogHeader>
          <DialogTitle>Bjud in till grupp</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          {isLoadingOwned || isLoadingInviteeMemberships ? (
            <p>Laddar grupper...</p>
          ) : ownedError || inviteeError ? (
            <p>Ett fel uppstod: {(ownedError || inviteeError)?.message}</p>
          ) : filteredGroups && filteredGroups.length > 0 ? (
            <ul className="space-y-2">
              {filteredGroups.map((group: any) => (
                <li key={group.id} className="flex items-center justify-between border p-2 rounded">
                  <div>
                    <p className="font-medium">{group.name}</p>
                    {group.description && (
                      <p className="text-sm text-gray-500">{group.description}</p>
                    )}
                  </div>
                  <Button
                    className="bg-[var(--ole-green)] hover:bg-[var(--hover-green)]"
                    size="sm"
                    onClick={() => handleInvite(group.id)}
                  >
                    Bjud in
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              Inga grupper att bjuda in till, antingen äger du inga grupper eller så är
              användaren redan medlem.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Stäng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
