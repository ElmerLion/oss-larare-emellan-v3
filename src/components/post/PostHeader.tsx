interface Author {
  name: string;
  avatar: string;
  timeAgo: string;
}

interface PostHeaderProps {
  author: Author;
}

export function PostHeader({ author }: PostHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <img
          src={author.avatar || "/placeholder.svg"}
          alt={author.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold">{author.name}</h3>
          <p className="text-sm text-gray-500">{author.timeAgo}</p>
        </div>
      </div>
      <button className="text-gray-400 hover:text-gray-600">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>
  );
}