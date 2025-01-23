import { useEffect, useRef, useState } from "react";
import { MoreVertical, Save, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import MiniProfile from "@/components/profile/MiniProfile";

interface Author {
  id?: string;
  name: string;
  avatar: string;
  timeAgo: string;
}

interface PostHeaderProps {
  author: Author;
  postId: string;
  onSave: () => void;
  disableProfileClick?: boolean;
}

export function PostHeader({ author, postId, onSave, disableProfileClick }: PostHeaderProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false); // State for menu visibility
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeletePost = async () => {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId);

      if (error) throw error;

      toast({
        title: "Inlägg borttagen",
        description: "Inlägget har tagits bort",
      });

      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Kunde inte ta bort inlägget",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-start justify-between mb-4 relative">
      {/* Author Info with MiniProfile */}
      <MiniProfile
        id={author.id || ""}
        name={author.name || "Unnamed User"}
        avatarUrl={author.avatar}
        timeAgo={author.timeAgo}
        size="medium"
        showLink={!disableProfileClick}
      />

      {/* Menu Trigger */}
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-400 hover:text-gray-600"
        >
          <MoreVertical className="w-6 h-6" />
        </button>

        {/* Menu Content */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-40">
            <button
              onClick={onSave}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              <Save className="mr-2 h-4 w-4 inline-block" />
              Spara post
            </button>
            {author.id === currentUserId && (
              <button
                onClick={handleDeletePost}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <Trash2 className="mr-2 h-4 w-4 inline-block" />
                Ta bort inlägg
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
