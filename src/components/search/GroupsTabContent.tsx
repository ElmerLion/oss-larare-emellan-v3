// GroupsTabContent.tsx
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Group {
  id: string;
  name: string;
  description: string;
  icon_url?: string;
  is_public: boolean;
  created_at: string;
}

interface GroupsTabContentProps {
  searchQuery: string;
}

export default function GroupsTabContent({ searchQuery }: GroupsTabContentProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch the current user ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    };
    fetchUser();
  }, []);

  // Query public groups matching the search query
  const { data: groups, isLoading, error } = useQuery<Group[]>({
    queryKey: ["groups", searchQuery],
    queryFn: async () => {
      let queryBuilder = supabase
        .from("groups")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false });
      if (searchQuery) {
        queryBuilder = queryBuilder.or(
          `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
        );
      }
      const { data, error } = await queryBuilder;
      if (error) throw error;
      return data || [];
    },
  });

  // Query the groups the user is already in
  const { data: userGroups } = useQuery<{ group_id: string }[]>({
    queryKey: ["userGroups", currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const { data, error } = await supabase
        .from("group_memberships")
        .select("group_id")
        .eq("user_id", currentUserId)
        .eq("status", "approved");
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentUserId,
  });
  const userGroupIds = new Set(userGroups?.map((g) => g.group_id));

  // Handler to join a group
  const handleJoinGroup = async (group: Group) => {
    if (!currentUserId) return;
    try {
      const { error } = await supabase
        .from("group_memberships")
        .insert({
          group_id: group.id,
          user_id: currentUserId,
          role: "member",
          status: "approved",
        })
        .select()
        .single();
      if (error) throw error;
      toast({
        title: "Gå med",
        description: "Du har gått med i gruppen",
        variant: "success",
      });
      queryClient.invalidateQueries(["userGroups", currentUserId]);
    } catch (err: any) {
      toast({
        title: "Fel",
        description: err.message || "Något gick fel",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-[#F6F6F7] p-6">
      {isLoading ? (
        <div className="text-center py-4">Laddar grupper...</div>
      ) : error ? (
        <div className="text-center py-4">Ett fel inträffade: {error.message}</div>
      ) : !groups || groups.length === 0 ? (
        <div className="text-center py-4">Inga grupper hittades.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="p-4 bg-white rounded-lg shadow-sm border flex items-center cursor-pointer"
              onClick={() => (window.location.href = "/meddelanden")}
            >
              {group.icon_url ? (
                <img
                  src={group.icon_url}
                  alt={group.name}
                  className="w-12 h-12 rounded object-cover mr-4"
                />
              ) : (
                <div className="w-12 h-12 rounded bg-gray-200 mr-4 flex items-center justify-center">
                  <span className="text-gray-500">Icon</span>
                </div>
              )}
              <div className="flex-1">
                <div className="text-lg font-semibold hover:underline">
                  {group.name}
                </div>
                {group.description && (
                  <p className="text-sm text-gray-600">{group.description}</p>
                )}
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                {userGroupIds.has(group.id) ? (
                  <span className="text-green-600 font-semibold">Medlem</span>
                ) : (
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinGroup(group);
                    }}
                  >
                    Gå med
                  </Button>
                )}
              </div>
            </div>

          ))}
        </div>
      )}
    </div>
  );
}
