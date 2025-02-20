import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import MiniProfile from "@/components/profile/MiniProfile";

export interface Material {
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
}

export interface Post {
  id: string;
  title: string;
  content: string;
  materials?: Material[];
  profile: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    school: string;
    created_at: string;
  };
  // add other fields as needed
}

export interface PostDetailsDialogProps {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostDetailsDialog({ post, open, onOpenChange }: PostDetailsDialogProps) {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <MiniProfile
            id={post.profile.id}
            name={post.profile.name}
            avatarUrl={post.profile.avatar}
            title={post.profile.title}
            school={post.profile.school}
            created_at={post.profile.created_at}
            size="medium"
          />
        </div>
        <div className="text-gray-700 mb-4">
          {post.content}
        </div>
        {post.materials && post.materials.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Länkat material</h3>
            <div className="space-y-4">
              {post.materials.map((material) => (
                <ResourceCard key={material.id} resource={material} />
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
