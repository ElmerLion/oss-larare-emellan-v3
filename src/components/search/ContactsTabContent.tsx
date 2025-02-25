// ContactsTabContent.tsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  title?: string;
  school?: string;
}

interface ContactsTabContentProps {
  searchQuery: string;
}

export default function ContactsTabContent({ searchQuery }: ContactsTabContentProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch the current user ID.
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    };
    fetchUser();
  }, []);

  // Fetch all profiles from the platform.
  const { data: profiles, isLoading, error } = useQuery<Profile[]>({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Filter profiles based on the search query and exclude the current user.
  const filteredProfiles =
    profiles?.filter((profile) => {
      if (currentUserId && profile.id === currentUserId) return false;
      const lowerQuery = searchQuery.toLowerCase();
      return (
        profile.full_name.toLowerCase().includes(lowerQuery) ||
        (profile.title && profile.title.toLowerCase().includes(lowerQuery)) ||
        (profile.school && profile.school.toLowerCase().includes(lowerQuery))
      );
    }) || [];

  return (
    <div className="bg-[#F6F6F7] p-6">
      {isLoading ? (
        <div className="text-center py-4">Laddar kontakter...</div>
      ) : error ? (
        <div className="text-center py-4">Ett fel inträffade: {error.message}</div>
      ) : filteredProfiles.length === 0 ? (
        <div className="text-center py-4">Inga kontakter hittades.</div>
      ) : (
        <div className="space-y-4">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="p-4 flex items-center bg-white rounded-lg shadow-sm border hover:bg-gray-100"
            >
              <img
                src={profile.avatar_url || "/placeholder.svg"}
                alt={profile.full_name}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div className="flex-1">
                <Link to={`/profil/${profile.id}`} className="font-medium hover:underline">
                  {profile.full_name || "Unnamed User"}
                </Link>
                <p className="text-sm text-gray-500">
                  {profile.title} {profile.school ? `på ${profile.school}` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
