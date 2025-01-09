import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface SavedItem {
  id: string;
  title: string;
  type: 'post' | 'resource';
}

interface SavedListItemProps {
  item: SavedItem;
  listId: string;
  onItemClick: (item: SavedItem) => void;
}

export function SavedListItem({ item, listId, onItemClick }: SavedListItemProps) {
  const queryClient = useQueryClient();

  const handleRemoveItem = async () => {
    try {
      const table = item.type === 'post' ? 'list_saved_posts' : 'list_saved_resources';
      const idField = item.type === 'post' ? 'post_id' : 'resource_id';

      const { error } = await supabase
        .from(table)
        .delete()
        .eq('list_id', listId)
        .eq(idField, item.id);

      if (error) throw error;

      toast.success("Objektet har tagits bort från listan");
      queryClient.invalidateQueries({ queryKey: ['userLists'] });
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error("Kunde inte ta bort objektet");
    }
  };

  return (
    <div className="bg-gray-50 p-3 rounded-md flex justify-between items-center cursor-pointer hover:bg-gray-100">
      <div 
        className="flex-1"
        onClick={() => onItemClick(item)}
      >
        <span className="text-gray-900">{item.title}</span>
        <span className="ml-2 text-sm text-gray-500">({item.type})</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRemoveItem}
        className="text-red-600 hover:text-red-700"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}