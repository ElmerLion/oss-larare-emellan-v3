import { MessageSquare, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const posts = [
  {
    id: 1,
    author: {
      name: "Elmer Almer Ershagen",
      avatar: "/lovable-uploads/7a5590cb-c66c-4fa4-8aa2-47b052f53e9f.png",
      timeAgo: "5 min sen",
    },
    content: "Hej allihopa! Jag är en nyexaminerad lärare som vill lära mig så mycket som möjligt och dela med mig av mina kunskaper och jag hoppas kunna göra det här!",
    reactions: 40,
    comments: 12,
  },
  {
    id: 2,
    author: {
      name: "Amanda Gunnarsson Nial",
      avatar: "/placeholder.svg",
      timeAgo: "20 min sen",
    },
    content: "Hej! Jag har precis haft en lektion där jag försökte få mina elever att ha roligt med matten. De uppskattade det mycket. Jag delar materialet nedanför!",
    reactions: 98,
    comments: 43,
    tags: ["Lätt", "Matematik", "Årskurs 3"],
  }
];

export function Feed() {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{post.author.name}</h3>
                <p className="text-sm text-gray-500">{post.author.timeAgo}</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>

          <p className="text-gray-700 mb-4">{post.content}</p>

          {post.tags && (
            <div className="flex gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{post.reactions} Reaktioner</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{post.comments} Kommentarer</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex gap-3">
              <img
                src="/lovable-uploads/7a5590cb-c66c-4fa4-8aa2-47b052f53e9f.png"
                alt="Your avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <Textarea
                  placeholder="Kommentera här..."
                  className="mb-2 resize-none"
                />
                <Button size="sm">Skicka</Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}