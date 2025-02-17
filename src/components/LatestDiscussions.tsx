import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      // Remove curly braces if they exist and split by comma
      const trimmed = profile.interests.replace(/[\{\}]/g, '');
      interestsArray = trimmed.split(",").map((s) => s.trim());
    }
  }
  // Format as a Postgres array literal, e.g. "{Matematik,Naturvetenskap,...}"
  const formattedInterests = `{${interestsArray.join(",")}}`;
  console.log("Formatted interests:", formattedInterests);

  const {
    data: latestDiscussions,
    isLoading: discussionsLoading,
    error: discussionsError,
  } = useQuery({
    queryKey: ["latest-discussions", interestsArray],
    queryFn: async () => {
      // If we have interests, try fetching discussions that overlap with them.
      if (interestsArray.length > 0) {
        const { data, error } = await supabase
          .from("discussions")
          .select("slug, question")
          .filter("tags", "ov", formattedInterests)
          .order("created_at", { ascending: false })
          .limit(4);
        if (error) throw error;
        if (data && data.length > 0) return data;
      }
      // Fallback: get the latest discussions overall
      const { data, error } = await supabase
        .from("discussions")
        .select("slug, question")
        .order("created_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data || [];
    },
    enabled: !profileLoading, // Only run when profile is loaded.
  });

  if (profileLoading || discussionsLoading) {
    return <p className="text-sm text-gray-500">Laddar senaste samtalen...</p>;
  }

  if (profileError || discussionsError) {
    console.error("Profile error:", profileError);
    console.error("Discussions error:", discussionsError);
    return <p className="text-sm text-gray-500">Kunde inte hämta samtal.</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="font-semibold mb-4">Senaste Samtalen</h2>
      <div className="space-y-2">
        {latestDiscussions?.length > 0 ? (
          latestDiscussions.map((discussion: any) => (
            <a
              key={discussion.slug}
              href={`/forum/${discussion.slug}`}
              className="block text-sm text-gray-600 hover:text-sage-500"
            >
              {discussion.question}
            </a>
          ))
        ) : (
          <p className="text-sm text-gray-500">Inga samtal ännu.</p>
        )}
      </div>
    </div>
  );
};

export default LatestDiscussions;
