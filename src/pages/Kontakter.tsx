import { Search, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/AppSidebar";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

interface Profile {
  id: string;
  full_name: string;
  title: string;
  avatar_url: string;
  school: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

export default function Kontakter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  // Fetch all profiles
  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      return data as Profile[];
    },
  });

  // Fetch messages for selected conversation
  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: ['messages', selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser?.id) return [];
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!selectedUser,
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
    if (!newMessage.trim() || !selectedUser) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
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

  const filteredProfiles = profiles?.filter(profile => 
    profile.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.school?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.title?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="flex h-screen bg-[#F6F6F7]">
      <AppSidebar />
      
      <div className="flex flex-1 ml-64 p-6 gap-6">
        {/* Left side - Contact list */}
        <div className="w-[400px] bg-white rounded-lg shadow-sm">
          <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Kontakter</h1>
            <h2 className="text-sm text-gray-600 mb-4">Sök efter andra lärare</h2>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Vem letar du efter?" 
                className="pl-10 bg-gray-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              {filteredProfiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => setSelectedUser(profile)}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer hover:bg-gray-50",
                    selectedUser?.id === profile.id && "bg-blue-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={profile.avatar_url || "/placeholder.svg"}
                      alt={profile.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/profil/${profile.id}`}
                        className="font-medium hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {profile.full_name || "Unnamed User"}
                      </Link>
                      <p className="text-sm text-gray-600 truncate">
                        {profile.title} {profile.school ? `på ${profile.school}` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Chat window */}
        <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col">
          {selectedUser ? (
            <>
              <div className="p-4 border-b flex items-center gap-3">
                <img
                  src={selectedUser.avatar_url || "/placeholder.svg"}
                  alt={selectedUser.full_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <Link 
                    to={`/profil/${selectedUser.id}`}
                    className="font-medium hover:underline"
                  >
                    {selectedUser.full_name}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {selectedUser.title} {selectedUser.school ? `på ${selectedUser.school}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages?.map((message) => {
                  const isSentByMe = message.sender_id === supabase.auth.getUser()?.data?.user?.id;
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "max-w-[80%]",
                        isSentByMe ? "ml-auto" : "mr-auto",
                        isSentByMe ? "bg-blue-500 text-white" : "bg-gray-100",
                        "p-3 rounded-lg"
                      )}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {format(new Date(message.created_at), 'MMM d, HH:mm')}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Skriv ett meddelande..." 
                    className="bg-gray-50"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    size="icon"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Välj en användare för att börja chatta
            </div>
          )}
        </div>
      </div>
    </div>
  );
}