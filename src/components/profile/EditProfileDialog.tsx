import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Pencil } from "lucide-react";

interface EditProfileDialogProps {
  profileData: {
    full_name: string | null;
    title: string | null;
    school: string | null;
    bio: string | null;
    purpose: string | null;
    motivation: string | null;
    contribution: string | null;
  };
  onProfileUpdate: () => void;
}

export function EditProfileDialog({ profileData, onProfileUpdate }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(profileData);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          title: formData.title,
          school: formData.school,
          bio: formData.bio,
          purpose: formData.purpose,
          motivation: formData.motivation,
          contribution: formData.contribution,
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      onProfileUpdate();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.full_name || ''}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="school">School</Label>
            <Input
              id="school"
              value={formData.school || ''}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea
              id="purpose"
              value={formData.purpose || ''}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="Why are you here?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivation">Motivation</Label>
            <Textarea
              id="motivation"
              value={formData.motivation || ''}
              onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
              placeholder="What motivates you as a teacher?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contribution">Contribution</Label>
            <Textarea
              id="contribution"
              value={formData.contribution || ''}
              onChange={(e) => setFormData({ ...formData, contribution: e.target.value })}
              placeholder="How do you contribute to the community?"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}