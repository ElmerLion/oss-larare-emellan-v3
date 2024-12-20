import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/AppSidebar";
import { useState } from "react";

interface Message {
  id: number;
  sender: string;
  message: string;
  timestamp: string;
  unread?: number;
  avatar: string;
}

const messages: Message[] = [
  {
    id: 1,
    sender: "Elmer Almer Ershagen",
    message: "Såg att du var en mattelärare...",
    timestamp: "18 Dec 16:12",
    unread: 2,
    avatar: "/lovable-uploads/ac1ea747-7ba9-4d55-a96a-87f6e8210f7e.png"
  },
  {
    id: 2,
    sender: "Fredrik Andersson",
    message: "Har du testat detta AI-verktyget?",
    timestamp: "18 Dec 14:12",
    unread: 1,
    avatar: "/lovable-uploads/ac1ea747-7ba9-4d55-a96a-87f6e8210f7e.png"
  },
  {
    id: 3,
    sender: "Sofia Persson",
    message: "Har du någon erfarenhet i...",
    timestamp: "17 Dec 16:45",
    avatar: "/lovable-uploads/ac1ea747-7ba9-4d55-a96a-87f6e8210f7e.png"
  },
  {
    id: 4,
    sender: "Emmie Nilsson",
    message: "Jag brukar använda den här, du...",
    timestamp: "15 Dec 19:42",
    avatar: "/lovable-uploads/ac1ea747-7ba9-4d55-a96a-87f6e8210f7e.png"
  },
  {
    id: 5,
    sender: "Anna Bergström",
    message: "Jobbar du med årskus 7...",
    timestamp: "15 Dec 16:17",
    avatar: "/lovable-uploads/ac1ea747-7ba9-4d55-a96a-87f6e8210f7e.png"
  }
];

export default function Kontakter() {
  const [selectedContact, setSelectedContact] = useState<Message>(messages[2]); // Default to Sofia Persson

  return (
    <div className="flex h-screen bg-white">
      <AppSidebar />
      
      {/* Main content with left margin for sidebar */}
      <div className="flex flex-1 ml-64">
        {/* Left side - Contact list */}
        <div className="w-1/3 border-r">
          <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Kontakter</h1>
            <h2 className="text-sm text-gray-600 mb-4">Dina senaste meddelanden</h2>
            
            {/* Search bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Vem letar du efter?" 
                className="pl-10 bg-gray-50"
              />
            </div>

            {/* Contact list */}
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedContact(message)}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer hover:bg-gray-50",
                    selectedContact.id === message.id && "bg-blue-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={message.avatar}
                      alt={message.sender}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="font-medium truncate">{message.sender}</span>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {message.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{message.message}</p>
                    </div>
                    {message.unread && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {message.unread}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Chat window */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="p-4 border-b flex items-center gap-3">
            <img
              src={selectedContact.avatar}
              alt={selectedContact.sender}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium">{selectedContact.sender}</h3>
              <p className="text-sm text-gray-600">Lärare på Affärsgymnasiet</p>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            <div className="max-w-[80%] ml-auto bg-blue-500 text-white p-3 rounded-lg">
              Hej! Vad roligt att du fick användning av den. Jag har jobbat med det mycket själv och tänkte att någon annan hade kunnat få användning av det också.
            </div>
            <div className="max-w-[80%] bg-gray-100 p-3 rounded-lg">
              Har du någon erfarenhet i hur man gör företagsekonomi roligare för eleverna?
            </div>
          </div>

          {/* Chat input */}
          <div className="p-4 border-t">
            <Input placeholder="Skriv ett meddelande..." className="bg-gray-50" />
          </div>
        </div>
      </div>
    </div>
  );
}