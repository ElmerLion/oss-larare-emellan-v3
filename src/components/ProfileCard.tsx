import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function ProfileCard() {
  const { data: profile } = useQuery({
    queryKey: ['profileCard'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, title, school, purpose, motivation, contribution, avatar_url, visits')
        .eq('id', user.id)
        .single();

      return data;
    },
  });

const { data: stats } = useQuery({
  queryKey: ['profile-stats'],
  queryFn: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Fetch resources uploaded by the user using the "author_id" column.
    const { data: resources, error } = await supabase
      .from('resources')
      .select('downloads')
      .eq('author_id', user.id); // Changed from 'id' to 'author_id'

    if (error) throw error;

    // Calculate total downloads
    const totalDownloads =
      resources?.reduce(
        (sum, resource) => sum + (resource.downloads || 0),
        0
      ) || 0;

    // Fetch the profile to get visits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('visits')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    return {
      downloads: totalDownloads,
      profileViews: profile?.visits || 0,
    };
  },
  enabled: !!profile,
});


  if (!profile) return null;

  // Combine title and school:
  const titleSchool =
    profile.title && profile.school
      ? `${profile.title} på ${profile.school}`
      : profile.title || profile.school || "Lärare";

  return (
    <Card className="p-6 border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Min Profil</h2>

      {/* Green Background with Avatar */}
      <div className="relative w-full h-[120px] bg-[var(--ole-green)] rounded-md">
        <div className="absolute inset-x-0 bottom-10 transform translate-y-1/2 flex justify-center">
          <Avatar className="h-[120px] w-[120px] rounded-full border-2 border-white">
            <AvatarImage
              src={profile.avatar_url || "/placeholder.svg"}
              alt={profile.full_name || "Profile Picture"}
            />
          </Avatar>
        </div>
      </div>

      {/* Profile Name and Title/School */}
      <h3 className="font-semibold mt-8">{profile.full_name || "Unnamed User"}</h3>
      <p className="text-sm text-gray-500 mb-2">{titleSchool}</p>

      {/* Bio */}
      <div className="text-sm text-gray-700 mb-6">
        {profile.purpose && (
          <p>Jag är här för att {profile.purpose.toLowerCase()}.</p>
        )}
        {profile.motivation && (
          <p>Jag jobbar som lärare för att {profile.motivation.toLowerCase()}.</p>
        )}
        {profile.contribution && (
          <p>Med mig kan du diskutera {profile.contribution.toLowerCase()}.</p>
        )}
      </div>

      {/* Stats */}
      <div className="flex space-x-4 justify-evenly">
        {/* Downloads Stat */}
        <div className="flex items-center">
          <div className="w-9 h-9 flex items-center justify-center bg-[var(--secondary2)] rounded-md text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold px-2 text-black">{stats?.downloads || 0}</div>
            <div className="text-xs text-gray-600 px-2">Nedladdningar</div>
          </div>
        </div>

        {/* Profile Visits Stat */}
        <div className="h-12 flex items-center">
          <div className="flex items-center">
            <div className="w-9 h-9 flex items-center justify-center bg-[var(--secondary2)] rounded-md text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zm-7.5 9a15.978 15.978 0 0115 0M4.5 21c-.333-.444-1.5-1.556-1.5-3 0-2.5 2-4 4.5-4s4.5 1.5 4.5 4c0 1.444-1.167 2.556-1.5 3H4.5z" />
              </svg>
            </div>
          </div>
          <div>
            <div className="text-sm font-bold px-2 text-black">{stats?.profileViews || 0}</div>
            <div className="text-xs text-gray-600 px-2">Profilbesök</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
