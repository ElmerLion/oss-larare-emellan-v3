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
        title: "Erfarenhet tillagd",
        description: "Din erfarenhet har lagts till.",
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
        description: "Misslyckades med att lägga till erfarenhet. Försök igen eller kontakta support.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Lägg till erfarenhet
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>Lägg till erfarenhet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Skola/Företag</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Jobbtitel</Label>
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
              <Label htmlFor="startDate">Start Datum</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Slut Datum</Label>
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
              className="w-5 h-5 border-gray-400 data-[state=checked]:bg-[color:var(--ole-green)] data-[state=checked]:border-[color:var(--ole-green)]
 focus:ring-[color:var(--ole-green)]"
            />
            <Label htmlFor="isCurrent">Jag jobbar här nu</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beskrivning</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Beskriv din roll och dina ansvarsområden..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Avbryt
            </Button>
            <Button className="bg-[var(--ole-green)] hover:bg-[var(--hover-green)]" type="submit">Lägg till erfarenhet</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}