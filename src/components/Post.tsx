import { MessageSquare, ThumbsUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostMaterial } from "./PostMaterial";
import { PostTags } from "./PostTags";

interface Author {
  name: string;
  avatar: string;
  timeAgo: string;
}

interface Material {
  title: string;
  type: string;
}

interface PostProps {
  id: string | number; // Updated to accept both string and number types
  author: Author;
  content: string;
  reactions: number;
  comments: number;
  tags?: string[];
  materials?: Material[];
}

export function Post({ author, content, reactions, comments, tags, materials }: PostProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={author.avatar}
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

      <p className="text-gray-700 mb-4">{content}</p>

      {tags && tags.length > 0 && <PostTags tags={tags} />}
      {materials && materials.length > 0 && <PostMaterial materials={materials} />}

      <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
        <div className="flex items-center gap-1">
          <ThumbsUp className="w-4 h-4" />
          <span>{reactions} Reaktioner</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          <span>{comments} Kommentarer</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="flex gap-3">
          <img
            src="/lovable-uploads/0d20194f-3eb3-4f5f-ba83-44b21f1060ed.png"
            alt="Your avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex gap-2">
              <Textarea
                placeholder="Kommentera här..."
                style={{ height: '40px', minHeight: '0', boxSizing: 'border-box' }}
                className="resize-none"
              />
              <Button size="icon" className="h-10 bg-sage-500 hover:bg-sage-600">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}