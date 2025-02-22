import { useEffect } from "react";
import { format } from "date-fns";
import { Paperclip, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Profile } from "@/types/profile";
import type { Message } from "@/types/message";
import type { Material } from "@/types/material";
import { Button } from "@/components/ui/button";

async function downloadFile(filePath: string, fileName: string) {
  const cleanedFilePath = filePath.trim();
  console.log("Generating signed URL for filePath:", cleanedFilePath);

  // Generate the signed URL with a 60-second expiration
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

  // Mark messages as read when the conversation is opened.
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
      <div className="p-4 border-b flex items-center gap-3">
        {selectedGroup ? (
          <>
            <img
              src={selectedGroup.icon_url || "/group-placeholder.svg"}
              alt={selectedGroup.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <span className="font-medium">{selectedGroup.name}</span>
              {selectedGroup.description && (
                <p className="text-sm text-gray-600">{selectedGroup.description}</p>
              )}
            </div>
            {currentUserId === selectedGroup.owner_id && (
              <Button
                variant="destructive"
                size="sm"
                className="ml-auto"
                onClick={async () => {
                  if (window.confirm("Är du säker på att du vill radera denna grupp?")) {
                    const { error } = await supabase
                      .from("groups")
                      .delete()
                      .eq("id", selectedGroup.id);
                    if (error) {
                      console.error("Error deleting group:", error);
                      toast({ title: "Fel", description: error.message, variant: "destructive" });
                    } else {
                      toast({ title: "Grupp raderad", description: "Gruppen har raderats", variant: "success" });
                      // Optionally, call parent's state update to remove the deleted group.
                    }
                  }
                }}
              >
                Radera
              </Button>
            )}
          </>
        ) : (
          <>
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
          </>
        )}
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
                isSentByMe ? "bg-[var(--secondary2)] text-white" : "bg-gray-100",
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
                  className="mt-2 p-2 bg-gray-50 rounded-md flex items-center gap-2 w-full hover:bg-gray-100 transition-colors"
                >
                  <Upload className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 flex-1 text-left">
                    {file.resources?.title}
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
    </>
  );
}
