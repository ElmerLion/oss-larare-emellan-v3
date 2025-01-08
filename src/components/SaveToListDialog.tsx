import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface SaveToListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  itemType: 'post' | 'resource' | 'material';
}

type TableNames = 'list_saved_posts' | 'list_saved_resources' | 'list_saved_materials';

export function SaveToListDialog({ open, onOpenChange, itemId, itemType }: SaveToListDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: lists, isLoading } = useQuery({
    queryKey: ['user-lists'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_lists')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    }
  });

  const handleSaveToList = async (listId: string) => {
    try {
      let table: TableNames;
      let insertData: Record<string, any>;

      switch (itemType) {
        case 'post':
          table = 'list_saved_posts';
          insertData = { list_id: listId, post_id: itemId };
          break;
        case 'resource':
          table = 'list_saved_resources';
          insertData = { list_id: listId, resource_id: itemId };
          break;
        case 'material':
          table = 'list_saved_materials';
          insertData = { list_id: listId, material_id: itemId };
          break;
        default:
          throw new Error('Invalid item type');
      }

      const { error } = await supabase
        .from(table)
        .insert([insertData]);

      if (error) throw error;

      toast({
        title: "Sparad!",
        description: "Objektet har sparats i din lista",
      });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['user-lists'] });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving to list:', error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte spara objektet i listan",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Spara till lista</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : lists && lists.length > 0 ? (
          <div className="space-y-2">
            {lists.map((list) => (
              <Button
                key={list.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSaveToList(list.id)}
              >
                {list.name}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Du har inga listor än. Skapa en ny lista i Mitt Bibliotek.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}