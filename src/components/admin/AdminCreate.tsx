import React, { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { interestsOptions } from "@/types/interestsOptions";

export function AdminCreate(): JSX.Element {
  const queryClient = useQueryClient();
  const [isCreatingHotTopic, setIsCreatingHotTopic] = useState<boolean>(false);
  const [hotTopicQuestion, setHotTopicQuestion] = useState<string>("");
  const [hotTopicDescription, setHotTopicDescription] = useState<string>("");

  // States for tags similar to the discussion page
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");

  const filteredInterests = tagInput
    ? interestsOptions.filter(
        (interest) =>
          interest.label.toLowerCase().includes(tagInput.toLowerCase()) &&
          !tags.includes(interest.value)
      )
    : [];

  const addTag = (tag: string): void => {
    if (tags.length >= 5) return;
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string): void => {
    setTags(tags.filter((t) => t !== tag));
  };

  // Helper function to generate a unique slug from a base string.
  const generateUniqueSlug = async (baseSlug: string): Promise<string> => {
    let uniqueSlug = baseSlug;
    let suffix = 0;
    while (true) {
      const { data, error } = await supabase
        .from("discussions")
        .select("slug")
        .eq("slug", uniqueSlug)
        .maybeSingle();
      if (error) throw error;
      if (!data) break;
      suffix++;
      uniqueSlug = `${baseSlug}-${suffix}`;
    }
    return uniqueSlug;
  };

  // Mutation for creating a hot topic discussion.
  const createHotTopicMutation = useMutation({
    mutationFn: async () => {
      // Create a base slug from the discussion title.
      const baseSlug = hotTopicQuestion
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-");
      const slug = await generateUniqueSlug(baseSlug);

      // Get the current user.
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }
      const creatorId = user.id;

      // Ensure "Veckans Hot Topic" is the first tag.
      const finalTags = [
        "Veckans Hot Topic",
        ...tags.filter((tag) => tag !== "Veckans Hot Topic"),
      ];

      // Insert the discussion with the current timestamp.
      const { error } = await supabase.from("discussions").insert({
        question: hotTopicQuestion,
        description: hotTopicDescription,
        slug,
        creator_id: creatorId,
        tags: finalTags,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["discussions"]);
      toast.success("Hot topic skapad!");
      setHotTopicQuestion("");
      setHotTopicDescription("");
      setTags([]);
      setTagInput("");
      setIsCreatingHotTopic(false);
    },
    onError: (error: any) => {
      toast({
        title: "Fel vid skapande",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateHotTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotTopicQuestion.trim() || !hotTopicDescription.trim()) return;
    createHotTopicMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />
      {/* Increase left padding to move content further away from the sidebar */}
      <main className="pl-72 p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Skapa</h1>

        {/* Hot Topic Creation Card */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Skapa Veckans Hot Topic</h2>
              <Button
                onClick={() => setIsCreatingHotTopic(!isCreatingHotTopic)}
                className="bg-[color:var(--ole-green)] hover:bg-[color:var(--hover-green)] text-white"
              >
                {isCreatingHotTopic ? "Avbryt" : "Starta"}
              </Button>
            </div>
            {isCreatingHotTopic && (
              <form onSubmit={handleCreateHotTopic} className="space-y-4">
              <p>Genom att skapa en hot topic här så skapas en diskussion automatiskt med taggen "Veckans Hot Topic".</p>
                <Input
                  value={hotTopicQuestion}
                  onChange={(e) => setHotTopicQuestion(e.target.value)}
                  placeholder="Skriv din hot topic fråga här"
                  className="w-full"
                  required
                />
                <Textarea
                  value={hotTopicDescription}
                  onChange={(e) => setHotTopicDescription(e.target.value)}
                  placeholder="Lägg till en beskrivning"
                  className="w-full"
                  rows={4}
                  required
                />
                {/* Tag Input Area */}
                <div>
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Lägg till en tagg (valfritt)"
                    className="w-full"
                  />
                  {tagInput && filteredInterests.length > 0 && (
                    <div className="border rounded mt-1 bg-white shadow-md">
                      {filteredInterests.map((interest, index) => (
                        <div
                          key={index}
                          onClick={() => addTag(interest.value)}
                          className="cursor-pointer hover:bg-gray-100 px-2 py-1"
                        >
                          {interest.label}
                        </div>
                      ))}
                    </div>
                  )}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="flex items-center px-3 py-1 bg-[var(--secondary2)] text-white rounded-full text-xs"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-xs text-white"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[color:var(--ole-green)] hover:bg-[color:var(--hover-green)] text-white"
                >
                  Skapa Hot Topic
                </Button>
              </form>
            )}
          </div>
        </div>


      </main>
    </div>
  );
}

export default AdminCreate;
