import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Database } from "@/integrations/supabase/types";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type ReactionType = Database["public"]["Enums"]["reaction_type"];

const reactionEmojis: Record<ReactionType, { emoji: string; label: string }> = {
  inspiring: { emoji: "✨", label: "Inspiring" },
  creative: { emoji: "🎨", label: "Creative" },
  helpful: { emoji: "🛠️", label: "Helpful" },
  insightful: { emoji: "💡", label: "Insightful" },
  encouraging: { emoji: "🌟", label: "Encouraging" },
  innovative: { emoji: "🚀", label: "Innovative" },
  fun: { emoji: "🎉", label: "Fun" },
};

interface PostReactionsProps {
  postId: string;  // Changed from string | number to just string
  reactions: number;
  userReaction: ReactionType | null;
}

export function PostReactions({ postId, reactions, userReaction: initialUserReaction }: PostReactionsProps) {
  const [userReaction, setUserReaction] = useState<ReactionType | null>(initialUserReaction || null);
  const { toast } = useToast();

  const handleReaction = async (reactionType: ReactionType) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to react to posts",
          variant: "destructive",
        });
        return;
      }

      if (userReaction === reactionType) {
        // Remove reaction
        const { error } = await supabase
          .from('post_reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;
        setUserReaction(null);
      } else {
        // Add or update reaction
        if (userReaction) {
          // Delete existing reaction first
          await supabase
            .from('post_reactions')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', user.id);
        }

        const { error } = await supabase
          .from('post_reactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            reaction: reactionType,
          });

        if (error) throw error;
        setUserReaction(reactionType);
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
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
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
        >
          {userReaction ? (
            <span className="text-xl">{reactionEmojis[userReaction].emoji}</span>
          ) : (
            <ThumbsUp className="w-4 h-4" />
          )}
          <span>{reactions} Reaktioner</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {(Object.entries(reactionEmojis) as [ReactionType, { emoji: string; label: string }][]).map(([key, { emoji, label }]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handleReaction(key)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-xl">{emoji}</span>
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}