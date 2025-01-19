import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const LatestDiscussions = () => {
  // Fetch the latest 4 discussions
  const { data: latestDiscussions, isLoading, error } = useQuery({
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

  if (isLoading) {
    return <p className="text-sm text-gray-500">Laddar senaste diskussioner...</p>;
  }

  if (error) {
    return <p className="text-sm text-gray-500">Kunde inte hämta diskussioner.</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="font-semibold mb-4">Senaste Diskussioner</h2>
      <div className="space-y-2">
        {latestDiscussions?.length > 0 ? (
          latestDiscussions.map((discussion) => (
            <a
              key={discussion.slug}
              href={`/diskussioner/${discussion.slug}`}
              className="block text-sm text-gray-600 hover:text-sage-500"
            >
              {discussion.question}
            </a>
          ))
        ) : (
          <p className="text-sm text-gray-500">Inga diskussioner ännu.</p>
        )}
      </div>
    </div>
  );
};

export default LatestDiscussions;
