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
import { MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";

const DiscussionDetail = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const [newAnswer, setNewAnswer] = useState("");
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [answerMenuOpen, setAnswerMenuOpen] = useState<string | null>(null);

    useEffect(() => {
        const handleDocumentClick = () => {
            setAnswerMenuOpen(null);
        };
        document.addEventListener("click", handleDocumentClick);
        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, []);

    // Delete answer function
    const deleteAnswer = async (answerId: string) => {
        const { error } = await supabase
            .from("answers")
            .delete()
            .eq("id", answerId);
        if (error) {
            toast.error("Ett problem uppstod. Försök igen.");
            console.error("Error deleting answer:", error);
        } else {
            toast.success("Svaret har raderats.");
            setAnswerMenuOpen(null);
            queryClient.invalidateQueries(["discussion", slug]);
        }
    };

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

  // Fetch discussion and answers, including tags
  const { data: discussion, isLoading, error } = useQuery({
    queryKey: ["discussion", slug],
    queryFn: async () => {
      if (!slug) {
        throw new Error("Slug is undefined");
      }

      const { data: discussion, error: discussionError } = await supabase
        .from("discussions")
        .select(`
          slug,
          question,
          description,
          tags,
          creator:profiles(
            id,
            full_name,
            avatar_url,
            title,
            school
          )
        `)
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
    enabled: !!slug,
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

      {/* Use pl-0 on mobile/tablet and lg:pl-64 on large screens */}
      <main className="pl-0 lg:pl-64">
        {/* Responsive grid: single column on mobile/tablet, 3 columns on large screens */}
        <div className="mx-auto px-6 py-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-1 xl:col-span-2">
            {/* Discussion Header */}
            <h1 className="text-2xl font-semibold mb-2">{discussion?.question}</h1>
                      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{discussion?.description}</p>

            {/* Display tags if available */}
                      {discussion?.tags?.length > 0 && (
                          <div className="mb-8 flex flex-wrap gap-2">
                              {discussion.tags.map((tag: string, index: number) => (
                                  <span
                                      key={index}
                                      className={`px-3 py-1 rounded-full text-xs ${tag === "Veckans Hot Topic"
                                              ? "bg-yellow-400 text-black"
                                              : "bg-[var(--secondary2)] text-white"
                                          }`}
                                  >
                                      {tag}
                                  </span>
                              ))}
                          </div>
                      )}


            {/* Discussion creator */}
            {discussion?.creator && (
              <div className="flex flex-col gap-2 text-gray-600 text-sm mb-8 -mt-2">
                <span>Samtal skapat av</span>
                <MiniProfile
                  id={discussion.creator.id}
                  name={discussion.creator.full_name}
                  avatarUrl={discussion.creator.avatar_url}
                  title={discussion.creator.title}
                  school={discussion.creator.school}
                  size="small"
                />
              </div>
            )}

            {/* Answer Form */}
            <form onSubmit={handleAddAnswer} className="mt-4 mb-4 space-y-4">
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
              <Button
                type="submit"
                className="w-full bg-[color:var(--ole-green)] hover:bg-[color:var(--hover-green)] text-white"
              >
                Svara
              </Button>
            </form>

            {/* Answers Section */}
                      {discussion.answers.length > 0 ? (
                          discussion.answers.map((answer) => (
                              <div
                                  key={answer.id}
                                  className="relative bg-white p-4 mb-4 rounded-md border border-gray-200 flex flex-col gap-4"
                              >
                                  {answer.user_id === currentUserId && (
                                      <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                                          <button
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  setAnswerMenuOpen(answer.id);
                                              }}
                                              className="text-gray-400 hover:text-gray-600"
                                          >
                                              <MoreVertical className="w-5 h-5" />
                                          </button>
                                          {answerMenuOpen === answer.id && (
                                              <div
                                                  className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-[170px]"
                                                  onClick={(e) => e.stopPropagation()}
                                              >
                                                  <button
                                                      onClick={(e) => {
                                                          e.stopPropagation();
                                                          deleteAnswer(answer.id);
                                                      }}
                                                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                  >
                                                      <Trash2 className="mr-2 mb-1 h-4 w-4 inline-block" />
                                                      Ta bort svar
                                                  </button>
                                              </div>
                                          )}
                                      </div>
                                  )}
                                  {/* Mini Profile */}
                                  <div className="flex items-start gap-4">
                                      <MiniProfile
                                          id={answer.user_id}
                                          name={answer.user?.full_name || "Okänd användare"}
                                          avatarUrl={answer.user?.avatar_url}
                                          title={answer.user?.title}
                                          school={answer.user?.school}
                                          created_at={answer.created_at}
                                          size="medium"
                                      />
                                  </div>

                                  {/* Answer Content */}
                                  <div className="mt-2">
                                      <p className="whitespace-pre-wrap text-gray-700">{answer.content}</p>
                                  </div>
                              </div>
                          ))
                      ) : (
                          <p className="text-gray-500">Inga svar ännu. Var först att svara!</p>
                      )}

          </div>

          {/* Sidebar: Only show on large screens */}
          <div className="hidden xl:block space-y-6">
            <ProfileCard />
            <LatestDiscussions />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DiscussionDetail;
