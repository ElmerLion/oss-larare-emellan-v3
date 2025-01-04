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
import { Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface EditExperienceDialogProps {
  onExperienceUpdate: () => void;
}

export function EditExperienceDialog({ onExperienceUpdate }: EditExperienceDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    isCurrent: false,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('experiences')
        .insert({
          profile_id: (await supabase.auth.getUser()).data.user?.id,
          company: formData.company,
          role: formData.role,
          start_date: formData.startDate,
          end_date: formData.isCurrent ? null : formData.endDate,
          description: formData.description,
          is_current: formData.isCurrent,
        });

      if (error) throw error;

      toast({
        title: "Experience added",
        description: "Your experience has been added successfully.",
      });
      
      onExperienceUpdate();
      setOpen(false);
      setFormData({
        company: '',
        role: '',
        startDate: '',
        endDate: '',
        description: '',
        isCurrent: false,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add experience. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Experience</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company/School</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                disabled={formData.isCurrent}
                required={!formData.isCurrent}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isCurrent"
              checked={formData.isCurrent}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, isCurrent: checked as boolean })
              }
            />
            <Label htmlFor="isCurrent">I currently work here</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your role and responsibilities..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Experience</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}