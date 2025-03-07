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
import { Link } from "react-router-dom";

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

    // Query to fetch list of users who reacted along with their reaction,
    // ordering by newest (assuming a created_at field exists)
    const [reactionList, setReactionList] = useState<any[]>([]);
    const updateReactionList = async () => {
        const { data, error } = await supabase
            .from("post_reactions")
            .select("reaction, user:profiles ( id, avatar_url, full_name )")
            .eq("post_id", postId)
            .order("created_at", { ascending: false });
        if (error) {
            console.error("Error fetching reaction list:", error);
        } else {
            setReactionList(data || []);
        }
    };

    useEffect(() => {
        updateReactionList();
    }, [postId, reactionCount]);

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
                console.error("Error fetching user reaction:", error);
            } else if (data && data.reaction) {
                setUserReaction(data.reaction);
            }
        }
        fetchUserReaction();
    }, [postId]);

    // Listen for realtime changes to update reaction count and list
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
                    updateReactionList();
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
                setReactionCount((prev) => Math.max(prev - 1, 0));
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

                if (!userReaction) {
                    setReactionCount((prev) => prev + 1);
                }
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
            updateReactionList();
        } catch (error) {
            console.error("Problem med att hantera reaktion:", error);
            toast({
                title: "Error",
                description: "Failed to update reaction",
                variant: "destructive",
            });
        }
    };

    // Only display the 5 newest reactions.
    const displayedReactions = reactionList.slice(0, 5);
    const extraCount = reactionList.length - displayedReactions.length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    ref={reactionButtonRef}
                    className={`flex items-center gap-1 text-gray-500 hover:text-gray-700 ${compact ? "p-0 h-auto" : ""
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
                {/* Render the 5 newest reactions */}
                {reactionList.length > 0 && (
                    <>
                        <div className="px-2 py-2 border-b border-gray-200">
                            <div className="flex flex-wrap gap-2">
                                {displayedReactions.map((reactionObj: any) => {
                                    const { reaction, user } = reactionObj;
                                    return (
                                        <Link key={user.id} to={`/profil/${user.id}`}>
                                            <div className="relative inline-block">
                                                <img
                                                    src={user.avatar_url || "/placeholder.svg"}
                                                    alt={user.full_name || "User"}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full flex items-center justify-center w-5 h-5">
                                                    <span className="text-xs">
                                                        {reactionEmojis[reaction].emoji}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                                {extraCount > 0 && (
                                    <div className="relative inline-block">
                                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                            <span className="text-xs">+{extraCount}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="border-b border-gray-200 my-1"></div>
                    </>
                )}
                {/* Reaction options */}
                {(
                    Object.entries(reactionEmojis) as [
                        ReactionType,
                        { emoji: string; label: string }
                    ][]
                ).map(([key, { emoji, label }]) => (
                    <DropdownMenuItem
                        key={key}
                        onClick={() => handleReaction(key)}
                        className={`flex items-center gap-2 cursor-pointer ${userReaction === key ? "bg-gray-100" : ""
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
