
import { Send, Paperclip, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LinkMaterialDialog } from "@/components/LinkMaterialDialog";
import type { Material } from "@/types/material";
import type { Profile } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

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
  // Local state for files uploaded during this session
  const [uploadedFiles, setUploadedFiles] = useState<Material[]>([]);

  useEffect(() => {
    console.log("Uploaded files state updated:", uploadedFiles);
  }, [uploadedFiles]);


  // Upload file to Supabase Storage and insert its record into the files table
const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  // Check that a file exists, the user is authenticated, and that no more than 3 files are attached
  if (!file || !currentUserId || uploadedFiles.length >= 3) return;

  console.log("Current User ID:", currentUserId);
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${currentUserId}/${Date.now()}.${fileExt}`;

    // Step 1: Upload the file to the "message_files" bucket
    const { error: uploadError } = await supabase.storage
      .from("message_files")
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    // Since the bucket is private, we don’t generate a public URL.
    // Instead, store the file’s storage path (i.e. fileName) in the database.
    console.log("Inserting file with author_id:", currentUserId);

    // Update: Select id, title, and file_path so we have the title for display
    const { data: fileData, error: fileError } = await supabase
      .from("files")
      .insert({
        title: file.name,
        file_path: fileName, // Store the file's path for later signed URL generation
        author_id: currentUserId,
      })
      .select("id, title, file_path")
      .single();

    if (fileError) {
      throw fileError;
    }

    console.log("File inserted successfully:", fileData.id);

    // Update the local state with the new file info (for UI preview and sending with the message)
    setUploadedFiles([...uploadedFiles, fileData]);
  } catch (error) {
    console.error("File upload failed:", error);
  }
};


  const handleSend = async () => {
    // Prevent duplicate sends

    // Log the file IDs being sent for debugging
    console.log("Sending message with file IDs:", uploadedFiles.map((file) => file.id));

    // Call onSendMessage with file IDs from uploadedFiles and linked material IDs
    await onSendMessage(
      linkedMaterials.map((material) => material.id),
      uploadedFiles.map((file) => file.id)
    );

    // Clear the local state so that files are not sent again
    setUploadedFiles([]);

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

      {/* Display uploaded files above the message box */}
      {uploadedFiles.length > 0 && (
        <div className="mb-2 p-2 bg-gray-100 rounded-md flex flex-wrap gap-2">
          {uploadedFiles.map((file, index) => (
            <div key={file.id} className="p-2 bg-white rounded-lg shadow flex items-center gap-2">
              <span className="text-sm text-gray-700">{file.title}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-1"
                onClick={() =>
                  setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
                }
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
            <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} />
          </label>
        </Button>
        <Input
          placeholder="Skriv ett meddelande..."
          className="bg-gray-50 flex-1"
          value={newMessage}
          onChange={(e) => onNewMessageChange(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />
        <Button
          onClick={handleSend}
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
