import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import MiniProfile from "@/components/profile/MiniProfile";
import { MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DiscussionsListProps {
  currentUserId: string | null;
}

const DiscussionsList = ({ currentUserId }: DiscussionsListProps) => {
  const queryClient = useQueryClient();
  // Using slug as the unique key for open menu
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Global click listener to close menu when clicking outside
  useEffect(() => {
    const handleDocumentClick = () => {
      setMenuOpen(null);
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const LIMIT = 20;
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["discussions"],
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await supabase
        .from("discussions")
        .select(`
          slug,
          question,
          description,
          creator_id,
          tags,
          created_at,
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
        .order("created_at", { ascending: false })
        .range(pageParam, pageParam + LIMIT - 1);
      if (error) throw error;
      return {
        discussions: data || [],
        nextPage: data && data.length === LIMIT ? pageParam + LIMIT : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  // Combine all pages into one list of discussions.
  const allDiscussions = data?.pages.flatMap((page) => page.discussions) || [];

  // Identify the hot topic discussion (if any) and separate the rest.
  let hotDiscussion: any = null;
  let remainingDiscussions: any[] = [];
  if (allDiscussions && allDiscussions.length > 0) {
    const hotTopics = allDiscussions.filter((d: any) =>
      d.tags?.includes("Veckans Hot Topic")
    );
    if (hotTopics.length > 0) {
      hotDiscussion = hotTopics.sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];
    }
    remainingDiscussions = allDiscussions.filter(
      (d: any) => d.slug !== hotDiscussion?.slug
    );
  }

  // Helper to render a discussion card; accepts an extraClass for special styling.
  const renderDiscussionCard = (discussion: any, extraClass = "") => {
    const latestAnswer =
      discussion.latest_answers?.[discussion.latest_answers.length - 1];
    const isOwner = discussion.creator_id === currentUserId;

    // Collect distinct users from answers (plus the creator)
    const answerUsers = discussion.latest_answers
      ? new Map(
          discussion.latest_answers.map((answer: any) => [
            answer.user_id,
            answer.user,
          ])
        )
      : new Map();
    if (discussion.creator) {
      answerUsers.set(discussion.creator.id, discussion.creator);
    }
    const distinctUsers = Array.from(answerUsers.values());

    // Build text to show who is discussing
    let discussionText = "";
    if (distinctUsers.length > 0) {
      const firstName = distinctUsers[0]?.full_name?.split(" ")[0] || "";
      discussionText =
        distinctUsers.length > 1
          ? `${firstName} och ${distinctUsers.length - 1} fler skriver om detta`
          : `${firstName} skriver om detta`;
    }

    return (
      <div
        key={discussion.slug}
        className={`bg-white p-6 rounded-lg shadow-sm border ${extraClass} relative`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {isOwner && (
          <div
            className="absolute top-3 right-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(
                  menuOpen === discussion.slug ? null : discussion.slug
                );
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {menuOpen === discussion.slug && (
              <div
                className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-[170px]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDiscussion(discussion.slug);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <Trash2 className="mr-2 mb-1 h-4 w-4 inline-block" />
                  Ta bort samtal
                </button>
              </div>
            )}
          </div>
        )}
        <a
          href={`/forum/${discussion.slug}`}
          className="text-xl font-semibold text-gray-800 hover:text-[color:var(--hover-green)]"
          onClick={(e) => e.stopPropagation()}
        >
          {discussion.question}{" "}
          {extraClass && <span role="img" aria-label="hot">🔥</span>}
        </a>
            <p className="text-gray-700 mt-2 whitespace-pre-wrap">{discussion.description}</p>
        {discussion.tags?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {discussion.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-xs ${
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
                            <p className="whitespace-pre-wrap text-gray-700 line-clamp-2">
                  {latestAnswer.content}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Inga svar ännu.</p>
          )}
        </div>
        <div className="mt-4">
          <Button
            variant="link"
            className="text-white hover:bg-[color:var(--hover-secondary2)] bg-[color:var(--secondary2)] w-full no-underline hover:no-underline"
            onClick={() =>
              (window.location.href = `/forum/${discussion.slug}`)
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
  };

  // Delete discussion by slug
  const deleteDiscussion = async (discussionSlug: string) => {
    console.log("Deleting discussion:", discussionSlug);
    const { error } = await supabase
      .from("discussions")
      .delete()
      .eq("slug", discussionSlug);
    if (error) {
      toast.error("Ett problem uppstod. Försök igen.");
      console.error("Error deleting discussion:", error);
    } else {
      toast.success("Samtalet har raderats.");
      setMenuOpen(null);
      queryClient.invalidateQueries(["discussions"]);
    }
  };

  return (
    <div className="space-y-6">
      {hotDiscussion && renderDiscussionCard(hotDiscussion, "border-2 border-yellow-400")}
      {remainingDiscussions.map((discussion: any) =>
        renderDiscussionCard(discussion)
      )}
      {hasNextPage && (
        <div className="text-center">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "Laddar..." : "Ladda fler samtal"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DiscussionsList;
