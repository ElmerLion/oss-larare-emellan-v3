import { PostHeader } from "./post/PostHeader";
import { PostReactions } from "./post/PostReactions";
import { PostComments } from "./post/PostComments";
import { PostMaterial } from "./PostMaterial";
import { PostTags } from "./PostTags";
import { Database } from "@/integrations/supabase/types";
import { SaveToListDialog } from "./SaveToListDialog";
import { useState } from "react";
import { Link } from "react-router-dom";

type ReactionType = Database["public"]["Enums"]["reaction_type"];

interface Author {
  id?: string;
  name: string;
  avatar: string;
  timeAgo: string;
}

interface Material {
  title: string;
  type: string;
}

interface PostProps {
  id: string;
  author: Author;
  content: string;
  reactions: number;
  comments: number;
  tags?: string[];
  materials?: Material[];
  userReaction?: ReactionType | null;
}

export function Post({
  id,
  author,
  content,
  reactions,
  comments,
  tags,
  materials,
  userReaction,
}: PostProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <Link to={`/profil/${author.id}`} className="block mb-4">
        <PostHeader 
          author={author} 
          postId={id} 
          onSave={() => setShowSaveDialog(true)}
        />
      </Link>
      
      <p className="text-gray-700 mb-4">{content}</p>

      {tags && tags.length > 0 && <PostTags tags={tags} />}
      {materials && materials.length > 0 && <PostMaterial materials={materials} />}

      <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
        <PostReactions
          postId={id}
          reactions={reactions}
          userReaction={userReaction}
        />
      </div>

      <div className="pt-4 border-t border-gray-100">
        <PostComments postId={id} totalComments={comments} />
      </div>

      <SaveToListDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        itemId={id}
        itemType="post"
      />
    </div>
  );
}