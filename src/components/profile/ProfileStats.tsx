interface ProfileStatsProps {
  followers: number;
  reviews: number;
}

export function ProfileStats({ followers, reviews }: ProfileStatsProps) {
  return (
    <div className="flex gap-6 mt-4">
      <div className="flex items-center gap-1">
        <span className="text-gray-600 font-semibold">
          <span className="text-[var(--secondary2)]">{followers}</span> Följare
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-gray-600 font-semibold">
          <span className="text-[var(--ole-green)]">{reviews}</span> Positiva Recensioner
        </span>
      </div>
    </div>
  );
}