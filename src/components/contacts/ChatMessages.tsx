import { format } from "date-fns";
import { Paperclip, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
    onGroupLeft?: () => void;
}

export function ChatMessages({
    selectedUser,
    selectedGroup,
    messages,
    currentUserId,
    onViewMaterial,
}: ChatMessagesProps) {
    return (
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages?.map((message) => {
                const isSentByMe = message.sender_id === currentUserId;
                const messageBg = isSentByMe
                    ? "bg-blue-100 hover:bg-blue-200"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200";
                return (
                    <div
                        key={message.id}
                        className={cn(
                            "max-w-[80%] p-3 rounded-lg",
                            isSentByMe ? "ml-auto" : "mr-auto",
                            messageBg
                        )}
                    >
                        <div className="flex items-center mb-1">
                            <MiniProfile
                                id={message.sender?.id || message.sender_id}
                                name={message.sender?.full_name || "Unknown Sender"}
                                avatarUrl={message.sender?.avatar_url || "/placeholder.svg"}
                                size="small"
                                showLink={false}
                            />
                            <span className="text-xs ml-4">
                                Skickad {format(new Date(message.created_at), "MMM d, HH:mm")}
                            </span>
                        </div>
                        <p className="whitespace-pre-wrap">{message.content}</p>
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
    );
}
