import { Link } from "react-router-dom";

interface MiniProfileProps {
  id: string; // Profile ID for linking
  name: string; // Full name
  avatarUrl: string; // Avatar image URL
  title?: string; // Optional title
  school?: string; // Optional school
  timeAgo?: string; // Optional time ago display
  size?: "small" | "medium" | "large"; // For different avatar sizes
  showLink?: boolean; // Whether to wrap with a profile link
}

export const MiniProfile = ({
  id,
  name,
  avatarUrl,
  title,
  school,
  timeAgo,
  size = "medium",
  showLink = true,
}: MiniProfileProps) => {
  const avatarSize = {
    small: "w-8 h-8",
    medium: "w-10 h-10",
    large: "w-16 h-16",
  }[size];

  const textContainerPadding = {
    small: "pl-2",
    medium: "pl-3",
    large: "pl-4",
  }[size];

  const combinedTitleSchool = title && school ? `${title} på ${school}` : title || school;

  return (
    <div className="flex items-center -mb-2">
      {/* Avatar */}
      <Link to={`/profil/${id}`} className="flex-shrink-0">
        <img
          src={avatarUrl || "/placeholder.svg"}
          alt={name || "Unnamed User"}
          className={`${avatarSize} rounded-full object-cover`}
        />
      </Link>

      {/* Profile Info */}
      <div className={`flex flex-col ${textContainerPadding} justify-center`}>
        {/* Name */}
        <Link
          to={`/profil/${id}`}
          className="font-medium text-sm hover:underline truncate"
          style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {name || "Unnamed User"}
        </Link>
        {/* Title and School */}
        {combinedTitleSchool && (
          <p
            className="text-xs text-gray-500 truncate"
            style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {combinedTitleSchool}
          </p>
        )}
        {/* Time Ago */}
        {timeAgo && (
          <p
            className="text-xs text-gray-400 truncate"
            style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {timeAgo}
          </p>
        )}
      </div>
    </div>
  );
};

export default MiniProfile;
