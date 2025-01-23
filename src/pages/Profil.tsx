import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { AboutSection } from "@/components/profile/AboutSection";
import { ExperienceSection } from "@/components/profile/ExperienceSection";
import { UploadedMaterials } from "@/components/profile/UploadedMaterials";
import { RecommendedContacts } from "@/components/profile/RecommendedContacts";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import type { Profile } from "@/types/profile";

export default function Profil() {
  const { id: profileId } = useParams();
  const [profileData, setProfileData] = useState<Profile>({
    id: "",
    full_name: "",
    title: "",
    school: "",
    avatar_url: "/placeholder.svg",
  });
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);

      // Get current user and check the target ID
      const { data: { user } } = await supabase.auth.getUser();
      const targetId = profileId || user?.id;

      if (!targetId) {
        console.error("Error: Profile ID and user ID are both null.");
        setIsLoading(false);
        return;
      }

      // Fetch profile
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", targetId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      setProfileData({
        id: data.id,
        full_name: data.full_name || "Unnamed User",
        title: data.title || "",
        school: data.school || "",
        avatar_url: data.avatar_url || "/placeholder.svg",
      });

      setIsCurrentUser(user?.id === targetId);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [profileId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-[#F6F6F7]">
        <AppSidebar />
        <div className="flex-1 ml-64">
          <Header />
          <main className="mt-16 min-h-[calc(100vh-4rem)] bg-[#F6F6F7]">
            <div className="p-6">
              <div>Laddar...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F6F6F7]">
      <AppSidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="mt-16 min-h-[calc(100vh-4rem)] bg-[#F6F6F7]">
          <div className="p-6">
            <div className="max-w-[2800px] mx-auto">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                  <ProfileHeader
                    name={profileData.full_name}
                    role={`${profileData.title}${profileData.school ? ` på ${profileData.school}` : ''}`}
                    followers={192}
                    reviews={54}
                    imageUrl={profileData.avatar_url}
                    onProfileUpdate={fetchProfile}
                    isCurrentUser={isCurrentUser}
                  />

                  <AboutSection 
                    userId={profileId} 
                    onProfileUpdate={fetchProfile}
                  />

                  <ExperienceSection 
                    userId={profileId}
                  />

                  <UploadedMaterials 
                    userId={profileId || ''} 
                    isCurrentUser={isCurrentUser}
                  />
                </div>

                <div className="col-span-1">
                  <RecommendedContacts/>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}