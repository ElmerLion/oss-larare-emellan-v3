import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatePostDialog } from "./CreatePostDialog";
import { Post } from "./Post";

export function Feed() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
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

      if (error) throw error;
      return data || [];
    },
  });

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
          reactions={0}
          comments={0}
          materials={dbPost.post_materials}
          tags={dbPost.post_tags?.map(t => t.tag)}
        />
      ))}
    </div>
  );
}
