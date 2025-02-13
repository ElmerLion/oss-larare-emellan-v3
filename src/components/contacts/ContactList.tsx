import React, { useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
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
  // Filter profiles based on the search query
  const filteredProfiles = useMemo(() => {
    return profiles?.filter(profile =>
      profile.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.school?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (profile.title && profile.title.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];
  }, [profiles, searchQuery]);

  // Compute sorted profiles with messages (these go under "Senaste meddelanden")
  const sortedProfilesWithMessages = useMemo(() => {
    return [...filteredProfiles.filter(profile => !!profile.lastMessageTime)]
      .sort((a, b) => new Date(b.lastMessageTime!).getTime() - new Date(a.lastMessageTime!).getTime());
  }, [filteredProfiles]);

  // Compute profiles without messages (for "Övriga kontakter")
  const sortedProfilesWithoutMessages = useMemo(() => {
    return [...filteredProfiles.filter(profile => !profile.lastMessageTime)];
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
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Senaste meddelanden</h3>
                <div className="space-y-2">
                  {sortedProfilesWithMessages.map((profile) => (
                    <div
                      key={profile.id}
                      onClick={() => onSelectUser(profile)}
                      className={cn(
                        "p-3 rounded-lg cursor-pointer hover:bg-gray-50",
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
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/profil/${profile.id}`}
                            className="font-medium hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {profile.full_name || "Unnamed User"}
                          </Link>
                          {profile.lastMessage && (
                            <p className="text-xs text-gray-500 truncate">
                              {profile.lastMessage}
                            </p>
                          )}
                        </div>
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
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Övriga kontakter</h3>
                <div className="space-y-2">
                  {sortedProfilesWithoutMessages.map((profile) => (
                    <div
                      key={profile.id}
                      onClick={() => onSelectUser(profile)}
                      className={cn(
                        "p-3 rounded-lg cursor-pointer hover:bg-gray-50",
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
                        <div className="flex-1 min-w-0">
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
