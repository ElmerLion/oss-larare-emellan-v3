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
  onProfileUpdate?: () => void;
}

export function ProfileAvatar({ imageUrl, name, onProfileUpdate }: ProfileAvatarProps) {
  const [uploading, setUploading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success('Profile picture updated successfully');
      if (onProfileUpdate) onProfileUpdate();
      setShowDialog(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="relative group cursor-pointer" onClick={() => setShowDialog(true)}>
        <img
          src={imageUrl}
          alt={name}
          className="w-28 h-28 rounded-full border-4 border-white object-cover transition-opacity group-hover:opacity-75"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
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
              className="w-full"
            >
              {uploading ? 'Uploading...' : 'Choose Image'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}