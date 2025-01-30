import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface Material {
  id: string;
  title: string;
  description: string;
  type: string;
}

interface LinkMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (material: Material) => void;
}

export function LinkMaterialDialog({ open, onOpenChange, onSelect }: LinkMaterialDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ['userMaterials'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('resources')
        .select('id, title, description, type')
        .eq('author_id', user.id)
        .ilike('title', `%${searchQuery}%`);

      if (error) throw error;
      return data;
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[525px]"
        aria-describedby="dialog-description"
      >
        <DialogHeader>
          <DialogTitle>Välj material att länka</DialogTitle>
        </DialogHeader>

        <div id="dialog-description" className="text-sm text-gray-600">
          Select a material to link with your message.
        </div>

        <div className="space-y-4">
          <Input
            placeholder="Sök material..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ScrollArea className="h-[400px] pr-4">
            {isLoading ? (
              <div className="text-center py-4">Laddar material...</div>
            ) : materials.length === 0 ? (
              <div className="text-center py-4">Inga material hittade</div>
            ) : (
              <div className="space-y-4">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      onSelect(material);
                      onOpenChange(false);
                    }}
                  >
                    <h3 className="font-medium">{material.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>

    </Dialog>
  );
}