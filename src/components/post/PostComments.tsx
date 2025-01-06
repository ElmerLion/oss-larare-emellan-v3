import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface PostCommentsProps {
  postId: string | number;
  totalComments: number;
}

export function PostComments({ postId, totalComments }: PostCommentsProps) {
  const [comment, setComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUserAvatar = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
        setUserAvatar(data?.avatar_url);
      }
    };
    fetchUserAvatar();
  }, []);

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', postId, showAllComments],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          *,
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

  // Subscribe to real-time updates for comments
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

      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId.toString(),
          user_id: user.id,
          content: comment,
        });

      if (error) throw error;

      setComment("");
      
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 text-gray-500 text-sm">
        <MessageSquare className="w-4 h-4" />
        <span>{totalComments} Kommentarer</span>
      </div>

      {/* Fixed height container for comments */}
      <div className={`space-y-4 transition-all duration-300 ease-in-out ${showAllComments ? 'max-h-[1000px]' : 'max-h-[200px]'} overflow-hidden`}>
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <img
              src={comment.profiles.avatar_url || "/lovable-uploads/0d20194f-3eb3-4f5f-ba83-44b21f1060ed.png"}
              alt={comment.profiles.full_name || "User"}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 bg-gray-50 rounded-lg p-3">
              <div className="font-medium text-sm">{comment.profiles.full_name || "Unknown User"}</div>
              <p className="text-sm text-gray-700">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      {totalComments > 2 && (
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