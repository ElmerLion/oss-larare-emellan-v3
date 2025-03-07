import { useEffect, useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Profile } from "@/types/profile";
import type { Message } from "@/types/message";
import type { Material } from "@/types/material";

interface ChatWindowProps {
    selectedUser: Profile | null;
    selectedGroup?: any | null;
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
    onGroupLeft?: () => void;
}

export function ChatWindow(props: ChatWindowProps) {
    // If neither a user nor a group is selected, show the default message.
    if (!props.selectedUser && !props.selectedGroup) {
        return (
            <div className="flex-1 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-500">
                Välj en användare för att börja chatta
            </div>
        );
    }

    const { toast } = useToast();
    const { selectedGroup, selectedUser, currentUserId, onGroupLeft } = props;

    // --- ChatHeader State & Effects ---
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [editedIconUrl, setEditedIconUrl] = useState("");

    // Set initial group details when a group is selected.
    useEffect(() => {
        if (selectedGroup) {
            setEditedName(selectedGroup.name);
            setEditedDescription(selectedGroup.description || "");
            setEditedIconUrl(selectedGroup.icon_url || "");
            setIsEditing(false);
        }
    }, [selectedGroup]);

    // Save edits to group details.
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
            // Optionally update the selectedGroup object or trigger a re-fetch.
            selectedGroup.name = data.name;
            selectedGroup.description = data.description;
            selectedGroup.icon_url = data.icon_url;
            setIsEditing(false);
        } catch (err: any) {
            toast({ title: "Fel", description: err.message, variant: "destructive" });
        }
    };

    // Handle group icon change.
    const handleIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && currentUserId) {
            const file = e.target.files[0];
            const fileExt = file.name.split(".").pop();
            const fileName = `group_icons/${currentUserId}/${Date.now()}.${fileExt}`;
            const { error } = await supabase.storage.from("group_icons").upload(fileName, file);
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

    // Realtime subscription: if user loses group membership, trigger onGroupLeft.
    useEffect(() => {
        if (!selectedGroup || !currentUserId || !onGroupLeft) return;
        const channelName = `chat-membership-deletion-${selectedGroup.id}-${currentUserId}`;
        const channel = supabase
            .channel(channelName)
            .on(
                "postgres_changes",
                { event: "DELETE", schema: "public", table: "group_memberships" },
                (payload) => {
                    if (payload.old.user_id === currentUserId && payload.old.group_id === selectedGroup.id) {
                        toast({
                            title: "Grupp lämnat",
                            description: "Du har lämnat gruppen.",
                            variant: "destructive",
                        });
                        onGroupLeft();
                    }
                }
            )
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "group_memberships" },
                (payload) => {
                    if (
                        payload.new.user_id === currentUserId &&
                        payload.new.group_id === selectedGroup.id &&
                        payload.new.status !== "approved"
                    ) {
                        toast({
                            title: "Grupp lämnat",
                            description: "Du har lämnat gruppen.",
                            variant: "destructive",
                        });
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
        <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col min-h-0">
            {/* Render ChatHeader */}
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
            {/* Scrollable container for messages and ChatInput */}
            <div className="flex flex-col flex-1 min-h-0 overflow-y-auto relative">
                <ChatMessages {...props} onGroupLeft={onGroupLeft} />
                <div className="sticky bottom-0 bg-white p-4 max-h-[40%]">
                    <ChatInput {...props} />
                </div>
            </div>
        </div>
    );
}

export default ChatWindow;
