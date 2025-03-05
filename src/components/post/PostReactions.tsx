import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Database } from "@/integrations/supabase/types";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti"; // Import confetti library

type ReactionType = Database["public"]["Enums"]["reaction_type"];

const reactionEmojis: Record<ReactionType, { emoji: string; label: string }> = {
  inspiring: { emoji: "✨", label: "Inspirerande" },
  creative: { emoji: "🎨", label: "Kreativt" },
  helpful: { emoji: "🛠️", label: "Hjälpsamt" },
  insightful: { emoji: "💡", label: "Insiktsfullt" },
  encouraging: { emoji: "🌟", label: "Uppmuntrande" },
  innovative: { emoji: "🚀", label: "Innovativt" },
  fun: { emoji: "🎉", label: "Roligt" },
};

interface PostReactionsProps {
  postId: string;
  reactions: number;
  userReaction: ReactionType | null;
  compact?: boolean;
}

export function PostReactions({
  postId,
  reactions: initialReactions,
  userReaction: initialUserReaction,
  compact = false,
}: PostReactionsProps) {
  const [userReaction, setUserReaction] = useState<ReactionType | null>(
    initialUserReaction || null
  );
  const [reactionCount, setReactionCount] = useState(initialReactions);
  const { toast } = useToast();
  const reactionButtonRef = useRef<HTMLButtonElement>(null);

  // Fetch the current reaction count on mount
  useEffect(() => {
    async function fetchReactionCount() {
      const { count, error } = await supabase
        .from("post_reactions")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);
      if (error) {
        console.error("Error fetching initial reaction count:", error);
      } else {
        setReactionCount(count || 0);
      }
    }
    fetchReactionCount();
  }, [postId]);

  // Fetch the current user's reaction on mount (or when postId changes)
  useEffect(() => {
    async function fetchUserReaction() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from("post_reactions")
        .select("reaction")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single();
      if (error && error.code !== "PGRST116") {
        // PGRST116 indicates no rows found.
        console.error("Error fetching user reaction:", error);
      } else if (data && data.reaction) {
        setUserReaction(data.reaction);
      }
    }
    fetchUserReaction();
  }, [postId]);

  // Listen for realtime changes to update reaction count
  useEffect(() => {
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "post_reactions",
          filter: `post_id=eq.${postId}`,
        },
        async () => {
          const { count } = await supabase
            .from("post_reactions")
            .select("*", { count: "exact", head: true })
            .eq("post_id", postId);
          setReactionCount(count || 0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

const handleReaction = async (reactionType: ReactionType) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "Du måste vara inloggad för att reagera på inlägg!",
        variant: "destructive",
      });
      return;
    }

    if (userReaction === reactionType) {
      // Remove reaction if the same reaction is clicked
      const { error } = await supabase
        .from("post_reactions")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      if (error) throw error;

      setUserReaction(null);
      setReactionCount((prev) => Math.max(0, prev - 1));
    } else {
      // Upsert the reaction to update it if it exists or insert if it doesn't.
      const { error } = await supabase
        .from("post_reactions")
        .upsert(
          {
            post_id: postId,
            user_id: user.id,
            reaction: reactionType,
          },
          { onConflict: ["post_id", "user_id"] }
        );

      if (error) throw error;

      // If there was no previous reaction, increment the count.
      if (!userReaction) {
        setReactionCount((prev) => prev + 1);
      }
      // Otherwise, if changing reaction, count remains unchanged.
      setUserReaction(reactionType);

      // Trigger confetti effect
      if (reactionButtonRef.current) {
        const rect = reactionButtonRef.current.getBoundingClientRect();
        confetti({
          particleCount: 20,
          spread: 80,
          startVelocity: 15,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight,
          },
        });
      }
    }
  } catch (error) {
    console.error("Problem med att hantera reaktion:", error);
    toast({
      title: "Error",
      description: "Failed to update reaction",
      variant: "destructive",
    });
  }
};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          ref={reactionButtonRef}
          className={`flex items-center gap-1 text-gray-500 hover:text-gray-700 ${
            compact ? "p-0 h-auto" : ""
          }`}
        >
          {userReaction ? (
            <span className={`${compact ? "text-base" : "text-xl"}`}>
              {reactionEmojis[userReaction].emoji}
            </span>
          ) : (
            <ThumbsUp className={`${compact ? "w-3 h-3" : "w-4 h-4"}`} />
          )}
          <span>
            {reactionCount}{" "}
            <span className="hidden sm:inline">Reaktioner</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {(
          Object.entries(reactionEmojis) as [
            ReactionType,
            { emoji: string; label: string }
          ][]
        ).map(([key, { emoji, label }]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handleReaction(key)}
            className={`flex items-center gap-2 cursor-pointer ${
              userReaction === key ? "bg-gray-100" : ""
            }`}
          >
            <span className="text-xl">{emoji}</span>
            <span>{label}</span>
            {userReaction === key && (
              <span className="ml-2 text-sm text-gray-500">
                (Klicka för att ta bort)
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
