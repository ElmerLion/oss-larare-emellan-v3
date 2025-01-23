import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileCard } from "@/components/ProfileCard";
import LatestDiscussions from "@/components/LatestDiscussions";
import MiniProfile from "@/components/profile/MiniProfile";
import { formatDistanceToNow } from "date-fns";

const DiscussionDetail = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const [newAnswer, setNewAnswer] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch current user ID
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

  // Fetch discussion and answers
  const { data: discussion, isLoading, error } = useQuery({
    queryKey: ["discussion", slug],
    queryFn: async () => {
      if (!slug) {
        throw new Error("Slug is undefined");
      }

      const { data: discussion, error: discussionError } = await supabase
        .from("discussions")
        .select("slug, question, description")
        .eq("slug", slug)
        .single();

      if (discussionError) throw discussionError;

      const { data: answers, error: answersError } = await supabase
        .from("answers")
        .select(`
          id,
          content,
          created_at,
          user_id,
          user:profiles(
            full_name,
            avatar_url,
            title,
            school
          )
        `)
        .eq("discussion_slug", slug)
        .order("created_at", { ascending: false }); // Newest answers first

      if (answersError) throw answersError;

      return { ...discussion, answers };
    },
    enabled: !!slug, // Only execute the query if slug is defined
  });

  // Add a new answer
  const addAnswerMutation = useMutation({
    mutationFn: async () => {
      if (!currentUserId) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("answers")
        .insert({
          discussion_slug: slug,
          content: newAnswer,
          user_id: currentUserId,
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

  // Handle loading and error states
  if (isLoading) return <p>Laddar diskussion...</p>;
  if (error) return <p>Något gick fel: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />

      <main className="pl-64">
        <div className="max-w-[1500px] mx-auto px-6 py-8 grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2">
            {/* Discussion Header */}
            <h1 className="text-2xl font-semibold mb-2">{discussion?.question}</h1>
            <p className="text-gray-700 mb-8">{discussion?.description}</p>

            {/* Answer Form */}
            <form onSubmit={handleAddAnswer} className="mt-8 mb-8 space-y-4">
              <textarea
                value={newAnswer}
                onChange={(e) => {
                  setNewAnswer(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                placeholder="Skriv ditt svar här..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[color:var(--ole-green)]"
                rows={1}
                required
              />
              <Button type="submit" className="w-full bg-[color:var(--ole-green)] text-white">
                Svara
              </Button>
            </form>

            {/* Answers Section */}
            {discussion.answers.length > 0 ? (
              discussion.answers.map((answer) => {
                const timeAgo = formatDistanceToNow(new Date(answer.created_at), { addSuffix: true });

                return (
                  <div
                    key={answer.id}
                    className="bg-white p-4 rounded-md border border-gray-200 flex flex-col gap-4"
                  >
                    {/* Mini Profile */}
                    <div className="flex items-start gap-4">
                      <MiniProfile
                        id={answer.user_id}
                        name={answer.user?.full_name || "Okänd användare"}
                        avatarUrl={answer.user?.avatar_url}
                        title={answer.user?.title}
                        school={answer.user?.school}
                        timeAgo={timeAgo}
                        size="medium"
                      />
                    </div>

                    {/* Answer Content */}
                    <div className="mt-2">
                      <p className="text-gray-700">{answer.content}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">Inga svar ännu. Var först att svara!</p>
            )}
            </div>


          {/* Sidebar */}
          <div className="space-y-6">
            <ProfileCard />
            <LatestDiscussions />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DiscussionDetail;
