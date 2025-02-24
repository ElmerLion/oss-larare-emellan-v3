import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ContactList } from "@/components/contacts/ContactList";
import { ChatWindow } from "@/components/contacts/ChatWindow";
import { ResourceDetailsDialog } from "@/components/resources/ResourceDetailsDialog";
import type { ExtendedProfile } from "@/types/profile";
import type { Message } from "@/types/message";
import type { Material } from "@/types/material";

export default function Kontakter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<ExtendedProfile | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [linkedMaterials, setLinkedMaterials] = useState<Material[]>([]);
  const [linkedFiles, setLinkedFiles] = useState<Material[]>([]);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);


  // New state to detect mobile/tablet view and control which panel is shown.
  const [isMobileView, setIsMobileView] = useState(false);
  const [showContacts, setShowContacts] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobileView(mobile);
      if (!mobile) setShowContacts(true);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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

  // Query: Get recent messages (received by current user)
  const { data: recentMessages } = useQuery({
    queryKey: ["recentMessages", currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const { data, error } = await supabase
        .from("messages")
        .select(`
          sender_id,
          receiver_id,
          content,
          created_at,
          sender:profiles!sender_id ( full_name, avatar_url, title, school ),
          receiver:profiles!receiver_id ( full_name, avatar_url, title, school )
        `)
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .is("group_id", null) // Only one-to-one messages
        .order("created_at", { ascending: false });

      if (error) throw error;

      const grouped: Record<string, any> = {};
      data.forEach((msg) => {
        const otherId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
        const profileData = msg.sender_id === currentUserId ? msg.receiver : msg.sender;
        if (!grouped[otherId]) {
          grouped[otherId] = {
            id: otherId,
            full_name: profileData?.full_name || "",
            avatar_url: profileData?.avatar_url || "/placeholder.svg",
            title: profileData?.title || "",
            school: profileData?.school || "",
            lastMessage: msg.content,
            lastMessageTime: msg.created_at,
          };
        }
      });
      return Object.values(grouped);
    },
    enabled: !!currentUserId,
  });

  // Query: Get contacts for the current user
  const { data: contactProfiles } = useQuery({
    queryKey: ["contacts", currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data: contactsData, error: contactsError } = await supabase
        .from("user_contacts")
        .select("contact_id")
        .eq("user_id", user.id);
      if (contactsError) throw contactsError;
      const contactIds = contactsData?.map((contact) => contact.contact_id) || [];
      if (contactIds.length === 0) return [];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", contactIds);
      if (profilesError) throw profilesError;
      return profilesData || [];
    },
    enabled: !!currentUserId,
  });

  // Query: Get groups for the current user by fetching group memberships and joining with groups.
  const { data: groups } = useQuery({
    queryKey: ["contacts-groups", currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const { data, error } = await supabase
        .from("group_memberships")
        .select(`group:groups(*)`)
        .eq("user_id", currentUserId);
      if (error) throw error;
      return data?.map((membership: any) => membership.group) || [];
    },
    enabled: !!currentUserId,
  });

  // Combine recentMessages and contactProfiles into one array.
  const [combinedProfiles, setCombinedProfiles] = useState<ExtendedProfile[]>([]);
  useEffect(() => {
    const combinedMap = new Map<string, ExtendedProfile>();

    if (recentMessages) {
      recentMessages.forEach((msg: any) => {
        combinedMap.set(msg.id, {
          id: msg.id,
          full_name: "",
          avatar_url: "",
          title: "",
          school: "",
          lastMessage: msg.lastMessage,
          lastMessageTime: msg.lastMessageTime,
          isContact: false,
        });
      });
    }

    if (contactProfiles) {
      contactProfiles.forEach((profile: ExtendedProfile) => {
        if (combinedMap.has(profile.id)) {
          const existing = combinedMap.get(profile.id)!;
          existing.full_name = profile.full_name;
          existing.avatar_url = profile.avatar_url;
          existing.title = profile.title || "";
          existing.school = profile.school || "";
          existing.isContact = true;
          combinedMap.set(profile.id, existing);
        } else {
          combinedMap.set(profile.id, {
            ...profile,
            lastMessage: profile.lastMessage || null,
            lastMessageTime: profile.lastMessageTime || null,
            isContact: true,
          });
        }
      });
    }

    const updateMissingProfiles = async () => {
      const promises = Array.from(combinedMap.entries()).map(async ([id, profile]) => {
        if (!profile.full_name) {
          const { data, error } = await supabase
            .from("profiles")
            .select("full_name, avatar_url, title, school")
            .eq("id", id)
            .single();
          if (!error && data) {
            combinedMap.set(id, {
              ...profile,
              full_name: data.full_name,
              avatar_url: data.avatar_url || "/placeholder.svg",
              title: data.title || "",
              school: data.school || "",
            });
          }
        }
      });
      await Promise.all(promises);
      const profilesWithMessages = Array.from(combinedMap.values()).filter(
        (p) => p.lastMessageTime
      );
      profilesWithMessages.sort(
        (a, b) =>
          new Date(b.lastMessageTime!).getTime() - new Date(a.lastMessageTime!).getTime()
      );
      const profilesWithoutMessages = Array.from(combinedMap.values()).filter(
        (p) => !p.lastMessageTime
      );
      setCombinedProfiles([...profilesWithMessages, ...profilesWithoutMessages]);
    };

    updateMissingProfiles();
  }, [recentMessages, contactProfiles]);

  const processedChatParam = useRef(false);
  useEffect(() => {
    const chatUserId = searchParams.get("chat");
    if (!chatUserId || processedChatParam.current) return;
    processedChatParam.current = true;
    const userToSelect = combinedProfiles.find((p) => p.id === chatUserId);
    if (userToSelect) {
      setSelectedUser(userToSelect);
      if (isMobileView) setShowContacts(false);
    } else {
      (async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", chatUserId)
          .single();
        if (!error && data) {
          const newProfile = {
            ...data,
            lastMessage: data.lastMessage || "",
            lastMessageTime: data.lastMessageTime || new Date().toISOString(),
            isContact: false,
          };
          setCombinedProfiles((prev) => {
            if (prev.find((p) => p.id === newProfile.id)) return prev;
            return [...prev, newProfile];
          });
          setSelectedUser(newProfile);
          if (isMobileView) setShowContacts(false);
        }
      })();
    }
  }, [searchParams, combinedProfiles, isMobileView]);

  // Query: Fetch messages for the selected conversation.
  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: ["messages", selectedGroup ? selectedGroup.id : selectedUser?.id],
    queryFn: async () => {
      if (selectedGroup && currentUserId) {
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
            ),
            sender:profiles!sender_id (
              id,
              full_name,
              avatar_url,
              title,
              school
            )
          `)
          .eq("group_id", selectedGroup.id)
          .order("created_at", { ascending: true });
        if (error) throw error;
        return data;
      } else if (selectedUser && currentUserId) {
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
            ),
            sender:profiles!sender_id (
              id,
              full_name,
              avatar_url,
              title,
              school
            )
          `)
          .or(
            `and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUserId})`
          )
          .order("created_at", { ascending: true });
        if (error) throw error;
        return data;
      }
      return [];
    },
    enabled: !!(selectedGroup || (selectedUser && currentUserId)),
  });


  // Realtime subscription for new messages.
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
        () => {
          refetchMessages();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUser, refetchMessages]);

  const handleLinkMaterial = (material: Material) =>
    setLinkedMaterials((prev) => [...prev, material]);
  const handleClearLinkedMaterial = (index: number) => {
    const updatedMaterials = [...linkedMaterials];
    updatedMaterials.splice(index, 1);
    setLinkedMaterials(updatedMaterials);
  };

  const handleSendMessage = async (
    linkedMaterialIds: string[] = [],
    linkedFileIds: string[] = []
  ) => {
    if (!newMessage.trim() || !currentUserId || !(selectedUser || selectedGroup)) return;
    try {
      let insertPayload: any = {
        sender_id: currentUserId,
        content: newMessage,
      };

      if (selectedGroup) {
        // Send as group message
        insertPayload.group_id = selectedGroup.id;
      } else if (selectedUser) {
        // Send as individual message
        insertPayload.receiver_id = selectedUser.id;
      }

      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .insert(insertPayload)
        .select()
        .single();
      if (messageError) throw messageError;
      if (linkedMaterialIds.length > 0) {
        const materialEntries = linkedMaterialIds.map((materialId) => ({
          message_id: messageData.id,
          material_id: materialId,
        }));
        await supabase.from("message_materials").insert(materialEntries);
      }
      if (linkedFileIds.length > 0) {
        const fileEntries = linkedFileIds.map((fileId) => ({
          message_id: messageData.id,
          file_id: fileId,
        }));
        await supabase.from("message_files").insert(fileEntries);
      }
      setNewMessage("");
      setLinkedMaterials([]);
      setLinkedFiles([]);
      refetchMessages();
    } catch (error: any) {
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

  // Back button handler for mobile/tablet.
  const handleBack = () => {
    if (isMobileView) {
      setSelectedUser(null);
      setShowContacts(true);
    }
  };

  return (
    <div className="flex h-screen bg-[#F6F6F7]">
      <AppSidebar />
      <div className="flex flex-1 lg:ml-64 p-6 gap-6 relative">
        {(!isMobileView || showContacts) && (
          <ContactList
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            profiles={combinedProfiles}
            groups={groups}
            selectedUser={selectedUser}
            onSelectUser={(user) => {
              setSelectedUser(user);
              setSelectedGroup(null); // clear any selected group
              if (isMobileView) setShowContacts(false);
            }}
            onSelectGroup={(group) => {
              setSelectedGroup(group);
              setSelectedUser(null); // clear any selected user
              console.log("Selected group ", group)
              if (isMobileView) setShowContacts(false);
            }}
          />


        )}
        {(!isMobileView || !showContacts) && (
          <div className="flex-1 flex flex-col h-full">
            {isMobileView && !showContacts && (
              <button
                onClick={handleBack}
                className="mb-4 p-2 text-sm font-medium bg-gray-200 rounded hover:bg-gray-300"
              >
                Tillbaka till kontakter
              </button>
            )}
            <ChatWindow
              selectedUser={selectedUser}
              selectedGroup={selectedGroup}
              messages={messages}
              newMessage={newMessage}
              currentUserId={currentUserId}
              onNewMessageChange={setNewMessage}
              onSendMessage={(linkedMaterialIds, linkedFileIds) =>
                handleSendMessage(linkedMaterialIds, linkedFileIds)
              }
              linkedMaterials={linkedMaterials}
              linkedFiles={linkedFiles}
              onClearLinkedMaterial={(index) => handleClearLinkedMaterial(index)}
              onClearLinkedFile={(index) => {
                const updatedFiles = [...linkedFiles];
                updatedFiles.splice(index, 1);
                setLinkedFiles(updatedFiles);
              }}
              onLinkMaterial={(material) => {
                if (!linkedMaterials.some((m) => m.id === material.id)) {
                  setLinkedMaterials([...linkedMaterials, material]);
                }
              }}
              onLinkFile={(file) => {
                if (!linkedFiles.some((f) => f.id === file.id)) {
                  setLinkedFiles([...linkedFiles, file]);
                }
              }}
              onViewMaterial={handleViewMaterial}
            />
          </div>
        )}
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
