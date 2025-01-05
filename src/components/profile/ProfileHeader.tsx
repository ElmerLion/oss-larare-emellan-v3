import { Button } from "@/components/ui/button";
import { MessageCircle, UserPlus, Camera } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileHeaderProps {
  name: string;
  role: string;
  followers: number;
  reviews: number;
  imageUrl: string;
  onProfileUpdate?: () => void;
}

export function ProfileHeader({ name, role, followers, reviews, imageUrl, onProfileUpdate }: ProfileHeaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleImageClick = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

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
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to update profile picture');
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-start gap-6">
        <div className="relative group">
          <img
            src={imageUrl}
            alt={name}
            className="w-28 h-28 rounded-full border-4 border-white object-cover cursor-pointer transition-opacity group-hover:opacity-75"
            onClick={handleImageClick}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{name}</h2>
          <p className="text-gray-500">{role}</p>
          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-1">
              <span className="text-gray-600 font-semibold"><span className="text-blue-400">{followers}</span> Följare</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-600 font-semibold"><span className="text-green-600">{reviews}</span> Positiva Recensioner</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="default" className="bg-sage-400 hover:bg-sage-500">
            <MessageCircle className="w-4 h-4 mr-2" />
            Meddela
          </Button>
          <Button variant="outline" className="border-sage-200 hover:bg-sage-50">
            <UserPlus className="w-4 h-4 mr-2" />
            Lägg till som kontakt
          </Button>
        </div>
      </div>
    </div>
  );
}