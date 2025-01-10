import { useState, useEffect } from "react";
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

  // Fetch contacts first, then all other profiles
  const { data: profiles } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // First get contacts
      const { data: contactsData } = await supabase
        .from('user_contacts')
        .select('contact_id')
        .eq('user_id', user.id);

      const contactIds = contactsData?.map(contact => contact.contact_id) || [];

      // Get contact profiles
      const { data: contacts } = await supabase
        .from('profiles')
        .select('*')
        .in('id', contactIds);

      // Get all other profiles
      const { data: otherProfiles } = await supabase
        .from('profiles')
        .select('*')
        .not('id', 'in', [...contactIds, user.id]);

      // Combine and sort profiles, putting contacts first
      return [
        ...(contacts || []).map(profile => ({ ...profile, isContact: true })),
        ...(otherProfiles || []).map(profile => ({ ...profile, isContact: false }))
      ];
    },
  });

  // Fetch messages for selected conversation
  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: ['messages', selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser?.id || !currentUserId) return [];

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!selectedUser && !!currentUserId,
  });

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!selectedUser) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
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
      .from('messages')
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