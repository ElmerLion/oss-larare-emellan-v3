import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import type { Profile } from "@/types/profile";
import type { Message } from "@/types/message";
import type { Material } from "@/types/material";

interface ChatWindowProps {
  selectedUser: Profile | null;
  messages: Message[] | undefined;
  newMessage: string;
  currentUserId: string | null;
  onNewMessageChange: (message: string) => void;
  onSendMessage: (linkedMaterialIds?: string[], linkedFileIds?: string[]) => void;
  linkedMaterials?: Material[];
  linkedFiles?: Material[];
  onClearLinkedMaterial?: (index: number) => void;
  onClearLinkedFile?: (index: number) => void;
  onLinkMaterial?: (material: Material) => void;
  onLinkFile?: (file: Material) => void;
  onViewMaterial?: (materialId: string) => void;
}

export function ChatWindow(props: ChatWindowProps) {
  if (!props.selectedUser) {
    return (
      <div className="flex-1 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-500">
        Välj en användare för att börja chatta
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col">
      <ChatMessages {...props} />
      <ChatInput {...props} />
    </div>
  );
}
