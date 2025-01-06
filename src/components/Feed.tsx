import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatePostDialog } from "./CreatePostDialog";
import { Post } from "./Post";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function Feed() {
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // First get all posts with their basic info
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            full_name,
            avatar_url
          ),
          post_materials (
            title,
            type
          ),
          post_tags (
            tag
          )
        `)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Get reaction counts, comment counts and user reactions for each post
      const postsWithReactions = await Promise.all(postsData.map(async (post) => {
        const [{ count: reactionCount }, { count: commentCount }] = await Promise.all([
          supabase
            .from('post_reactions')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id),
          supabase
            .from('post_comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id),
        ]);

        let userReaction = null;
        if (user) {
          const { data: reactionData } = await supabase
            .from('post_reactions')
            .select('reaction')
            .eq('post_id', post.id)
            .eq('user_id', user.id)
            .single();

          userReaction = reactionData?.reaction;
        }

        return {
          ...post,
          reaction_count: reactionCount || 0,
          comment_count: commentCount || 0,
          user_reaction: userReaction,
        };
      }));

      return postsWithReactions || [];
    },
  });

  // Subscribe to changes in post_reactions and post_comments
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_reactions'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_comments'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <div className="space-y-6">
      <CreatePostDialog />
      
      {posts?.map((dbPost) => (
        <Post
          key={dbPost.id}
          id={dbPost.id}
          author={{
            name: dbPost.profiles?.full_name || "Unknown User",
            avatar: dbPost.profiles?.avatar_url || "/lovable-uploads/0d20194f-3eb3-4f5f-ba83-44b21f1060ed.png",
            timeAgo: "Just nu", // You might want to implement proper time ago calculation
          }}
          content={dbPost.content}
          reactions={dbPost.reaction_count}
          comments={dbPost.comment_count}
          materials={dbPost.post_materials}
          tags={dbPost.post_tags?.map(t => t.tag)}
          userReaction={dbPost.user_reaction}
        />
      ))}
    </div>
  );
}