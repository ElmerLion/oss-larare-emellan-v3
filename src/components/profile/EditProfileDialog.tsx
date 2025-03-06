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
        title: "Profil uppdaterad",
        description: "Din profil har uppdaterats!.",
      });
      
      onProfileUpdate();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Ett Problem Uppstod",
        description: "Misslyckades med att uppdatera profilen. Var vänlig försök igen.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="w-4 h-4 mr-2" />
          Ändra
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ändra Profil</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">För- och efternamn</Label>
              <Input
                id="fullName"
                value={formData.full_name || ''}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Jobbtitel</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="school">Skola</Label>
            <Input
              id="school"
              value={formData.school || ''}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Jag är här för att...</Label>
            <Textarea
              id="purpose"
              value={formData.purpose || ''}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="Varför är du här?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivation">Jag jobbar som lärare för att...</Label>
            <Textarea
              id="motivation"
              value={formData.motivation || ''}
              onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
              placeholder="Vad motiverar dig som lärare?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contribution">Med mig kan du diskutera</Label>
            <Textarea
              id="contribution"
              value={formData.contribution || ''}
              onChange={(e) => setFormData({ ...formData, contribution: e.target.value })}
              placeholder="Vad kan någon diskutera med dig?"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Avbryt
            </Button>
            <Button className="bg-[var(--ole-green)] hover:bg-[var(--hover-green)]" type="submit">Spara ändringar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
