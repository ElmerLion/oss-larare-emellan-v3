// UserListPopup.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { MiniProfile } from "@/components/profile/MiniProfile";
import type { ExtendedProfile } from "@/types/profile";

interface UserListPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  users: ExtendedProfile[];
}

export function UserListPopup({
  open,
  onOpenChange,
  title,
  users,
}: UserListPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          {users.length === 0 ? (
            <p className="text-center text-gray-500">
              Inga användare hittades.
            </p>
          ) : (
            users.map((user) => (
              <div key={user.id}>
                <MiniProfile
                  id={user.id}
                  name={user.full_name || "Unnamed User"}
                  avatarUrl={user.avatar_url || "/placeholder.svg"}
                  title={user.title}
                  school={user.school}
                  created_at={user.created_at}
                  size="small"
                  showLink={true}
                />
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UserListPopup;
