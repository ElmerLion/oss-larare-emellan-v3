import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatePostDialog } from "./CreatePostDialog";
import { Post } from "./Post";

const PLACEHOLDER_POSTS = [
  {
    id: 1,
    author: {
      name: "Elmer Almer Ershagen",
      avatar: "/lovable-uploads/0d20194f-3eb3-4f5f-ba83-44b21f1060ed.png",
      timeAgo: "5 min sen",
    },
    content: "Hej allihopa! Jag är en nyexaminerad lärare som vill lära mig så mycket som möjligt och dela med mig av mina kunskaper och jag hoppas kunna göra det här!",
    reactions: 40,
    comments: 12,
  },
  {
    id: 2,
    author: {
      name: "Amanda Gunnarsson Nial",
      avatar: "/lovable-uploads/360aff04-e122-43cf-87b2-bad362e840e6.png",
      timeAgo: "20 min sen",
    },
    content: "Hej! Jag har precis haft en lektion där jag försökte få mina elever att ha roligt med matten. De uppskattade det mycket. Jag delar materialet nedanför!",
    reactions: 98,
    comments: 43,
    tags: ["Lätt", "Matematik", "Årskurs 3"],
    materials: [
      {
        title: "Rolig matematik - Lektion 1",
        type: "pdf",
      }
    ]
  },
  {
    id: 3,
    author: {
      name: "Maria Larsson",
      avatar: "/lovable-uploads/23886c31-4d07-445c-bf13-eee4b2127d40.png",
      timeAgo: "1 timme sen",
    },
    content: "Har någon tips på bra övningar för att lära ut svenska som andraspråk? Jag har en grupp elever som kämpar med grundläggande grammatik.",
    reactions: 15,
    comments: 8,
    tags: ["Svenska som andraspråk", "Grammatik"],
  },
  {
    id: 4,
    author: {
      name: "Johan Andersson",
      avatar: "/lovable-uploads/528dd7e5-5612-42d0-975c-7bbf91b02672.png",
      timeAgo: "2 timmar sen",
    },
    content: "Delar med mig av min presentation om hållbar utveckling. Perfekt för gymnasieelever som läser naturkunskap!",
    reactions: 67,
    comments: 23,
    tags: ["Naturkunskap", "Gymnasiet", "Hållbarhet"],
    materials: [
      {
        title: "Hållbar utveckling - Presentation",
        type: "pptx",
      }
    ]
  }
];

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
      
      {PLACEHOLDER_POSTS.map((post) => (
        <Post key={post.id} {...post} />
      ))}

      {posts?.map((dbPost) => (
        <Post
          key={dbPost.id}
          id={dbPost.id}
          author={{
            name: "Elmer Almer Ershagen",
            avatar: "/lovable-uploads/0d20194f-3eb3-4f5f-ba83-44b21f1060ed.png",
            timeAgo: "Just nu",
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
