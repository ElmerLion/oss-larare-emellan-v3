import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatePostDialog } from "./CreatePostDialog";
import { Post } from "./Post";
import { useQueryClient } from "@tanstack/react-query";

export function Feed() {
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      // Get the current user (if needed for reactions)
      const { data: { user } } = await supabase.auth.getUser();

      // Query posts with the full author profile, materials and tags.
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:author_id (
            id,
            full_name,
            avatar_url,
            title,
            school
          ),
          post_materials (
            title,
            type
          ),
          post_tags (
            tag
          )
        `)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      // Get reaction and comment counts as needed…
      const postsWithReactions = await Promise.all(
        postsData.map(async (post) => {
          const [{ count: reactionCount }, { count: commentCount }] = await Promise.all([
            supabase
              .from("post_reactions")
              .select("*", { count: "exact", head: true })
              .eq("post_id", post.id),
            supabase
              .from("post_comments")
              .select("*", { count: "exact", head: true })
              .eq("post_id", post.id),
          ]);

          let userReaction = null;
          if (user) {
            const { data: reactionData } = await supabase
              .from("post_reactions")
              .select("reaction")
              .eq("post_id", post.id)
              .eq("user_id", user.id)
              .maybeSingle();
            userReaction = reactionData?.reaction;
          }

          return {
            ...post,
            reaction_count: reactionCount || 0,
            comment_count: commentCount || 0,
            user_reaction: userReaction,
          };
        })
      );

      return postsWithReactions || [];
    },
  });

  return (
    <div className="space-y-6">
      <CreatePostDialog />
      {isLoading ? (
        <div className="text-center py-4">Laddar inlägg...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-4">Inga inlägg hittades</div>
      ) : (
        posts.map((dbPost) => (
          <Post
            key={dbPost.id}
            id={dbPost.id}
            profile={{
              id: dbPost.profiles?.id,
              name: dbPost.profiles?.full_name || "Unknown User",
              avatar: dbPost.profiles?.avatar_url || "/placeholder.svg",
              title: dbPost.profiles?.title || "",
              school: dbPost.profiles?.school || "",
              created_at: dbPost.created_at, // Pass the raw created_at timestamp
            }}
            content={dbPost.content}
            reactions={dbPost.reaction_count}
            comments={dbPost.comment_count}
            materials={dbPost.post_materials}
            tags={dbPost.post_tags?.map((t) => t.tag)}
            userReaction={dbPost.user_reaction}
          />
        ))
      )}
    </div>
  );
}
