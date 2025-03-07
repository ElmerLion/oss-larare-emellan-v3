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
  parent_id?: string | null;
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
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
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

  // Query for comments (including parent_id)
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
          parent_id,
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

  // Group comments: top-level (parent_id null) and map replies under them.
  const topLevelComments = comments.filter(c => !c.parent_id);
  const getReplies = (parentId: string) =>
    comments
      .filter(c => c.parent_id === parentId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

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

  // Generic function to handle comment submission (both top-level and reply)
  const handleSubmit = async (parentId?: string) => {
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
      const contentToSubmit = parentId ? replyContent : comment;
      if (!contentToSubmit.trim()) return;

      // Create an optimistic comment object
      const newComment: Comment = {
        id: 'temp-' + Date.now(),
        content: contentToSubmit,
        created_at: new Date().toISOString(),
        user_id: user.id,
        parent_id: parentId || null,
        profiles: {
          full_name: user.email,
          avatar_url: userAvatar || "/placeholder.svg",
        }
      };

      queryClient.setQueryData<Comment[]>(['comments', postId, showAllComments], (old) =>
        old ? [newComment, ...old] : [newComment]
      );
      setDisplayedCount(prev => prev + 1);

      // Insert the comment into the database (include parent_id if replying)
      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: contentToSubmit,
          parent_id: parentId || null,
        });
      if (error) throw error;

      // Clear input fields
      if (parentId) {
        setReplyContent("");
        setReplyTo(null);
      } else {
        setComment("");
      }
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    } catch (error) {
      console.error("Error adding comment:", error);
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
  };

  if (!showCommentForm) {
    return (
      <div className="flex items-center gap-1 text-gray-500 text-sm">
        <MessageSquare className="w-4 h-4" />
        <span>
          {displayedCount} <span className="hidden sm:inline">Kommentarer</span>
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Render top-level comments and their replies */}
      <div className={`space-y-4 transition-all duration-300 ease-in-out ${showAllComments ? 'max-h-[1000px]' : 'sm:max-h-[200px]'} overflow-hidden -mb-4`}>
        {topLevelComments.map((commentItem) => {
          const timeAgo = formatDistanceToNow(new Date(commentItem.created_at), { addSuffix: true });
          const replies = getReplies(commentItem.id);
          return (
            <div key={commentItem.id} className="relative border border-gray-200 rounded-lg p-3">
              <div className="flex flex-col">
                {/* Top-level comment */}
                <MiniProfile
                  id={commentItem.user_id}
                  name={commentItem.profiles.full_name || "Unknown User"}
                  avatarUrl={commentItem.profiles.avatar_url || "/placeholder.svg"}
                  title={commentItem.profiles.title}
                  school={commentItem.profiles.school}
                  created_at={commentItem.created_at}
                  size="small"
                />
                <div className="mt-3">
                          <p className="whitespace-pre-wrap mx-4 sm:mx-10 text-sm text-gray-700">{commentItem.content}</p>
                </div>
                {/* If this comment is top-level, show Reply button */}
                { !commentItem.parent_id && (
                  <div className="mx-4 sm:mx-6">
                    <Button
                      variant="link"
                      onClick={() =>
                        setReplyTo(replyTo === commentItem.id ? null : commentItem.id)
                      }
                      className="text-sm text-[var(--secondary2)]"
                    >
                      {replyTo === commentItem.id ? "Avbryt svar" : "Svara"}
                    </Button>
                  </div>
                )}
                {/* If this comment is being replied to, show reply input */}
                {replyTo === commentItem.id && (
                  <div className="flex items-center ml-4 sm:ml-10 mt-2 mb-2">
                    <Textarea
                      placeholder="Skriv ditt svar..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      style={{ height: '40px', minHeight: '0', boxSizing: 'border-box' }}
                      className="resize-none"
                    />
                    <Button
                      size="icon"
                      onClick={() => handleSubmit(replyTo)}
                      className="ml-2 bg-[var(--ole-green)] hover:bg-[var(--hover-green)] text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {/* Render replies (if any) indented */}
                {replies.length > 0 && (
                  <div className="ml-4 sm:ml-10 space-y-2 border-l border-gray-300 pl-4">
                    {replies.map(reply => {
                      const replyTimeAgo = formatDistanceToNow(new Date(reply.created_at), { addSuffix: true });
                      return (
                        <div key={reply.id} className="relative rounded-lg p-3">
                          <MiniProfile
                            id={reply.user_id}
                            name={reply.profiles.full_name || "Unknown User"}
                            avatarUrl={reply.profiles.avatar_url || "/placeholder.svg"}
                            title={reply.profiles.title}
                            school={reply.profiles.school}
                            created_at={reply.created_at}
                            size="small"
                          />
                          <div className="mt-3">
                            <p className="mx-4 sm:mx-10 text-sm text-gray-700">{reply.content}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
          {showAllComments ? "Göm kommentarer" : "Se mer kommentarer"}
        </Button>
      )}

      {/* Main comment input (for new top-level comment) */}
      <div className="flex gap-3">
        {/* Avatar hidden on phones */}
        <img
          src={userAvatar || "/placeholder.svg"}
          alt="Your avatar"
          className="w-8 h-8 rounded-full object-cover hidden sm:block"
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
              onClick={() => handleSubmit()}
              className="h-10 bg-[var(--ole-green)] border-[var(--hover-green)] hover:bg-[var(--hover-green)]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
