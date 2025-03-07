import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { Post } from "@/components/Post";
import { Button } from "@/components/ui/button";

export function Feed() {
  const LIMIT = 20;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 0 }) => {
      // Get current user for reaction status
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Query posts with pagination using range()
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
        .order("created_at", { ascending: false })
        .range(pageParam, pageParam + LIMIT - 1);

      if (postsError) throw postsError;

      // Flatten resources and fetch reaction/comment counts for each post
      const postsWithReactions = await Promise.all(
        postsData.map(async (post: any) => {
          const [{ count: reactionCount }, { count: commentCount }] =
            await Promise.all([
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

      // If exactly LIMIT posts were fetched, we assume there might be more.
      return {
        posts: postsWithReactions,
        nextPage: postsData.length === LIMIT ? pageParam + LIMIT : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  // Combine pages into one list of posts
  const posts = data?.pages.flatMap((page) => page.posts) || [];

  return (
    <div className="w-full space-y-6">
      <CreatePostDialog />
      {isLoading ? (
        <div className="text-center py-4">Laddar inlägg...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-4">Inga inlägg hittades</div>
      ) : (
        <>
          {posts.map((dbPost) => (
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
          ))}
          {hasNextPage && (
            <div className="text-center">
              <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                {isFetchingNextPage ? "Laddar..." : "Ladda fler inlägg"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Feed;
