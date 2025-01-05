import { ProfileStats } from "./ProfileStats";
import { ProfileActions } from "./ProfileActions";
import { ProfileAvatar } from "./ProfileAvatar";

interface ProfileHeaderProps {
  name: string;
  role: string;
  followers: number;
  reviews: number;
  imageUrl: string;
  onProfileUpdate?: () => void;
}

export function ProfileHeader({ 
  name, 
  role, 
  followers, 
  reviews, 
  imageUrl,
  onProfileUpdate 
}: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-start gap-6">
        <ProfileAvatar 
          imageUrl={imageUrl} 
          name={name} 
          onProfileUpdate={onProfileUpdate}
        />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{name}</h2>
          <p className="text-gray-500">{role}</p>
          <ProfileStats followers={followers} reviews={reviews} />
        </div>
        <ProfileActions />
      </div>
    </div>
  );
}