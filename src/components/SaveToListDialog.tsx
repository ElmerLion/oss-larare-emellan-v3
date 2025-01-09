import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";

interface SaveToListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  itemType: 'post' | 'resource';
}

type TableNames = 'list_saved_posts' | 'list_saved_resources';

export function SaveToListDialog({ open, onOpenChange, itemId, itemType }: SaveToListDialogProps) {
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

  const { data: savedLists } = useQuery({
    queryKey: ['saved-lists', itemType, itemId],
    queryFn: async () => {
      const table = itemType === 'post' ? 'list_saved_posts' : 'list_saved_resources';
      const idField = itemType === 'post' ? 'post_id' : 'resource_id';

      const { data, error } = await supabase
        .from(table)
        .select('list_id')
        .eq(idField, itemId);

      if (error) throw error;
      return data.map(item => item.list_id);
    },
    enabled: !!itemId
  });

  const handleListClick = async (listId: string) => {
    try {
      let table: TableNames;
      const idField = itemType === 'post' ? 'post_id' : 'resource_id';
      table = itemType === 'post' ? 'list_saved_posts' : 'list_saved_resources';

      if (savedLists?.includes(listId)) {
        // Remove from list
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('list_id', listId)
          .eq(idField, itemId);

        if (error) throw error;
        toast.success("Objektet har tagits bort från listan");
      } else {
        // Add to list
        const { error } = await supabase
          .from(table)
          .insert([{ list_id: listId, [idField]: itemId }]);

        if (error) throw error;
        toast.success("Objektet har sparats i din lista");
      }

      queryClient.invalidateQueries({ queryKey: ['user-lists'] });
      queryClient.invalidateQueries({ queryKey: ['saved-lists'] });
      onOpenChange(false);
    } catch (error) {
      console.error('Error managing list item:', error);
      toast.error("Ett fel uppstod");
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
                className="w-full justify-between"
                onClick={() => handleListClick(list.id)}
              >
                <span>{list.name}</span>
                {savedLists?.includes(list.id) && (
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                )}
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