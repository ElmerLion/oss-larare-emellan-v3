import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import type { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";

interface ContactListProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  profiles: (Profile & { isContact?: boolean })[] | undefined;
  selectedUser: Profile | null;
  onSelectUser: (user: Profile) => void;
}

export function ContactList({
  searchQuery,
  onSearchChange,
  profiles,
  selectedUser,
  onSelectUser,
}: ContactListProps) {
  const filteredProfiles = profiles?.filter(profile => 
    profile.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.school?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.title?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="w-[400px] bg-white rounded-lg shadow-sm">
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Kontakter</h1>
        <h2 className="text-sm text-gray-600 mb-4">Sök efter andra lärare</h2>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Vem letar du efter?" 
            className="pl-10 bg-gray-50"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          {filteredProfiles?.map((profile) => (
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
                  <p className="text-sm text-gray-600 truncate">
                    {profile.title} {profile.school ? `på ${profile.school}` : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}