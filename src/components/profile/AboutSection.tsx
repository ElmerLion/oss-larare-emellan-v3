import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EditProfileDialog } from "./EditProfileDialog";

interface AboutSectionProps {
  userId?: string;
  onProfileUpdate?: () => void;
}

export function AboutSection({ userId, onProfileUpdate }: AboutSectionProps) {
  const [profileData, setProfileData] = useState({
    purpose: null,
    motivation: null,
    contribution: null,
    full_name: null,
    title: null,
    school: null,
    bio: null,
  });
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const profileId = userId || user?.id;
    
    if (!profileId) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    setProfileData(data);
    setIsCurrentUser(user?.id === profileId);
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const handleProfileUpdate = () => {
    fetchProfile();
    if (onProfileUpdate) {
      onProfileUpdate();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Om Mig</h2>
        {isCurrentUser && (
          <EditProfileDialog
            profileData={profileData}
            onProfileUpdate={handleProfileUpdate}
          />
        )}
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Jag är här för att</h3>
          <p className="text-gray-800">{profileData.purpose || "Inte angivet än"}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Jag jobbar som lärare för att</h3>
          <p className="text-gray-800">{profileData.motivation || "Inte angivet än"}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">På Oss Lärare Emellan bidrar jag med</h3>
          <p className="text-gray-800">{profileData.contribution || "Inte angivet än"}</p>
        </div>
      </div>
    </div>
  );
}