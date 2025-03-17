interface ProfileStatsProps {
    contactsCount: number;
    reviews?: number;
    onContactsClick?: () => void;
}

export function ProfileStats({ contactsCount, reviews, onContactsClick }: ProfileStatsProps) {
    return (
        <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-1 cursor-pointer" onClick={onContactsClick}>
                <span className="text-gray-600 font-semibold">
                    <span className="text-[var(--secondary2)]">{contactsCount}</span> Kontakter
                </span>
            </div>
        </div>
    );
}
