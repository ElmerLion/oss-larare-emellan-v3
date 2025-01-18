import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { ProfileCard } from "@/components/ProfileCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assume you have a Textarea component

const Diskussioner = () => {
  const queryClient = useQueryClient();
  const [newDiscussion, setNewDiscussion] = useState("");
  const [newDescription, setNewDescription] = useState(""); // State for description
  const [isCreating, setIsCreating] = useState(false);

  const { data: discussions } = useQuery({
    queryKey: ["discussions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discussions")
        .select(`
          slug,
          question,
          description,
          latest_answers:answers(
            discussion_slug,
            content,
            created_at
          )
        `)
        .order("created_at", { ascending: false });

     console.log("Fetched Discussions:", data, "Error:", error);
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

      const { error } = await supabase.from("discussions").insert({
        question: newDiscussion,
        description: newDescription, // Include description in the payload
        slug,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["discussions"]);
      setNewDiscussion("");
      setNewDescription(""); // Reset the description field
      setIsCreating(false);
    },
  });

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscussion.trim() || !newDescription.trim()) return;
    createDiscussionMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />
      <Header />

      <main className="pl-64 pt-16">
        <div className="max-w-[1500px] mx-auto px-6 py-8 grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <h1 className="text-2xl font-semibold mb-2">Diskussioner</h1>
            <p className="text-gray-600 mb-8">
              Utforska pågående diskussioner och delta med dina idéer.
            </p>

            {/* Button to start a new discussion */}
            <div className="mb-8">
              <Button
                className="bg-[color:var(--ole-green)] text-white"
                onClick={() => setIsCreating(!isCreating)}
              >
                {isCreating ? "Avbryt" : "Starta en ny diskussion"}
              </Button>
              {isCreating && (
                <form
                  onSubmit={handleCreateDiscussion}
                  className="mt-4 space-y-4"
                >
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
                    className="w-full bg-[color:var(--ole-green)] text-white"
                  >
                    Skapa
                  </Button>
                </form>
              )}
            </div>

            {/* List of discussions */}
            <div className="space-y-6">
              {discussions?.map((discussion) => (
                <div
                  key={discussion.slug}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                  <a
                    href={`/diskussioner/${discussion.slug}`}
                    className="text-xl font-semibold text-gray-800 hover:text-sage-500"
                  >
                    {discussion.question}
                  </a>
                  <p className="text-gray-700 mt-2">{discussion.description}</p>
                  <div className="space-y-3 mt-4">
                    {discussion.latest_answers?.length > 0 ? (
                      discussion.latest_answers.map((answer) => (
                        <div
                          key={answer.id}
                          className="bg-gray-50 p-4 rounded-md border border-gray-100"
                        >
                          <p className="text-gray-700">{answer.content}</p>
                          <p className="text-sm text-gray-400 mt-2">
                            Svarat {new Date(answer.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">Inga svar ännu.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ProfileCard />

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="font-semibold mb-4">Populära Diskussioner</h2>
              <div className="space-y-2">
                {[...Array(4).keys()].map((index) => (
                  <a
                    key={index}
                    href="#"
                    className="block text-sm text-gray-600 hover:text-sage-500"
                  >
                    Populär diskussion {index + 1}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Diskussioner;
