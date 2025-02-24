import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Paperclip, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Profile } from "@/types/profile";
import type { Message } from "@/types/message";
import type { Material } from "@/types/material";
import { ChatHeader } from "./ChatHeader";
import MiniProfile from "@/components/profile/MiniProfile";

async function downloadFile(filePath: string, fileName: string) {
  const cleanedFilePath = filePath.trim();
  console.log("Generating signed URL for filePath:", cleanedFilePath);

  const { data, error } = await supabase
    .storage
    .from("message_files")
    .createSignedUrl(cleanedFilePath, 60);

  if (error) {
    console.error("Error generating signed URL:", error);
    return;
  }

  try {
    const response = await fetch(data.signedUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
  } catch (fetchError) {
    console.error("Error fetching the file for download:", fetchError);
  }
}

interface ChatMessagesProps {
  selectedUser: Profile;
  selectedGroup?: any | null;
  messages: Message[] | undefined;
  currentUserId: string | null;
  onViewMaterial?: (materialId: string) => void;
}

export function ChatMessages({
  selectedUser,
  selectedGroup,
  messages,
  currentUserId,
  onViewMaterial,
}: ChatMessagesProps) {
  const { toast } = useToast();

  // Editing state for group details (passed down to ChatHeader)
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedIconUrl, setEditedIconUrl] = useState("");

  useEffect(() => {
    if (selectedGroup) {
      setEditedName(selectedGroup.name);
      setEditedDescription(selectedGroup.description || "");
      setEditedIconUrl(selectedGroup.icon_url || "");
      setIsEditing(false);
    }
  }, [selectedGroup]);

  const handleSaveEdits = async () => {
    if (!selectedGroup) return;
    try {
      const { data, error } = await supabase
        .from("groups")
        .update({
          name: editedName,
          description: editedDescription,
          icon_url: editedIconUrl,
        })
        .eq("id", selectedGroup.id)
        .select()
        .single();
      if (error) throw error;
      toast({
        title: "Uppdaterad",
        description: "Gruppuppgifter uppdaterade",
        variant: "success",
      });
      // Update local group properties.
      selectedGroup.name = data.name;
      selectedGroup.description = data.description;
      selectedGroup.icon_url = data.icon_url;
      setIsEditing(false);
    } catch (err: any) {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    }
  };

  // Mark messages as read
  useEffect(() => {
    if (!currentUserId) return;
    if (selectedGroup) {
      const markGroupMessagesAsRead = async () => {
        const { data, error } = await supabase
          .from("messages")
          .update({ is_read: true })
          .eq("group_id", selectedGroup.id)
          .neq("sender_id", currentUserId)
          .eq("is_read", false)
          .select();
        if (error) {
          console.error("Error marking group messages as read:", error);
        } else {
          console.log("Marked group messages as read:", data);
        }
      };
      markGroupMessagesAsRead();
    } else if (selectedUser) {
      const markUserMessagesAsRead = async () => {
        const { data, error } = await supabase
          .from("messages")
          .update({ is_read: true })
          .eq("receiver_id", currentUserId)
          .eq("sender_id", selectedUser.id)
          .eq("is_read", false)
          .select();
        if (error) {
          console.error("Error marking messages as read:", error);
        } else {
          console.log("Marked messages as read:", data);
        }
      };
      markUserMessagesAsRead();
    }
  }, [selectedGroup, selectedUser, currentUserId]);

  return (
    <>
      <ChatHeader
        selectedUser={selectedUser}
        selectedGroup={selectedGroup}
        currentUserId={currentUserId}
        isEditing={isEditing}
        editedName={editedName}
        editedDescription={editedDescription}
        editedIconUrl={editedIconUrl}
        setIsEditing={setIsEditing}
        setEditedName={setEditedName}
        setEditedDescription={setEditedDescription}
        onIconChange={() => {}}
        handleSaveEdits={handleSaveEdits}
      />

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages?.map((message) => {
          const senderName = message.sender?.full_name || "Unknown Sender";
          const senderAvatar = message.sender?.avatar_url || "/placeholder.svg";
          const senderTitle = message.sender?.title;
          const senderSchool = message.sender?.school;
          const timeStamp = format(new Date(message.created_at), "MMM d, HH:mm");

          return (
            <div key={message.id} className="w-full bg-gray-100 p-3 rounded-lg hover:bg-gray-200">
              {/* Row with the mini-profile + timestamp on the right */}
              <div className="flex items-center justify-between mb-1">
                <MiniProfile
                  id={message.sender?.id || message.sender_id}
                  name={senderName}
                  avatarUrl={senderAvatar}
                  title={senderTitle}
                  school={senderSchool}
                  size="small"
                  showLink={false}
                />
                <span className="text-xs text-gray-500 ml-2 mb-4">{timeStamp}</span>
              </div>

              <p>{message.content}</p>

              {/* Display attached materials */}
              {message.materials?.map((material) => (
                <button
                  key={material.material_id}
                  className="mt-2 p-2 bg-[var(--secondary2)] rounded-md flex items-center gap-2 w-full hover:bg-[var(--hover-secondary2)] transition-colors"
                  onClick={() => onViewMaterial?.(material.resources.id)}
                >
                  <Paperclip className="h-4 w-4 text-white" />
                  <span className="text-sm text-white flex-1 text-left">
                    {material.resources?.title}
                  </span>
                </button>
              ))}

              {/* Display attached files */}
              {message.files?.map((file) => (
                <a
                  key={file.file_id}
                  href="#"
                  onClick={async (e) => {
                    e.preventDefault();
                    await downloadFile(file.resources.file_path, file.resources.title);
                  }}
                  className="mt-2 p-2 bg-[var(--secondary2)] rounded-md flex items-center gap-2 w-full hover:bg-[var(--hover-secondary2)] transition-colors"
                >
                  <Upload className="h-4 w-4 text-white" />
                  <span className="text-sm text-white flex-1 text-left">
                    {file.resources?.title}
                  </span>
                </a>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}
