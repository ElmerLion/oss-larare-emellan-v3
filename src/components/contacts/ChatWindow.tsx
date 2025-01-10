import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/profile";
import type { Message } from "@/types/message";

interface ChatWindowProps {
  selectedUser: Profile | null;
  messages: Message[] | undefined;
  newMessage: string;
  currentUserId: string | null;
  onNewMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

export function ChatWindow({
  selectedUser,
  messages,
  newMessage,
  currentUserId,
  onNewMessageChange,
  onSendMessage,
}: ChatWindowProps) {
  if (!selectedUser) {
    return (
      <div className="flex-1 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-500">
        Välj en användare för att börja chatta
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col">
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
          const isSentByMe = message.sender_id === currentUserId;
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
            onChange={(e) => onNewMessageChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
          />
          <Button 
            onClick={onSendMessage}
            size="icon"
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}