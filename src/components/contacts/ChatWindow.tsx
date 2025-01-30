import { Send, Paperclip, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { LinkMaterialDialog } from "@/components/LinkMaterialDialog";
import type { Profile } from "@/types/profile";
import type { Message } from "@/types/message";
import type { Material } from "@/types/material";
import { supabase } from "@/integrations/supabase/client";


interface ChatWindowProps {
    selectedUser: Profile | null;
    messages: Message[] | undefined;
    newMessage: string;
    currentUserId: string | null;
    onNewMessageChange: (message: string) => void;
    onSendMessage: (linkedMaterialIds?: string[], linkedFileIds?: string[]) => void;
    linkedMaterials?: Material[];
    linkedFiles?: Material[]; // <-- Fix: Add this
    onClearLinkedMaterial?: (index: number) => void;
    onClearLinkedFile?: (index: number) => void; // <-- Fix: Add this
    onLinkMaterial?: (material: Material) => void;
    onLinkFile?: (file: Material) => void; // <-- Fix: Add this
    onViewMaterial?: (materialId: string) => void;
}



export function ChatWindow({
  selectedUser,
  messages,
  newMessage,
  currentUserId,
  onNewMessageChange,
  onSendMessage,
  linkedMaterials = [],
  onClearLinkedMaterial,
  onLinkMaterial,
  onViewMaterial,
}: ChatWindowProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [linkedFiles, setLinkedFiles] = useState<Material[]>([]);


    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !currentUserId || !selectedUser || linkedFiles.length >= 3) return;

        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${currentUserId}/${Date.now()}.${fileExt}`;

            // Upload file to Supabase Storage (message_files bucket)
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("message_files")
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const fileUrl = `https://xyz.supabase.co/storage/v1/object/public/message_files/${fileName}`;

            // Insert file metadata into "files" table
            const { data: fileData, error: fileError } = await supabase
                .from("files")
                .insert({
                    title: file.name,
                    file_path: fileUrl,
                    author_id: currentUserId,
                })
                .single();

            if (fileError) throw fileError;

            // Add file to linkedFiles state
            setLinkedFiles([...linkedFiles, fileData]);
        } catch (error) {
            console.error("File upload failed:", error);
        }
    };



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
            {selectedUser.title} {selectedUser.school ? `på ${selectedUser.school}` : ""}
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

                          {/* Display attached materials */}
                          {message.materials?.map((material) => (
                              <button
                                  key={material.material_id}
                                  className="mt-2 p-2 bg-gray-50 rounded-md flex items-center gap-2 w-full hover:bg-gray-100 transition-colors"
                                  onClick={() => onViewMaterial?.(material.resources.id)}
                              >
                                  <Paperclip className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600 flex-1 text-left">
                                      {material.resources.title}
                                  </span>
                              </button>
                          ))}

                          {/* Display attached files */}
                          {message.files?.map((file) => (
                              <a
                                  key={file.file_id}
                                  href={file.resources.file_path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 p-2 bg-gray-50 rounded-md flex items-center gap-2 w-full hover:bg-gray-100 transition-colors"
                              >
                                  <Upload className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600 flex-1 text-left">
                                      {file.resources.title}
                                  </span>
                              </a>
                          ))}

                          <p className="text-xs mt-1 opacity-70">
                              {format(new Date(message.created_at), "MMM d, HH:mm")}
                          </p>
                      </div>
                  );
              })}


      </div>


      <div className="p-4 border-t">
        {linkedMaterials.map((material, index) => (
          <div key={material.id} className="mb-2 p-2 bg-gray-50 rounded-md flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{material.title}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClearLinkedMaterial?.(index)}
              className="h-6 px-2"
            >
              ×
            </Button>
          </div>
        ))}

              {linkedFiles.map((file, index) => (
                  <div key={file.id} className="mb-2 p-2 bg-gray-50 rounded-md flex justify-between items-center">
                      <div className="flex items-center gap-2">
                          <Upload className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{file.title}</span>
                      </div>
                      <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onClearLinkedFile?.(index)}
                          className="h-6 px-2"
                      >
                          ×
                      </Button>
                  </div>
              ))}

        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDialogOpen(true)}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-4 w-4" />
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </Button>
          <Input
            placeholder="Skriv ett meddelande..."
            className="bg-gray-50 flex-1"
            value={newMessage}
            onChange={(e) => onNewMessageChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onSendMessage(linkedMaterials.map((material) => material.id));

              }
            }}
          />
          <Button
            onClick={() => {
              onSendMessage(linkedMaterials.map((material) => material.id));
            }}
            size="icon"
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <LinkMaterialDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSelect={(material) => {
          setIsDialogOpen(false);
          if (linkedMaterials.length < 3) onLinkMaterial?.(material);
        }}
      />
    </div>
  );
}
