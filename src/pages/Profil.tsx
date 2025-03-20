import { AppSidebar } from "@/components/AppSidebar";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { AboutSection } from "@/components/profile/AboutSection";
import ProfileInterests from "@/components/profile/ProfileInterests"; // Import the new component
import { ExperienceSection } from "@/components/profile/ExperienceSection";
import { UploadedMaterials } from "@/components/profile/UploadedMaterials";
import { RecommendedContacts } from "@/components/profile/RecommendedContacts";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import type { Profile } from "@/types/profile";
import { Header } from "@/components/Header";
import { UserListPopup } from "@/components/home/UserListPopup";

export default function Profil() {
  const { id: profileId } = useParams();
  const [profileData, setProfileData] = useState<Profile>({
    id: "",
    full_name: "",
    title: "",
    school: "",
    avatar_url: "/placeholder.svg",
    subjects: [],
    interests: [],
    education_level: "",
  });
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
    const [contactsCount, setContactsCount] = useState(0);
    const [contacts, setContacts] = useState<ExtendedProfile[]>([]);
    const [showContactsPopup, setShowContactsPopup] = useState(false);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      const targetId = profileId || user?.id;

      if (!targetId) {
        console.error("Error: Profile ID and user ID are both null.");
        setIsLoading(false);
        return;
      }

      // Fetch profile including subjects, interests, and education_level.
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
        subjects: data.subjects || [],
        interests: data.interests || [],
        education_level: data.education_level || "",
      });

      setIsCurrentUser(user?.id === targetId);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
    };

    const fetchContacts = async () => {
        if (!profileId) return;
        // First, fetch the contact IDs for the given profile
        const { data: contactsData, error: contactsError } = await supabase
            .from("user_contacts")
            .select("contact_id")
            .eq("user_id", profileId);
        if (contactsError) {
            console.error("Error fetching contacts:", contactsError);
            return;
        }
        const contactIds = contactsData?.map((contact) => contact.contact_id) || [];
        if (contactIds.length === 0) {
            setContacts([]);
            return;
        }
        // Next, fetch the profiles for those contact IDs
        const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("*")
            .in("id", contactIds);
        if (profilesError) {
            console.error("Error fetching profiles:", profilesError);
        } else if (profilesData) {
            setContacts(profilesData);
        }
    };


    const handleContactsClick = async () => {
        await fetchContacts();
        setShowContactsPopup(true);
    };

  const fetchContactsCount = async () => {
    if (!profileId) return;
    const { count, error } = await supabase
      .from("user_contacts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", profileId);
    if (error) {
      console.error("Error fetching contacts count:", error);
    } else {
      setContactsCount(count || 0);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [profileId]);

  useEffect(() => {
    fetchContactsCount();
  }, [profileId]);

  // Increment visits if a unique (non‑current) user visits the profile page.
  useEffect(() => {
    // Only count visits for non‑current users and if the profile has been loaded.
    if (profileData.id && !isCurrentUser) {
        console.log("Attempting to increment visits for", profileData.id);
      const currentMonth = new Date().toISOString().slice(0, 7); // e.g. "2025-02"
      const localKey = `profile_visit_${profileData.id}`;
      const lastVisitMonth = localStorage.getItem(localKey);

      // If the visit for this month hasn’t been recorded locally, record it and update Supabase.
      if (lastVisitMonth !== currentMonth) {
        localStorage.setItem(localKey, currentMonth);
        // Use an RPC function to atomically update the visits column.
        supabase
          .rpc("increment_profile_visits", { profile_id: profileData.id })
          .then(({ error }) => {
            if (error) {
              console.error("Error incrementing visits:", error);
            }
          });
      }
    }
  }, [profileData.id, isCurrentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-[#F6F6F7]">
        <div className="flex-1 ml-0 lg:ml-64">
          <main className="pt-8 min-h-[calc(100vh-4rem)] bg-[#F6F6F7]">
            <div className="p-6">Laddar...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F6F6F7]">
      <div className="flex-1 ml-0 lg:ml-64">
        <main className="min-h-[calc(100vh-4rem)] bg-[#F6F6F7]">
          <div className="p-6">
            <div className="max-w-[2800px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ProfileHeader
                    name={profileData.full_name}
                    role={`${profileData.title}${
                      profileData.school ? ` på ${profileData.school}` : ""
                    }`}
                    contactsCount={contactsCount}
                    reviews={54}
                    imageUrl={profileData.avatar_url}
                    onProfileUpdate={fetchProfile}
                                      isCurrentUser={isCurrentUser}
                                      onContactsClick={handleContactsClick}
                  />
                  <AboutSection userId={profileId} onProfileUpdate={fetchProfile} />
                  <ProfileInterests
                    subjects={profileData.subjects}
                    interests={profileData.interests}
                    educationLevel={profileData.education_level}
                    isCurrentUser={isCurrentUser}
                    onComplete={fetchProfile}
                  />
                  <ExperienceSection userId={profileId} />
                  <UploadedMaterials userId={profileId || ""} isCurrentUser={isCurrentUser} />
                </div>
                <div className="hidden lg:block">
                  <RecommendedContacts />
                </div>
              </div>
            </div>
          </div>
        </main>
          </div>
          <UserListPopup
              open={showContactsPopup}
              onOpenChange={setShowContactsPopup}
              title={`${profileData.full_name} kontakter`}
              users={contacts}
          />

    </div>
  );
}
