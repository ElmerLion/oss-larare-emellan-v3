import React, { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { ExtendedProfile } from "@/types/profile";

interface ContactListProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  profiles: ExtendedProfile[] | undefined;
  selectedUser: ExtendedProfile | null;
  onSelectUser: (user: ExtendedProfile) => void;
}

export function ContactList({
  searchQuery,
  onSearchChange,
  profiles,
  selectedUser,
  onSelectUser,
}: ContactListProps) {
  // State for unread counts, keyed by sender id.
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  // State for the current user's id.
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch current user id.
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setCurrentUserId(user?.id || null);
      }
    };
    fetchUser();
  }, []);

  // Fetch unread message counts for the current user.
  useEffect(() => {
    if (!currentUserId) return;

    const fetchUnreadCounts = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("sender_id", { count: "exact", head: false })
        .eq("receiver_id", currentUserId)
        .eq("is_read", false);
      if (error) {
        console.error("Error fetching unread messages:", error);
      } else {
        const counts: Record<string, number> = {};
        data.forEach((msg: any) => {
          const sender = msg.sender_id;
          counts[sender] = (counts[sender] || 0) + 1;
        });
        setUnreadCounts(counts);
      }
    };

    fetchUnreadCounts();

    // Realtime subscription to update counts.
    const channel = supabase
      .channel("unread-messages-list")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          if (
            payload.new.receiver_id === currentUserId &&
            payload.new.is_read === false
          ) {
            setUnreadCounts((prev) => {
              const newCount = (prev[payload.new.sender_id] || 0) + 1;
              return { ...prev, [payload.new.sender_id]: newCount };
            });
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          if (payload.new.receiver_id === currentUserId) {
            // When a message is marked read.
            if (
              payload.old.is_read === false &&
              payload.new.is_read === true
            ) {
              setUnreadCounts((prev) => {
                const newCount = Math.max((prev[payload.new.sender_id] || 1) - 1, 0);
                return { ...prev, [payload.new.sender_id]: newCount };
              });
            }
            // When a message is marked unread again.
            if (
              payload.old.is_read === true &&
              payload.new.is_read === false
            ) {
              setUnreadCounts((prev) => {
                const newCount = (prev[payload.new.sender_id] || 0) + 1;
                return { ...prev, [payload.new.sender_id]: newCount };
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  // Filter profiles based on the search query.
  const filteredProfiles = useMemo(() => {
    return (
      profiles?.filter((profile) =>
        profile.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.school?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profile.title &&
          profile.title.toLowerCase().includes(searchQuery.toLowerCase()))
      ) || []
    );
  }, [profiles, searchQuery]);

  // Compute sorted profiles with messages ("Senaste meddelanden")
  const sortedProfilesWithMessages = useMemo(() => {
    return [...filteredProfiles.filter((profile) => !!profile.lastMessageTime)].sort(
      (a, b) =>
        new Date(b.lastMessageTime!).getTime() -
        new Date(a.lastMessageTime!).getTime()
    );
  }, [filteredProfiles]);

  // Compute profiles without messages ("Dina kontakter")
  const sortedProfilesWithoutMessages = useMemo(() => {
    return [...filteredProfiles.filter((profile) => !profile.lastMessageTime)];
  }, [filteredProfiles]);

  return (
    <div className="w-[400px] bg-white rounded-lg shadow-sm">
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Meddelanden</h1>
        <h2 className="text-sm text-gray-600 mb-4">Sök bland dina meddelanden</h2>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Vem letar du efter?"
            className="pl-10 bg-gray-50"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {filteredProfiles.length === 0 ? (
          <p className="flex items-center justify-center text-sm text-gray-500 h-full">
            Inga meddelanden hittades.
          </p>
        ) : (
          <div className="space-y-4">
            {sortedProfilesWithMessages.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Senaste meddelanden
                </h3>
                <div className="space-y-2">
                  {sortedProfilesWithMessages.map((profile) => (
                    <div
                      key={profile.id}
                      onClick={() => onSelectUser(profile)}
                      className={cn(
                        "p-3 rounded-lg cursor-pointer hover:bg-gray-50 flex items-center justify-between",
                        selectedUser?.id === profile.id && "bg-blue-50",
                        profile.isContact && "border-l-4 border-sage-400"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={profile.avatar_url || "/placeholder.svg"}
                          alt={profile.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <Link
                            to={`/profil/${profile.id}`}
                            className="font-medium hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {profile.full_name || "Unnamed User"}
                          </Link>
                          {profile.lastMessage && (
                            <p className="text-xs text-gray-500 truncate w-48">
                              {profile.lastMessage}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="w-24 flex-shrink-0 flex items-center justify-end gap-2">
                        {unreadCounts[profile.id] > 0 && (
                          <span className="bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                            {unreadCounts[profile.id]}
                          </span>
                        )}
                        {profile.lastMessageTime && (
                          <div className="text-xs text-gray-400">
                            {new Date(profile.lastMessageTime).toLocaleString("sv-SE", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sortedProfilesWithoutMessages.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Dina kontakter
                </h3>
                <div className="space-y-2">
                  {sortedProfilesWithoutMessages.map((profile) => (
                    <div
                      key={profile.id}
                      onClick={() => onSelectUser(profile)}
                      className={cn(
                        "p-3 rounded-lg cursor-pointer hover:bg-gray-50 flex items-center justify-between",
                        selectedUser?.id === profile.id && "bg-blue-50",
                        profile.isContact && "border-l-4 border-sage-400"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={profile.avatar_url || "/placeholder.svg"}
                          alt={profile.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <Link
                            to={`/profil/${profile.id}`}
                            className="font-medium hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {profile.full_name || "Unnamed User"}
                          </Link>
                          <p className="text-xs text-gray-500 truncate">
                            {profile.title} {profile.school ? `på ${profile.school}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="w-24 flex-shrink-0 flex items-center justify-end">
                        {unreadCounts[profile.id] > 0 && (
                          <span className="bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                            {unreadCounts[profile.id]}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactList;
