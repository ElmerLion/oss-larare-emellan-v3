import { Link } from "react-router-dom";

interface MiniProfileProps {
  id: string;           // Profile ID for linking
  name: string;         // Full name
  avatarUrl: string;    // Avatar image URL
  title?: string;       // Optional title
  school?: string;      // Optional school
  created_at?: string;  // A date string representing when the post was published
  size?: "small" | "medium" | "large"; // For different avatar sizes
  showLink?: boolean;   // Whether to wrap the output in a link to the profile
}

/**
 * Custom function to format a raw timestamp into a Swedish "time ago" string.
 */
function formatTimeAgo(created_at: string): string {
  const date = new Date(created_at);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "nyss";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? "1 minut sen" : `${diffInMinutes} minuter sen`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? "1 timme sen" : `${diffInHours} timmar sen`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return diffInDays === 1 ? "1 dag sen" : `${diffInDays} dagar sen`;
  }

  if (diffInDays < 30) {
    const diffInWeeks = Math.floor(diffInDays / 7);
    return diffInWeeks === 1 ? "1 vecka sen" : `${diffInWeeks} veckor sen`;
  }

  if (diffInDays < 365) {
    const diffInMonths = Math.floor(diffInDays / 30);
    return diffInMonths === 1 ? "1 månad sen" : `${diffInMonths} månader sen`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return diffInYears === 1 ? "1 år sen" : `${diffInYears} år sen`;
}

export const MiniProfile = ({
  id,
  name,
  avatarUrl,
  title,
  school,
  created_at,
  size = "medium",
  showLink = true,
}: MiniProfileProps) => {
  // Define responsive avatar size classes:
  const responsiveAvatarClass = {
    small: "w-6 h-6 sm:w-8 sm:h-8",
    medium: "w-8 h-8 sm:w-10 sm:h-10",
    large: "w-12 h-12 sm:w-16 sm:h-16",
  }[size];

  // Define responsive padding classes for text:
  const responsivePaddingClass = {
    small: "pl-1 sm:pl-2",
    medium: "pl-2 sm:pl-3",
    large: "pl-3 sm:pl-4",
  }[size];

  // Combine title and school if both are provided.
  const combinedTitleSchool =
    title && school ? `${title} på ${school}` : title || school || "";

  const content = (
    <div className="flex items-center">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <img
          src={avatarUrl || "/placeholder.svg"}
          alt={name || "Unnamed User"}
          className={`${responsiveAvatarClass} rounded-full object-cover`}
        />
      </div>
      {/* Profile Information */}
      <div className={`flex flex-col ${responsivePaddingClass}`}>
        <div className="font-medium text-xs sm:text-sm">{name || "Unnamed User"}</div>
        {combinedTitleSchool && (
          <div className="text-[10px] sm:text-xs text-gray-500">{combinedTitleSchool}</div>
        )}
        {created_at && (
          <div className="text-[10px] sm:text-xs text-gray-400">
            {formatTimeAgo(created_at)}
          </div>
        )}
      </div>
    </div>
  );

  return showLink ? (
    <Link to={`/profil/${id}`} className="block">
      {content}
    </Link>
  ) : (
    content
  );
};

export default MiniProfile;
