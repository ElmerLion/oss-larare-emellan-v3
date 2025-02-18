import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const LatestDiscussions = () => {
  // Query to get the current user's profile (and interests)
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["current-profile"],
    queryFn: async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        throw new Error("User not authenticated");
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("interests")
        .eq("id", authData.user.id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Convert profile.interests to a proper JavaScript array
  let interestsArray: string[] = [];
  if (profile && profile.interests) {
    if (Array.isArray(profile.interests)) {
      interestsArray = profile.interests;
    } else if (typeof profile.interests === "string") {
      const trimmed = profile.interests.replace(/[\{\}]/g, "");
      interestsArray = trimmed.split(",").map((s) => s.trim());
    }
  }
  // Format as a Postgres array literal, e.g. "{Matematik,Naturvetenskap,...}"
  const formattedInterests = `{${interestsArray.join(",")}}`;

  const {
    data: latestDiscussions,
    isLoading: discussionsLoading,
    error: discussionsError,
  } = useQuery({
    queryKey: ["latest-discussions", interestsArray],
    queryFn: async () => {
      // Include created_at in the select so we can sort by it.
      if (interestsArray.length > 0) {
        const { data, error } = await supabase
          .from("discussions")
          .select("slug, question, tags, created_at")
          .filter("tags", "ov", formattedInterests)
          .order("created_at", { ascending: false })
          .limit(4);
        if (error) throw error;
        if (data && data.length > 0) return data;
      }
      // Fallback: get the latest discussions overall
      const { data, error } = await supabase
        .from("discussions")
        .select("slug, question, tags, created_at")
        .order("created_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data || [];
    },
    enabled: !profileLoading,
  });

  if (profileLoading || discussionsLoading) {
    return <p className="text-sm text-gray-500">Laddar senaste samtalen...</p>;
  }

  if (profileError || discussionsError) {
    console.error("Profile error:", profileError);
    console.error("Discussions error:", discussionsError);
    return <p className="text-sm text-gray-500">Kunde inte hämta samtal.</p>;
  }

  // Process discussions: move the most recently created hot topic discussion (if any) to the top.
  let finalDiscussions = [];
  if (latestDiscussions) {
    const hotTopics = latestDiscussions.filter((d: any) =>
      d.tags?.includes("Veckans Hot Topic")
    );
    if (hotTopics.length > 0) {
      // Sort hot topics by created_at descending (most recent first)
      const sortedHotTopics = hotTopics.sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const latestHotTopic = sortedHotTopics[0];
      const others = latestDiscussions.filter(
        (d: any) => d.slug !== latestHotTopic.slug
      );
      finalDiscussions = [latestHotTopic, ...others];
    } else {
      finalDiscussions = latestDiscussions;
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="font-semibold mb-2">Senaste Samtalen</h2>
      <div className="space-y-4">
        {finalDiscussions?.length > 0 ? (
          finalDiscussions.map((discussion: any) => (
            <div key={discussion.slug}>
              <a
                href={`/forum/${discussion.slug}`}
                className="block text-sm text-gray-600 hover:text-sage-500"
              >
                {discussion.question}
              </a>
              {discussion.tags && discussion.tags.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {discussion.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className={`text-xs px-1 py-0.5 rounded ${
                        tag === "Veckans Hot Topic"
                          ? "bg-yellow-400 text-black"
                          : "bg-[var(--secondary2)] text-white"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Inga samtal ännu.</p>
        )}
      </div>
    </div>
  );
};

export default LatestDiscussions;
