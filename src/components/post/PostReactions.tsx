import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Database } from "@/integrations/supabase/types";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

export function PostReactions({ postId, reactions: initialReactions, userReaction: initialUserReaction, compact = false }: PostReactionsProps) {
  const [userReaction, setUserReaction] = useState<ReactionType | null>(initialUserReaction || null);
  const [reactionCount, setReactionCount] = useState(initialReactions);
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_reactions',
          filter: `post_id=eq.${postId}`
        },
        async () => {
          // Update reaction count
          const { count } = await supabase
            .from('post_reactions')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', postId);
          
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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Error",
            description: "Du måste vara inloggad för att reagera på inlägg!",
            variant: "destructive",
          });
          return;
        }

        if (userReaction === reactionType) {
          // Remove reaction
          const { error } = await supabase
            .from("post_reactions")
            .delete()
            .eq("post_id", postId)
            .eq("user_id", user.id);

          if (error) throw error;

          setUserReaction(null);
          setReactionCount((prev) => Math.max(0, prev - 1)); // Decrement reaction count
        } else {
          if (userReaction) {
            // Remove existing reaction first
            await supabase
              .from("post_reactions")
              .delete()
              .eq("post_id", postId)
              .eq("user_id", user.id);
            setReactionCount((prev) => Math.max(0, prev - 1)); // Decrement reaction count
          }

          // Add new reaction
          const { error } = await supabase
            .from("post_reactions")
            .insert({
              post_id: postId,
              user_id: user.id,
              reaction: reactionType,
            });

          if (error) throw error;

          setUserReaction(reactionType);
          setReactionCount((prev) => prev + 1); // Increment reaction count
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
          className={`flex items-center gap-1 text-gray-500 hover:text-gray-700 ${compact ? 'p-0 h-auto' : ''}`}
        >
          {userReaction ? (
            <span className={`${compact ? 'text-base' : 'text-xl'}`}>{reactionEmojis[userReaction].emoji}</span>
          ) : (
            <ThumbsUp className={`${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
          )}
          <span>
            {reactionCount} <span className="hidden sm:inline">Reaktioner</span>
          </span>
        </Button>

      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {(Object.entries(reactionEmojis) as [ReactionType, { emoji: string; label: string }][]).map(([key, { emoji, label }]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handleReaction(key)}
            className={`flex items-center gap-2 cursor-pointer ${userReaction === key ? 'bg-gray-100' : ''}`}
          >
            <span className="text-xl">{emoji}</span>
            <span>{label}</span>
            {userReaction === key && <span className="ml-2 text-sm text-gray-500">(Klicka för att ta bort)</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}