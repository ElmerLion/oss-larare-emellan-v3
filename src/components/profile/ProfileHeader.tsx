import { ProfileStats } from "./ProfileStats";
import { ProfileActions } from "./ProfileActions";
import { ProfileAvatar } from "./ProfileAvatar";

interface ProfileHeaderProps {
  name: string;
  role: string;
  contactsCount: number; // renamed from followers
  reviews: number;
  imageUrl: string;
  onProfileUpdate?: () => void;
  isCurrentUser?: boolean;
}

export function ProfileHeader({
  name,
  role,
  contactsCount,
  reviews,
  imageUrl,
  onProfileUpdate,
  isCurrentUser = false
}: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-start gap-6">
        <ProfileAvatar
          imageUrl={imageUrl}
          name={name}
          isCurrentUser={isCurrentUser}
          onProfileUpdate={isCurrentUser ? onProfileUpdate : undefined}
        />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{name}</h2>
          <p className="text-gray-500">{role}</p>
          <ProfileStats contactsCount={contactsCount} reviews={reviews} />
        </div>
        <ProfileActions />
      </div>
    </div>
  );
}
