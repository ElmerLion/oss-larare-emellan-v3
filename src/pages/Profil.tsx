import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { AboutSection } from "@/components/profile/AboutSection";
import { ExperienceSection } from "@/components/profile/ExperienceSection";
import { UploadedMaterials } from "@/components/profile/UploadedMaterials";
import { RecommendedContacts } from "@/components/profile/RecommendedContacts";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";

export default function Profil() {
  const { id: profileId } = useParams();
  const [profileData, setProfileData] = useState({
    full_name: "",
    title: "",
    school: "",
    avatar_url: "/lovable-uploads/0d20194f-3eb3-4f5f-ba83-44b21f1060ed.png",
  });
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const targetId = profileId || user?.id;
    
    if (!targetId) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', targetId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    setProfileData({
      full_name: data.full_name || "",
      title: data.title || "",
      school: data.school || "",
      avatar_url: data.avatar_url || "/lovable-uploads/0d20194f-3eb3-4f5f-ba83-44b21f1060ed.png",
    });

    setIsCurrentUser(user?.id === targetId);
  };

  useEffect(() => {
    fetchProfile();
  }, [profileId]);

  return (
    <div className="min-h-screen flex bg-[#F6F6F7]">
      <AppSidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="mt-16 min-h-[calc(100vh-4rem)] bg-[#F6F6F7]">
          <div className="p-6">
            <div className="max-w-[1500px] mx-auto">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                  <ProfileHeader
                    name={profileData.full_name || "Unnamed User"}
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

                  <UploadedMaterials materials={[
                    {
                      title: "Introduktion till Programmering",
                      description: "En grundläggande guide för nybörjare i programmering, med fokus på Python och grundläggande koncept.",
                      tags: [
                        { subject: "Programmering", level: "Gymnasiet 1", difficulty: "Lätt" }
                      ]
                    },
                    {
                      title: "Webbutveckling Projekt",
                      description: "Ett komplett projektmaterial för att lära ut HTML, CSS och JavaScript genom praktiska övningar.",
                      tags: [
                        { subject: "Webbutveckling", level: "Gymnasiet 2", difficulty: "Medel" }
                      ]
                    }
                  ]} />
                </div>

                <div className="col-span-1">
                  <RecommendedContacts contacts={[
                    {
                      name: "Maria Larsson",
                      role: "Lärare",
                      school: "Affärsgymnasiet",
                      image: "/lovable-uploads/23886c31-4d07-445c-bf13-eee4b2127d40.png"
                    },
                    {
                      name: "Erik Svensson",
                      role: "Lärare",
                      school: "Affärsgymnasiet",
                      image: "/lovable-uploads/e7d324d6-19e4-4218-97a3-91fd2b88597c.png"
                    },
                    {
                      name: "Amanda Gunnarsson Nial",
                      role: "Lärare",
                      school: "Affärsgymnasiet",
                      image: "/lovable-uploads/360aff04-e122-43cf-87b2-bad362e840e6.png"
                    }
                  ]} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}