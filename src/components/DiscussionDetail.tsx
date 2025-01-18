import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const DiscussionDetail = () => {
  const { slug } = useParams(); // Get the discussion slug from the URL
  const queryClient = useQueryClient();
  const [newAnswer, setNewAnswer] = useState("");

  // Fetch the discussion and its answers
  const { data: discussion, isLoading } = useQuery({
    queryKey: ["discussion", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discussions")
        .select(`
          question,
          answers (
            id,
            content,
            created_at
          )
        `)
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const addAnswerMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("answers")
        .insert({
          discussion_slug: "example-discussion-slug", // Replace with actual slug
          content: "This is an answer.",
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold mb-4">{discussion?.question}</h1>
        {/* Display answers */}
        <div className="space-y-4">
          {discussion?.answers?.length > 0 ? (
            discussion.answers.map((answer) => (
              <div
                key={answer.id}
                className="bg-white p-4 rounded-md border border-gray-200"
              >
                <p className="text-gray-700">{answer.content}</p>
                <p className="text-sm text-gray-400">
                  Svarat {new Date(answer.created_at).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Inga svar ännu. Var först att svara!</p>
          )}
        </div>
        {/* Form to add a new answer */}
        <form onSubmit={handleAddAnswer} className="mt-8 space-y-4">
          <Input
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Skriv ditt svar här..."
            className="w-full"
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
    </div>
  );
};

export default DiscussionDetail;
