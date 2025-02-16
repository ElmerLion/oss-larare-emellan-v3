// src/components/Feed.tsx
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { Post } from "@/components/Post";
import { toast } from "sonner";

export function Feed() {
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      // Get the current user (if needed for reactions)
      const { data: { user } } = await supabase.auth.getUser();

      // Query posts with the full author profile, joined resource data, and tags.
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
          resources:post_materials (
            resource:resources (
              id,
              title,
              description,
              subject,
              grade,
              type,
              difficulty,
              file_path,
              file_name,
              author_id,
              subject_level,
              downloads
            )
          ),
          post_tags (
            tag
          )
        `)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      // For each post, flatten the joined resources and filter out any null values.
      const postsWithReactions = await Promise.all(
        postsData.map(async (post: any) => {
          // Get counts for reactions and comments.
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

          // Flatten the joined resources (if any) and filter out nulls.
          const materials =
            (post.resources || [])
              .map((item: any) => item.resource)
              .filter((resource: any) => resource != null) || [];

          return {
            ...post,
            reaction_count: reactionCount || 0,
            comment_count: commentCount || 0,
            user_reaction: userReaction,
            materials,
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
              created_at: dbPost.created_at,
            }}
            content={dbPost.content}
            reactions={dbPost.reaction_count}
            comments={dbPost.comment_count}
            tags={dbPost.post_tags?.map((t: any) => t.tag)}
            materials={dbPost.materials}
            userReaction={dbPost.user_reaction}
          />
        ))
      )}
    </div>
  );
}

export default Feed;
