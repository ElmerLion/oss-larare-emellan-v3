import { ProfileStats } from "./ProfileStats";
import { ProfileActions } from "./ProfileActions";
import { ProfileAvatar } from "./ProfileAvatar";

interface ProfileHeaderProps {
    name: string;
    role: string;
    contactsCount: number;
    reviews: number;
    imageUrl: string;
    onProfileUpdate?: () => void;
    isCurrentUser?: boolean;
    onContactsClick?: () => void;
}

export function ProfileHeader({
    name,
    role,
    contactsCount,
    reviews,
    imageUrl,
    onProfileUpdate,
    isCurrentUser = false,
    onContactsClick,
}: ProfileHeaderProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6 items-center sm:items-start">
                <ProfileAvatar
                    imageUrl={imageUrl}
                    name={name}
                    isCurrentUser={isCurrentUser}
                    onProfileUpdate={isCurrentUser ? onProfileUpdate : undefined}
                />
                <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-semibold">{name}</h2>
                    <p className="text-gray-500">{role}</p>
                    <div className="flex flex-col items-center sm:items-start">
                        <ProfileStats contactsCount={contactsCount} reviews={reviews} onContactsClick={onContactsClick} />
                    </div>
                    <div className="block sm:hidden mt-4">
                        <ProfileActions />
                    </div>
                </div>
                <div className="hidden sm:block">
                    <ProfileActions />
                </div>
            </div>
        </div>
    );
}
