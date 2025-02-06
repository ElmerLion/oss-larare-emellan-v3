import { MessageSquare, Send, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string; // ensure this field is selected from the backend
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface PostCommentsProps {
  postId: string;
  totalComments: number;
  showCommentForm?: boolean;
}

export function PostComments({ postId, totalComments, showCommentForm = false }: PostCommentsProps) {
  const [comment, setComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [openCommentMenu, setOpenCommentMenu] = useState<string | null>(null);
  const [displayedCount, setDisplayedCount] = useState(totalComments);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const menuRef = useRef<HTMLDivElement>(null);

  // Update displayedCount when totalComments prop changes
  useEffect(() => {
    setDisplayedCount(totalComments);
  }, [totalComments]);

  // Fetch the current user's ID and avatar
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
        setUserAvatar(data?.avatar_url);
      }
    };
    fetchCurrentUser();
  }, []);

  // Query for comments. Ensure the query returns user_id.
  const { data: comments = [] } = useQuery({
    queryKey: ['comments', postId, showAllComments],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: false })
        .limit(showAllComments ? 50 : 2);
      if (error) throw error;
      return data as Comment[];
    },
  });

  // Real-time subscription for comment updates
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_comments',
          filter: `post_id=eq.${postId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, queryClient]);

  // Close comment menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenCommentMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmitComment = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to comment",
          variant: "destructive",
        });
        return;
      }

      // Create an optimistic new comment
      const newComment: Comment = {
        id: 'temp-' + Date.now(), // temporary id
        content: comment,
        created_at: new Date().toISOString(),
        user_id: user.id,
        profiles: {
          full_name: user.email, // fallback; ideally you'd use the user's full name from their profile
          avatar_url: userAvatar || "/lovable-uploads/0d20194f-3eb3-4f5f-ba83-44b21f1060ed.png"
        }
      };

      // Optimistically update the comments query cache
      queryClient.setQueryData<Comment[]>(['comments', postId, showAllComments], (old) =>
        old ? [newComment, ...old] : [newComment]
      );

      // Optimistically update the displayed comment count
      setDisplayedCount(prev => prev + 1);

      // Insert the new comment into the database
      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: comment,
        });
      if (error) throw error;

      setComment("");
      toast({
        title: "Success",
        description: "Comment added successfully",
      });

      // Optionally refetch comments to get the actual comment IDs from the backend
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("post_comments")
        .delete()
        .eq("id", commentId);
      if (error) throw error;
      toast({
        title: "Kommentar borttagen",
        description: "Din kommentar har tagits bort",
      });
      // Optimistically decrement the displayed count
      setDisplayedCount(prev => prev - 1);
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Kunde inte ta bort kommentaren",
        variant: "destructive",
      });
    }
    setOpenCommentMenu(null);
  };

  if (!showCommentForm) {
    return (
      <div className="flex items-center gap-1 text-gray-500 text-sm">
        <MessageSquare className="w-4 h-4" />
        <span>{displayedCount} Kommentarer</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`space-y-4 transition-all duration-300 ease-in-out ${showAllComments ? 'max-h-[1000px]' : 'max-h-[200px]'} overflow-hidden`}>
        {comments.map((commentItem) => (
          <div key={commentItem.id} className="flex gap-3 relative">
            <img
              src={commentItem.profiles.avatar_url || "/lovable-uploads/0d20194f-3eb3-4f5f-ba83-44b21f1060ed.png"}
              alt={commentItem.profiles.full_name || "User"}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between">
                <div className="font-medium text-sm">{commentItem.profiles.full_name || "Unknown User"}</div>
                {/* Render three dots only if this comment was sent by the current user */}
                {currentUserId === commentItem.user_id && (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setOpenCommentMenu(commentItem.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {openCommentMenu === commentItem.id && (
                      <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-40">
                        <button
                          onClick={() => handleDeleteComment(commentItem.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Ta bort kommentar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-700">{commentItem.content}</p>
            </div>
          </div>
        ))}
      </div>

      {displayedCount > 2 && (
        <Button
          variant="link"
          onClick={() => setShowAllComments(!showAllComments)}
          className="text-gray-500 hover:text-gray-700"
        >
          {showAllComments ? "Göm" : "Se mer"}
        </Button>
      )}

      <div className="flex gap-3">
        <img
          src={userAvatar || "/lovable-uploads/0d20194f-3eb3-4f5f-ba83-44b21f1060ed.png"}
          alt="Your avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex gap-2">
            <Textarea
              placeholder="Kommentera här..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ height: '40px', minHeight: '0', boxSizing: 'border-box' }}
              className="resize-none"
            />
            <Button
              size="icon"
              onClick={handleSubmitComment}
              className="h-10 bg-[color:var(--ole-green)] border-[color:var(--hover-green)] hover:bg-[color:var(--hover-green)]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
