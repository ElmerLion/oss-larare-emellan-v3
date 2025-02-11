import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { ProfileCard } from "@/components/ProfileCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LatestDiscussions from "@/components/LatestDiscussions";
import MiniProfile from "@/components/profile/MiniProfile";
import { MoreVertical, Trash2 } from "lucide-react";

const Diskussioner = () => {
  const queryClient = useQueryClient();
  const [newDiscussion, setNewDiscussion] = useState("");
  const [newDescription, setNewDescription] = useState(""); // State for description
  const [isCreating, setIsCreating] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null); // Menu state
                const menuRef = useRef<HTMLDivElement | null>(null);

                useEffect(() => {
                    const handleClickOutside = (event: MouseEvent) => {
                      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                        setMenuOpen(null);
                      }
                    };
                    document.addEventListener("mousedown", handleClickOutside);
                    return () => document.removeEventListener("mousedown", handleClickOutside);
                  }, [menuOpen]);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  const { data: discussions } = useQuery({
    queryKey: ["discussions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discussions")
        .select(`
          slug,
          question,
          description,
          creator_id,
          creator:profiles(
            id,
            full_name,
            avatar_url,
            title,
            school
          ),
          latest_answers:answers(
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
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const createDiscussionMutation = useMutation({
    mutationFn: async () => {
      const slug = newDiscussion
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-");

      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.from("discussions").insert({
        question: newDiscussion,
        description: newDescription,
        slug,
        creator_id: user.user.id, // ✅ Save the creator_id
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["discussions"]);
      setNewDiscussion("");
      setNewDescription("");
      setIsCreating(false);
    },
  });

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscussion.trim() || !newDescription.trim()) return;
    createDiscussionMutation.mutate();
  };

    const deleteDiscussion = async (discussionId: string) => {
      const { error } = await supabase.from("discussions").delete().eq("id", discussionId);
      if (error) return alert("Error deleting discussion");

      queryClient.invalidateQueries(["discussions"]);
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setMenuOpen(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />

      <main className="pl-64">
        <div className="max-w-[1500px] mx-auto px-6 py-8 grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <h1 className="text-2xl font-semibold mb-2">Diskussioner</h1>
            <p className="text-gray-600 mb-8">
              Utforska pågående diskussioner och delta med dina idéer.
            </p>

            {/* Button to start a new discussion */}
            <div className="mb-8">
              <Button
                className="bg-[color:var(--ole-green)] hover:bg-[color:var(--hover-green)] text-white w-full"
                onClick={() => setIsCreating(!isCreating)}
              >
                {isCreating ? "Avbryt" : "Starta en ny diskussion"}
              </Button>
              {isCreating && (
                <form onSubmit={handleCreateDiscussion} className="mt-4 space-y-4">
                  <Input
                    value={newDiscussion}
                    onChange={(e) => setNewDiscussion(e.target.value)}
                    placeholder="Skriv din diskussionsfråga här"
                    className="w-full"
                    required
                  />
                  <Textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Lägg till en beskrivning eller ditt svar till frågan"
                    className="w-full"
                    rows={4}
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-[color:var(--ole-green)] hover:bg-[color:var(--hover-green)] text-white"
                  >
                    Skapa
                  </Button>
                </form>
              )}
            </div>

            {/* List of discussions */}
            <div className="space-y-6">
              {discussions?.map((discussion) => {
                const latestAnswer = discussion.latest_answers?.[discussion.latest_answers.length - 1];
                const isOwner = discussion.creator_id === currentUserId;

                // Extract users from answers
                const answerUsers = discussion.latest_answers
                  ? new Map(discussion.latest_answers.map((answer: any) => [answer.user_id, answer.user]))
                  : new Map();

                if (discussion.creator) {
                  answerUsers.set(discussion.creator.id, discussion.creator);
                }

                const distinctUsers = Array.from(answerUsers.values());

                // Display text for who is discussing
                let discussionText = "";
                if (distinctUsers.length > 0) {
                  const firstName = distinctUsers[0]?.full_name?.split(" ")[0] || "";
                  discussionText =
                    distinctUsers.length > 1
                      ? `${firstName} och ${distinctUsers.length - 1} fler diskuterar detta`
                      : `${firstName} diskuterar detta`;
                }

                return (
                  <div
                    key={discussion.slug}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 relative"
                  >
                    {/* Three Dots Menu */}
                      {isOwner && (
                        <div ref={menuRef} className="absolute top-3 right-3">
                          <button
                            onClick={() => setMenuOpen(menuOpen === discussion.id ? null : discussion.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {/* Menu Content */}
                          {menuOpen === discussion.id && (
                            <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-[170px]">
                              <button
                                onClick={() => deleteDiscussion(discussion.id)}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                <Trash2 className="mr-2 mb-1 h-4 w-4 inline-block" />
                                Ta bort diskussion
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    <a
                      href={`/diskussioner/${discussion.slug}`}
                      className="text-xl font-semibold text-gray-800 hover:text-[color:var(--hover-green)]"
                    >
                      {discussion.question}
                    </a>
                    <p className="text-gray-700 mt-2">{discussion.description}</p>

                    {/* Latest Answer Display */}
                    <div className="space-y-3 mt-4">
                      {latestAnswer ? (
                        <div
                          key={latestAnswer.id}
                          className="bg-gray-50 p-4 rounded-md border border-gray-100"
                        >
                          <MiniProfile
                            id={latestAnswer.user_id}
                            name={latestAnswer.user?.full_name || "Okänd användare"}
                            avatarUrl={latestAnswer.user?.avatar_url}
                            title={latestAnswer.user?.title}
                            school={latestAnswer.user?.school}
                            created_at={latestAnswer.created_at}
                            size="small"
                          />
                          <div className="mt-4">
                            <p className="text-gray-700 line-clamp-2">{latestAnswer.content}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">Inga svar ännu.</p>
                      )}
                    </div>

                    {/* Display participants */}
                    <div className="mt-4">
                      <Button
                        variant="link"
                        className="text-white hover:bg-[color:var(--hover-secondary2)] bg-[color:var(--secondary2)] w-full no-underline hover:no-underline"
                        onClick={() =>
                          (window.location.href = `/diskussioner/${discussion.slug}`)
                        }
                      >
                        Läs mer
                      </Button>
                      {distinctUsers.length > 0 && (
                        <div className="flex items-center mt-2">
                          <div className="flex -space-x-2">
                            {distinctUsers.slice(0, 3).map((user: any, index: number) => (
                              <img
                                key={index}
                                src={user?.avatar_url || "/placeholder.svg"}
                                alt={user?.full_name || "User"}
                                className="w-8 h-8 rounded-full border-2 border-white"
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {discussionText}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
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

export default Diskussioner;
