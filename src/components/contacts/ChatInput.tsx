import { Send, Paperclip, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LinkMaterialDialog } from "@/components/LinkMaterialDialog";
import type { Material } from "@/types/material";
import { supabase } from "@/integrations/supabase/client";

interface ChatInputProps {
  newMessage: string;
  currentUserId: string | null;
  selectedUser: Profile;
  onNewMessageChange: (message: string) => void;
  onSendMessage: (linkedMaterialIds?: string[], linkedFileIds?: string[]) => void;
  linkedMaterials?: Material[];
  linkedFiles?: Material[];
  onClearLinkedMaterial?: (index: number) => void;
  onClearLinkedFile?: (index: number) => void;
  onLinkMaterial?: (material: Material) => void;
}

export function ChatInput({
  newMessage,
  currentUserId,
  selectedUser,
  onNewMessageChange,
  onSendMessage,
  linkedMaterials = [],
  linkedFiles = [],
  onClearLinkedMaterial,
  onClearLinkedFile,
  onLinkMaterial,
}: ChatInputProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Material[]>([]);

  // Upload file to Supabase Storage and insert into message_files table
   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
       const file = event.target.files?.[0];
       if (!file || !currentUserId || linkedFiles.length >= 3) return;

       console.log("Current User ID:", currentUserId);
       try {
           const fileExt = file.name.split(".").pop();
           const fileName = `${currentUserId}/${Date.now()}.${fileExt}`;

           // Step 1: Upload file to Supabase Storage
           const { data: uploadData, error: uploadError } = await supabase.storage
               .from("message_files")
               .upload(fileName, file);

           if (uploadError) throw uploadError;

           const fileUrl = `https://xyz.supabase.co/storage/v1/object/public/message_files/${fileName}`;

           if (!currentUserId) {
               console.error("No authenticated user detected.");
               return;
           }

           console.log("Inserting file with author_id:", currentUserId);

           // Step 2: Insert file into `files` table
           const { data: fileData, error: fileError } = await supabase
               .from("files")
               .insert({
                   title: file.name,
                   file_path: fileUrl,
                   author_id: currentUserId,
               })
               .select("id")
               .single();

           if (fileError) throw fileError;

           console.log("File inserted successfully:", fileData.id);

           setLinkedFiles([...linkedFiles, fileData]); // Store for UI preview
       } catch (error) {
           console.error("File upload failed:", error);
       }
   };




  return (
    <div className="p-4 border-t">
      {/* Display linked materials */}
      {linkedMaterials.length > 0 && (
        <div className="mb-2 p-2 bg-gray-100 rounded-md flex flex-wrap gap-2">
          {linkedMaterials.map((material, index) => (
            <div key={material.id} className="p-2 bg-white rounded-lg shadow flex items-center gap-2">
              <span className="text-sm text-gray-700">{material.title}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-1"
                onClick={() => onClearLinkedMaterial?.(index)}
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Display uploaded files above message box */}
      {uploadedFiles.length > 0 && (
        <div className="mb-2 p-2 bg-gray-100 rounded-md flex flex-wrap gap-2">
          {uploadedFiles.map((file, index) => (
            <div key={file.id} className="p-2 bg-white rounded-lg shadow flex items-center gap-2">
              <span className="text-sm text-gray-700">{file.title}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-1"
                onClick={() => {
                  setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
                }}
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 items-center">
        <Button variant="outline" size="icon" onClick={() => setIsDialogOpen(true)}>
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
              onSendMessage(
                linkedMaterials.map((material) => material.id),
                uploadedFiles.map((file) => file.id) // ✅ Send uploaded file IDs
              );
            }
          }}
        />
        <Button
          onClick={() =>
            onSendMessage(
              linkedMaterials.map((material) => material.id),
              uploadedFiles.map((file) => file.id) // ✅ Send uploaded file IDs
            )
          }
          size="icon"
          className="bg-[var(--ole-green)] hover:bg-[var(--hover-green)]"
        >
          <Send className="h-4 w-4" />
        </Button>
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
