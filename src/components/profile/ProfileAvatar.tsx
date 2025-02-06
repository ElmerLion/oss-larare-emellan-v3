import { Camera } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProfileAvatarProps {
  imageUrl: string;
  name: string;
  isCurrentUser?: boolean; // Use this instead of fetching user info
  onProfileUpdate?: () => void;
}

export function ProfileAvatar({ imageUrl, name, isCurrentUser = false, onProfileUpdate }: ProfileAvatarProps) {
  const [uploading, setUploading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

 const handleImageUpload = async (file: File) => {
   try {
     setUploading(true);

     // Get current user
     const { data: { user }, error: userError } = await supabase.auth.getUser();
     if (userError || !user) throw new Error("User not authenticated");

     // Generate file path
     const fileExt = file.name.split('.').pop();
     const fileName = `${user.id}-${Date.now()}.${fileExt}`;
     const filePath = `avatars/${fileName}`;

     // Upload file
     const { error: uploadError } = await supabase.storage
       .from("avatars")
       .upload(filePath, file, { upsert: true });

     if (uploadError) throw uploadError;

     // Get public URL
     const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
     const publicUrl = data.publicUrl;

     // Update user profile with new avatar URL
     const { error: updateError } = await supabase
       .from("profiles")
       .update({ avatar_url: publicUrl })
       .eq("id", user.id);

     if (updateError) throw updateError;

     // Show success message
     toast.success("Profile picture updated successfully");

     // Trigger profile update in parent component
     if (onProfileUpdate) onProfileUpdate();

     // Close dialog
     setShowDialog(false);
   } catch (error) {
     console.error("Error uploading image:", error);
     toast.error("Failed to update profile picture");
   } finally {
     setUploading(false);
   }
 };

  return (
    <>
      <div
        className={`relative ${isCurrentUser ? 'group cursor-pointer' : ''}`}
        onClick={isCurrentUser ? () => setShowDialog(true) : undefined}
      >
        <img
          src={imageUrl}
          alt={name}
          className="w-28 h-28 rounded-full border-4 border-white object-cover transition-opacity"
        />

        {/* Only show the camera icon if it's the current user */}
        {isCurrentUser && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
              className="hidden"
              id="avatar-upload"
            />
            <Button
              onClick={() => document.getElementById('avatar-upload')?.click()}
              disabled={uploading}
              className="w-full bg-[color:var(--ole-green)] hover:bg-[color:var(--hover-green)] text-white"
            >
              {uploading ? 'Uploading...' : 'Choose Image'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
