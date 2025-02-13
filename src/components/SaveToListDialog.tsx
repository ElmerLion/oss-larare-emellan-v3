import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SaveToListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  itemType: 'post' | 'resource';
}

type TableNames = 'list_saved_posts' | 'list_saved_resources';

export function SaveToListDialog({ open, onOpenChange, itemId, itemType }: SaveToListDialogProps) {
  const queryClient = useQueryClient();
  const [isCreatingNewList, setIsCreatingNewList] = useState(false);
  const [newListName, setNewListName] = useState("");

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
      const table: TableNames = itemType === 'post' ? 'list_saved_posts' : 'list_saved_resources';
      const idField = itemType === 'post' ? 'post_id' : 'resource_id';

      const { data, error } = await supabase
        .from(table)
        .select('list_id')
        .eq(idField, itemId);

      if (error) throw error;
      return data.map((item) => item.list_id);
    },
    enabled: !!itemId,
  });

  const handleListClick = async (listId: string) => {
    try {
      const table: TableNames = itemType === 'post' ? 'list_saved_posts' : 'list_saved_resources';
      const idField = itemType === 'post' ? 'post_id' : 'resource_id';

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
      console.error("Error managing list item:", error);
      toast({ title: "Ett fel uppstod" });
    }
  };

  const handleCreateNewList = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_lists')
        .insert({
          name: newListName,
          user_id: user.id,
        });

      if (error) throw error;
      toast.success("Ny lista skapad");
      setNewListName("");
      setIsCreatingNewList(false);
      queryClient.invalidateQueries({ queryKey: ['user-lists'] });
    } catch (error) {
      console.error("Error creating new list:", error);
      toast({ title: "Kunde inte skapa ny lista" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-lg shadow-lg p-4">
        <DialogHeader>
          <DialogTitle>Spara till lista</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            {lists && lists.length > 0 ? (
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
              <p className="text-center text-gray-500 p-4">
                Du har inga listor än.
              </p>
            )}

            {isCreatingNewList ? (
              <div className="mt-4 space-y-2">
                <Input
                  placeholder="Namn på ny lista"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreatingNewList(false)}>
                    Avbryt
                  </Button>
                  <Button className="bg-[var(--ole-green)] hover:bg-[var(--hover-green)]" onClick={handleCreateNewList}>Skapa lista</Button>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <Button className="w-full hover:text-white text-white bg-[var(--ole-green)] hover:bg-[var(--hover-green)]" variant="outline" onClick={() => setIsCreatingNewList(true)}>
                  Skapa ny lista
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
