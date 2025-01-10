import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { MoreVertical, Save, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  const handleDeletePost = async () => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Post borttagen",
        description: "Posten har tagits bort",
      });

      queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Kunde inte ta bort posten",
        variant: "destructive",
      });
    }
  };

  const AvatarWrapper = disableProfileClick 
    ? ({ children }: { children: React.ReactNode }) => <div>{children}</div>
    : ({ children }: { children: React.ReactNode }) => (
        <Link to={`/profil/${author.id}`}>{children}</Link>
      );

  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <AvatarWrapper>
          <img
            src={author.avatar || "/placeholder.svg"}
            alt={author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        </AvatarWrapper>
        <div>
          <h3 className="font-semibold">{author.name}</h3>
          <p className="text-sm text-gray-500">{author.timeAgo}</p>
        </div>
      </div>
      
      <ContextMenu>
        <ContextMenuTrigger className="cursor-pointer">
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="w-6 h-6" />
          </button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            <span>Spara post</span>
          </ContextMenuItem>
          
          {author.id === currentUserId && (
            <ContextMenuItem onClick={handleDeletePost} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Ta bort post</span>
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}