import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ContactList } from "@/components/contacts/ContactList";
import { ChatWindow } from "@/components/contacts/ChatWindow";
import type { Profile } from "@/types/profile";
import type { Message } from "@/types/message";

export default function Kontakter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

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

      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from("user_contacts")
        .select("contact_id")
        .eq("user_id", user.id);

      if (contactsError) {
        console.error("Error fetching contacts:", contactsError);
        throw contactsError;
      }

      const contactIds = contactsData?.map((contact) => contact.contact_id) || [];

      if (contactIds.length === 0) {
        // No contacts
        return [];
      }

      // Fetch profiles of contacts
      const { data: contacts, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", contactIds);

      if (profilesError) {
        console.error("Error fetching contact profiles:", profilesError);
        throw profilesError;
      }

      return contacts || [];
    },
  });

  // Automatically select user from query parameters
  useEffect(() => {
    const chatUserId = searchParams.get("chat");
    if (chatUserId && profiles) {
      const userToSelect = profiles.find((profile) => profile.id === chatUserId);
      if (userToSelect) {
        setSelectedUser(userToSelect);
      }
    }
  }, [searchParams, profiles]);

  // Fetch messages for selected conversation
  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: ["messages", selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser?.id || !currentUserId) return [];

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUserId})`
        )
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Message[];
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

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !currentUserId) return;

    const { error } = await supabase
      .from("messages")
      .insert({
        sender_id: currentUserId,
        receiver_id: selectedUser.id,
        content: newMessage,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      return;
    }

    setNewMessage("");
    refetchMessages();
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
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}
