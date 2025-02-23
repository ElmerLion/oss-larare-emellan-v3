// Header.tsx
import { Bell, MessageCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender: {
    full_name: string;
    avatar_url: string;
  };
  read_at: string | null;
}

export function Header() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const navigate = useNavigate();

  const fetchMessages = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        read_at,
        sender:profiles!messages_sender_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .eq('receiver_id', user.id)
      .order('created_at', { ascending: false })
      .limit(2);

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data as Message[]);
    setHasUnread(data.some(message => !message.read_at));
  };

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId);

    if (error) {
      console.error('Error marking message as read:', error);
    } else {
      fetchMessages();
    }
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const searchQuery = event.currentTarget.value;
      navigate(`/sök?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 lg:left-64 left-0 z-10">
      <div className="flex items-center justify-between h-full px-6">
        <div className="w-96">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Sök..."
              className="pl-10 bg-gray-50 border-0"
              onKeyDown={handleSearchKeyDown}
            />
          </div>
        </div>
      </div>
    </header>

  );
}
