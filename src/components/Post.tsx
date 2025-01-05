import { MessageSquare, ThumbsUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostMaterial } from "./PostMaterial";
import { PostTags } from "./PostTags";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type ReactionType = Database['public']['Enums']['reaction_type'];

interface Author {
  name: string;
  avatar: string;
  timeAgo: string;
}

interface Material {
  title: string;
  type: string;
}

interface PostProps {
  id: string | number;
  author: Author;
  content: string;
  reactions: number;
  comments: number;
  tags?: string[];
  materials?: Material[];
  userReaction?: ReactionType | null;
}

const reactionEmojis: Record<ReactionType, { emoji: string; label: string }> = {
  inspiring: { emoji: "✨", label: "Inspiring" },
  creative: { emoji: "🎨", label: "Creative" },
  helpful: { emoji: "🛠️", label: "Helpful" },
  insightful: { emoji: "💡", label: "Insightful" },
  encouraging: { emoji: "🌟", label: "Encouraging" },
  innovative: { emoji: "🚀", label: "Innovative" },
  fun: { emoji: "🎉", label: "Fun" },
};

export function Post({ id, author, content, reactions, comments, tags, materials, userReaction: initialUserReaction }: PostProps) {
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
          .eq('post_id', id)
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
            .eq('post_id', id)
            .eq('user_id', user.id);
        }

        const { error } = await supabase
          .from('post_reactions')
          .insert({
            post_id: id.toString(),
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={author.avatar || "/placeholder.svg"}
            alt={author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{author.name}</h3>
            <p className="text-sm text-gray-500">{author.timeAgo}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      <p className="text-gray-700 mb-4">{content}</p>

      {tags && tags.length > 0 && <PostTags tags={tags} />}
      {materials && materials.length > 0 && <PostMaterial materials={materials} />}

      <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
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
        <div className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          <span>{comments} Kommentarer</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="flex gap-3">
          <img
            src="/lovable-uploads/0d20194f-3eb3-4f5f-ba83-44b21f1060ed.png"
            alt="Your avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex gap-2">
              <Textarea
                placeholder="Kommentera här..."
                style={{ height: '40px', minHeight: '0', boxSizing: 'border-box' }}
                className="resize-none"
              />
              <Button size="icon" className="h-10 bg-[color:var(--ole-green)] border-[color:var(--hover-green)] hover:bg-[color:var(--hover-green)]">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}