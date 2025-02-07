import { MessageSquare, Send, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MiniProfile from "@/components/profile/MiniProfile";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    title?: string | null;
    school?: string | null;
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

  // Query for comments. Now select title and school from the profiles.
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
            avatar_url,
            title,
            school
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

      // Create an optimistic new comment object
      const newComment: Comment = {
        id: 'temp-' + Date.now(), // temporary id
        content: comment,
        created_at: new Date().toISOString(),
        user_id: user.id,
        profiles: {
          full_name: user.email, // fallback; ideally use the user's full name from profile
          avatar_url: userAvatar || "/placeholder.svg",
          // title and school could also be fetched if available; otherwise, they might be undefined
        }
      };

      // Optimistically update the comments query cache
      queryClient.setQueryData<Comment[]>(['comments', postId, showAllComments], (old) =>
        old ? [newComment, ...old] : [newComment]
      );

      // Increment the displayed comment count
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

      // Refetch comments to get actual comment IDs from the backend
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
      <div className={`space-y-4 transition-all duration-300 ease-in-out ${showAllComments ? 'max-h-[1000px]' : 'max-h-[110px]'} overflow-hidden`}>
        {comments.map((commentItem) => {
          const timeAgo = formatDistanceToNow(new Date(commentItem.created_at), { addSuffix: true });
          return (
            <div key={commentItem.id} className="relative border border-gray-200 rounded-lg p-3">
              <div className="flex flex-col">
                {/* MiniProfile on top (vertical layout) */}
                <MiniProfile
                  id={commentItem.user_id}
                  name={commentItem.profiles.full_name || "Unknown User"}
                  avatarUrl={commentItem.profiles.avatar_url || "/placeholder.svg"}
                  title={commentItem.profiles.title}
                  school={commentItem.profiles.school}
                  timeAgo={timeAgo}
                  size="small"
                />
                {/* Comment content below the MiniProfile */}
                <div className="mt-3">
                  <p className="mx-10 text-sm text-gray-700">{commentItem.content}</p>
                </div>
              </div>
              {currentUserId === commentItem.user_id && (
                <div className="absolute top-2 right-2" ref={menuRef}>
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
          );
        })}
      </div>

      {displayedCount > 1 && (
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
          src={userAvatar || "/placeholder.svg"}
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
