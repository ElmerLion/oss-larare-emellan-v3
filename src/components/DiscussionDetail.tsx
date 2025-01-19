import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileCard } from "@/components/ProfileCard";
import LatestDiscussions from "@/components/LatestDiscussions";

const DiscussionDetail = () => {
  const { slug } = useParams(); // Get the discussion slug from the URL
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newAnswer, setNewAnswer] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setCurrentUserId(data?.user?.id || null);
      }
    };
    fetchUser();
  }, []);

  // Fetch the discussion and its answers
  const { data: discussion, isLoading, error } = useQuery({
    queryKey: ["discussion", slug],
    queryFn: async () => {
      if (!slug) {
        throw new Error("Slug is undefined");
      }

      const { data, error } = await supabase
        .from("discussions")
        .select(`
          slug,
          question,
          description,
          answers (
            id,
            content,
            created_at,
            user_id,
            user:profiles(
              full_name,
              avatar_url
            )
          )
        `)
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug, // Only execute the query if slug is defined
  });

  // Fetch the latest discussions
  const { data: latestDiscussions } = useQuery({
    queryKey: ["latest-discussions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discussions")
        .select("slug, question")
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) throw error;
      return data || [];
    },
  });

  // Mutation to add a new answer
  const addAnswerMutation = useMutation({
    mutationFn: async () => {
      if (!currentUserId) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("answers")
        .insert({
          discussion_slug: slug, // Use the actual slug
          content: newAnswer,
          user_id: currentUserId, // Link the answer to the current user
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["discussion", slug]);
      setNewAnswer("");
    },
  });

  const handleAddAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;
    addAnswerMutation.mutate();
  };

  if (isLoading) return <p>Laddar diskussion...</p>;
  if (error) return <p>Något gick fel: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />

      <main className="pl-64 pt-16">
        <div className="max-w-[1500px] mx-auto px-6 py-8 grid grid-cols-3 gap-8">
          <div className="col-span-2">
            {/* Discussion Question and Description */}
            <h1 className="text-2xl font-semibold mb-2">{discussion?.question}</h1>
            <p className="text-gray-700 mb-8">{discussion?.description}</p>

            {/* Display answers */}
            <div className="space-y-4">
              {discussion?.answers?.length > 0 ? (
                discussion.answers.map((answer) => (
                  <div
                    key={answer.id}
                    className="bg-white p-4 rounded-md border border-gray-200 flex gap-4"
                  >
                    <img
                      src={answer.user?.avatar_url || "/default-avatar.png"}
                      alt={answer.user?.full_name || "User"}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{answer.user?.full_name || "Okänd användare"}</p>
                      <p className="text-gray-700">{answer.content}</p>
                      <p className="text-sm text-gray-400">
                        Svarat {new Date(answer.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Inga svar ännu. Var först att svara!</p>
              )}
            </div>

            {/* Form to add a new answer */}
            <form onSubmit={handleAddAnswer} className="mt-8 space-y-4">
              <textarea
                value={newAnswer}
                onChange={(e) => {
                  setNewAnswer(e.target.value);
                  e.target.style.height = "auto"; // Reset height
                  e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height based on scroll height
                }}
                placeholder="Skriv ditt svar här..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[color:var(--ole-green)]"
                rows={1} // Initial number of rows
                required
              />
              <Button
                type="submit"
                className="w-full bg-[color:var(--ole-green)] text-white"
              >
                Svara
              </Button>
            </form>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ProfileCard />

            {/* Latest Discussions */}
            <LatestDiscussions />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DiscussionDetail;
