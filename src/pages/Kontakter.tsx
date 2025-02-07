import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ContactList } from "@/components/contacts/ContactList";
import { ChatWindow } from "@/components/contacts/ChatWindow";
import { ResourceDetailsDialog } from "@/components/resources/ResourceDetailsDialog";
import type { Profile } from "@/types/profile";
import type { Message } from "@/types/message";
import type { Material } from "@/types/material";

export default function Kontakter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [linkedMaterials, setLinkedMaterials] = useState<Material[]>([]);
  const [linkedFiles, setLinkedFiles] = useState<Material[]>([]);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    fetchUser();
  }, []);

  // Fetch contacts
  const { data: profiles } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: contactsData, error: contactsError } = await supabase
        .from("user_contacts")
        .select("contact_id")
        .eq("user_id", user.id);

      if (contactsError) throw contactsError;

      const contactIds = contactsData?.map((contact) => contact.contact_id) || [];

      if (contactIds.length === 0) return [];

      const { data: contacts, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", contactIds);

      if (profilesError) throw profilesError;

      return contacts || [];
    },
  });

  // Automatically select user from query parameters
  useEffect(() => {
    const chatUserId = searchParams.get("chat");
    if (chatUserId && profiles) {
      const userToSelect = profiles.find((profile) => profile.id === chatUserId);
      if (userToSelect) setSelectedUser(userToSelect);
    }
  }, [searchParams, profiles]);

  // Fetch messages for selected conversation
  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: ["messages", selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser?.id || !currentUserId) return [];

      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          materials:message_materials(
            material_id,
            resources!message_materials_material_id_fkey(id, title, file_path, description)
          ),
          files:message_files(
            file_id,
            resources:files(id, title, file_path, created_at)
          )
        `)
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUserId})`
        )
        .order("created_at", { ascending: true });

      return data;
    },
    enabled: !!selectedUser && !!currentUserId,
  });

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!selectedUser) return;

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          refetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUser, refetchMessages]);

  const handleLinkMaterial = (material: Material) => {
    if (!linkedMaterials.some(m => m.id === material.id)) {
      setLinkedMaterials([...linkedMaterials, material]);
    }
  };

  const handleClearLinkedMaterial = () => setLinkedMaterials([]);

  const handleSendMessage = async (linkedMaterialIds: string[] = [], linkedFileIds: string[] = []) => {
    if (!newMessage.trim() || !selectedUser || !currentUserId) return;

    try {
      // Insert new message
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .insert({
          sender_id: currentUserId,
          receiver_id: selectedUser.id,
          content: newMessage,
        })
        .select()
        .single();

      if (messageError) throw messageError;

      console.log("New message created:", messageData);

      // Insert linked materials
      if (linkedMaterialIds.length > 0) {
        const materialEntries = linkedMaterialIds.map((materialId) => ({
          message_id: messageData.id,
          material_id: materialId,
        }));

        await supabase.from("message_materials").insert(materialEntries);
      }

      // Insert linked files
      if (linkedFileIds.length > 0) {
        const fileEntries = linkedFileIds.map((fileId) => ({
          message_id: messageData.id,
          file_id: fileId,
        }));

        await supabase.from("message_files").insert(fileEntries);
      }

      // Reset inputs
      setNewMessage("");
      setLinkedMaterials([]);
      setLinkedFiles([]);
      refetchMessages();
    } catch (error) {
      console.error("Error inserting/updating materials and files:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleViewMaterial = async (materialId: string) => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("id", materialId)
        .single();

      if (error) throw error;

      setSelectedMaterial(data as Material);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load material details.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-[#F6F6F7]">
      <AppSidebar />
      <div className="flex flex-1 ml-64 p-6 gap-6">
        <ContactList
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          profiles={profiles}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
        />
        <ChatWindow
          selectedUser={selectedUser}
          messages={messages}
          newMessage={newMessage}
          currentUserId={currentUserId}
          onNewMessageChange={setNewMessage}
          onSendMessage={(linkedMaterialIds, linkedFileIds) => handleSendMessage(linkedMaterialIds, linkedFileIds)}
          linkedMaterials={linkedMaterials}
          linkedFiles={linkedFiles} 
          onClearLinkedMaterial={(index) => {
            const updatedMaterials = [...linkedMaterials];
            updatedMaterials.splice(index, 1);
            setLinkedMaterials(updatedMaterials);
          }}
          onClearLinkedFile={(index) => {
            const updatedFiles = [...linkedFiles];
            updatedFiles.splice(index, 1);
            setLinkedFiles(updatedFiles);
          }}
          onLinkMaterial={handleLinkMaterial}
          onLinkFile={(file) => {
            if (!linkedFiles.some((f) => f.id === file.id)) {
              setLinkedFiles([...linkedFiles, file]);
            }
          }}
          onViewMaterial={handleViewMaterial}
        />

        {selectedMaterial && (
          <ResourceDetailsDialog
            resource={selectedMaterial}
            open={!!selectedMaterial}
            onOpenChange={(open) => !open && setSelectedMaterial(null)}
          />
        )}
      </div>
    </div>
  );
}
