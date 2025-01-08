import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreateListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentListId?: string;
  onSuccess: () => void;
}

export function CreateListDialog({ open, onOpenChange, parentListId, onSuccess }: CreateListDialogProps) {
  const [newListName, setNewListName] = useState("");

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      toast.error("Du måste ange ett namn för listan");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Du måste vara inloggad för att skapa en lista");
        return;
      }

      const { error } = await supabase
        .from('user_lists')
        .insert([
          { 
            name: newListName, 
            user_id: user.id,
            parent_list_id: parentListId 
          }
        ]);

      if (error) throw error;

      setNewListName("");
      onOpenChange(false);
      onSuccess();
      toast.success("Listan har skapats");
    } catch (error) {
      console.error('Error creating list:', error);
      toast.error("Ett fel uppstod när listan skulle skapas");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Skapa ny lista</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            placeholder="Listans namn"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
          <Button 
            className="w-full bg-sage-500 hover:bg-sage-600"
            onClick={handleCreateList}
          >
            Skapa lista
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}