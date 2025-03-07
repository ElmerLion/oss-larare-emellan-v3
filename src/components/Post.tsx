import { PostHeader } from "./post/PostHeader";
import { PostReactions } from "./post/PostReactions";
import { PostComments } from "./post/PostComments";
import { PostTags } from "./PostTags";
import { SaveToListDialog } from "./SaveToListDialog";
import { useState } from "react";
import { Database } from "@/integrations/supabase/types";
import { ResourceCard } from "./resources/ResourceCard";

type ReactionType = Database["public"]["Enums"]["reaction_type"];

interface Profile {
  id?: string;
  name: string;
  avatar: string;
  title: string;
  school: string;
  created_at: string;
}

interface Material {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  type: string;
  difficulty: "easy" | "medium" | "hard";
  file_path: string;
  file_name: string;
  author_id: string;
  subject_level?: string | null;
  downloads?: number;
}

interface PostProps {
  id: string;
  profile: Profile;
  content: string;
  reactions: number;
  comments: number;
  tags?: string[];
  materials?: Material[];
  userReaction?: ReactionType | null;
}

export function Post({
  id,
  profile,
  content,
  reactions,
  comments,
  tags,
  materials,
  userReaction,
}: PostProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full">
      <div className="mb-4">
        <PostHeader
          profile={profile}
          postId={id}
          onSave={() => setShowSaveDialog(true)}
          disableProfileClick={false}
        />
      </div>

          <p className="whitespace-pre-wrap text-gray-700 mb-4">{content}</p>

      {tags && tags.length > 0 && <PostTags tags={tags} />}

      {materials && materials.length > 0 && (
        <div className="flex flex-col gap-4">
          {materials.map((material) => (
            <ResourceCard key={material.id} resource={material} />
          ))}
        </div>
      )}

      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
          <PostComments postId={id} totalComments={comments} />
          <PostReactions
            postId={id}
            reactions={reactions}
            userReaction={userReaction}
            compact={true}
          />
        </div>
        <PostComments postId={id} totalComments={comments} showCommentForm={true} />
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
