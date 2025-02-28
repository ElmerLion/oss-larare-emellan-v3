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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  // Callback to be called when the user is no longer a member of the current group.
  onGroupLeft?: () => void;
}

export function ChatMessages({
  selectedUser,
  selectedGroup,
  messages,
  currentUserId,
  onViewMaterial,
  onGroupLeft,
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
      toast({ title: "Uppdaterad", description: "Gruppuppgifter uppdaterade", variant: "success" });
      selectedGroup.name = data.name;
      selectedGroup.description = data.description;
      selectedGroup.icon_url = data.icon_url;
      setIsEditing(false);
    } catch (err: any) {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    }
  };

  // Mark messages as read.
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
        if (error) console.error("Error marking group messages as read:", error);
        else console.log("Marked group messages as read:", data);
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
      };
      markUserMessagesAsRead();
    }
  }, [selectedGroup, selectedUser, currentUserId]);

  const handleIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && currentUserId) {
      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `group_icons/${currentUserId}/${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage
        .from("group_icons")
        .upload(fileName, file);
      if (error) {
        toast({ title: "Fel", description: error.message, variant: "destructive" });
        return;
      }
      const { data: urlData, error: urlError } = await supabase.storage
        .from("group_icons")
        .createSignedUrl(fileName, 60 * 60 * 24 * 7); // URL valid for 7 days
      if (urlError) {
        toast({ title: "Fel", description: urlError.message, variant: "destructive" });
        return;
      }
      setEditedIconUrl(urlData.signedUrl);
    }
  };

  // Realtime subscription: if the current user loses membership from the selected group, call onGroupLeft.
  useEffect(() => {
    if (!selectedGroup || !currentUserId || !onGroupLeft) return;
    // Use a unique channel name to avoid conflicts.
    const channelName = `chat-membership-deletion-${selectedGroup.id}-${currentUserId}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "group_memberships" },
        (payload) => {
          console.log("Received DELETE event in ChatMessages:", payload);
          if (
            payload.old.user_id === currentUserId &&
            payload.old.group_id === selectedGroup.id
          ) {
            toast({ title: "Grupp lämnat", description: "Du har lämnat gruppen.", variant: "destructive" });
            onGroupLeft();
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "group_memberships" },
        (payload) => {
          console.log("Received UPDATE event in ChatMessages:", payload);
          // In case the membership status changes from approved to something else.
          if (
            payload.new.user_id === currentUserId &&
            payload.new.group_id === selectedGroup.id &&
            payload.new.status !== "approved"
          ) {
            toast({ title: "Grupp lämnat", description: "Du har lämnat gruppen.", variant: "destructive" });
            onGroupLeft();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedGroup, currentUserId, onGroupLeft, toast]);

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
        onIconChange={handleIconChange}
        handleSaveEdits={handleSaveEdits}
        onGroupLeft={onGroupLeft}
      />

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages?.map((message) => {
          const isSentByMe = message.sender_id === currentUserId;
          const messageBg = isSentByMe ? "bg-blue-100 hover:bg-blue-200" : "bg-gray-100 text-gray-900 hover:bg-gray-200";
          return (
            <div
              key={message.id}
              className={cn("max-w-[80%] p-3 rounded-lg", isSentByMe ? "ml-auto" : "mr-auto", messageBg)}
            >
              <div className="flex items-center mb-1">
                <MiniProfile
                  id={message.sender?.id || message.sender_id}
                  name={message.sender?.full_name || "Unknown Sender"}
                  avatarUrl={message.sender?.avatar_url || "/placeholder.svg"}
                  size="small"
                  showLink={false}
                />
                <span className="text-xs ml-4">Skickad {format(new Date(message.created_at), "MMM d, HH:mm")}</span>
              </div>
              <p>{message.content}</p>

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
