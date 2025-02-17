import { AppSidebar } from "@/components/AppSidebar";
import { ProfileCard } from "@/components/ProfileCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LatestDiscussions from "@/components/LatestDiscussions";
import { interestsOptions } from "@/types/interestsOptions";
import DiscussionsList from "@/components/discussion/DiscussionList";

const Diskussioner = () => {
  const queryClient = useQueryClient();
  const [newDiscussion, setNewDiscussion] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // States for tags
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

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  // Helper function to generate a unique slug
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

  const createDiscussionMutation = useMutation({
    mutationFn: async () => {
      // Create a base slug from the discussion title
      const baseSlug = newDiscussion
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-");

      // Ensure the slug is unique by appending a number if necessary
      const slug = await generateUniqueSlug(baseSlug);

      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.from("discussions").insert({
        question: newDiscussion,
        description: newDescription,
        slug,
        creator_id: user.user.id,
        tags: tags,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["discussions"]);
      setNewDiscussion("");
      setNewDescription("");
      setTags([]);
      setTagInput("");
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
      <main className="pl-64">
        <div className="max-w-[1500px] mx-auto px-6 py-8 grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <h1 className="text-2xl font-semibold mb-2">Forum</h1>
            <p className="text-gray-600 mb-8">
              Utforska pågående samtal och delta med dina idéer.
            </p>

            {/* Discussion creation form */}
            <div className="mb-8">
              <Button
                className="bg-[color:var(--ole-green)] hover:bg-[color:var(--hover-green)] text-white w-full"
                onClick={() => setIsCreating(!isCreating)}
              >
                {isCreating ? "Avbryt" : "Starta ett nytt samtal"}
              </Button>
              {isCreating && (
                <form onSubmit={handleCreateDiscussion} className="mt-4 space-y-4">
                  <Input
                    value={newDiscussion}
                    onChange={(e) => setNewDiscussion(e.target.value)}
                    placeholder="Skriv din samtalsfråga här"
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
                  {/* Tag input and suggestions */}
                  <div>
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Lägg till en tagg"
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
                    Skapa
                  </Button>
                </form>
              )}
            </div>

            {/* Use the extracted DiscussionsList component */}
            <DiscussionsList currentUserId={currentUserId} />
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
