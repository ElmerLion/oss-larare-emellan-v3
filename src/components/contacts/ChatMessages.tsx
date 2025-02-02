import { format } from "date-fns";
import { Paperclip, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/profile";
import type { Message } from "@/types/message";
import type { Material } from "@/types/material";

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

  // Fetch the file as a Blob from the signed URL
  try {
    const response = await fetch(data.signedUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();

    // Create an object URL from the blob
    const objectUrl = URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger the download
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = fileName; // This forces the download with the specified file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Revoke the object URL after a short delay to free up memory
    setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
  } catch (fetchError) {
    console.error("Error fetching the file for download:", fetchError);
  }
}



interface ChatMessagesProps {
  selectedUser: Profile;
  messages: Message[] | undefined;
  currentUserId: string | null;
  onViewMaterial?: (materialId: string) => void;
}

export function ChatMessages({
  selectedUser,
  messages,
  currentUserId,
  onViewMaterial,
}: ChatMessagesProps) {
  return (
    <>
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
                    {material.resources.title}
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
    </>
  );
}
