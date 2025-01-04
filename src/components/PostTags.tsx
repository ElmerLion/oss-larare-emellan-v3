interface PostTagsProps {
  tags: string[];
}

export function PostTags({ tags }: PostTagsProps) {
  return (
    <div className="flex gap-2 mb-4">
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}