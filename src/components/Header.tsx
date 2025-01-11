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
import { Link } from "react-router-dom";

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

  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10">
      <div className="flex items-center justify-between h-full px-6">
        <div className="w-96">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Sök..."
              className="pl-10 bg-gray-50 border-0"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                {hasUnread && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4">
                <h3 className="font-semibold mb-2">Senaste meddelanden</h3>
                {messages.length === 0 ? (
                  <p className="text-sm text-gray-500">Inga meddelanden än</p>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg ${!message.read_at ? 'bg-blue-50' : 'bg-gray-50'}`}
                        onClick={() => markAsRead(message.id)}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={message.sender.avatar_url || "/placeholder.svg"}
                            alt={message.sender.full_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{message.sender.full_name}</p>
                            <p className="text-sm text-gray-600 truncate">{message.content}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {format(new Date(message.created_at), 'MMM d, HH:mm')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Link
                  to="/kontakter"
                  className="block text-center text-sm text-blue-500 hover:text-blue-600 mt-3"
                >
                  Se alla meddelanden
                </Link>
              </div>
            </PopoverContent>
          </Popover>
          <button className="p-2 hover:bg-gray-100 rounded-full relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}