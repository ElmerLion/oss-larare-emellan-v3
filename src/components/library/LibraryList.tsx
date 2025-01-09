import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ResourceDetailsDialog } from "@/components/resources/ResourceDetailsDialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SavedListItem } from "./SavedListItem";

interface SavedItem {
  id: string;
  title: string;
  type: 'post' | 'resource';
}

interface LibraryListProps {
  list: {
    id: string;
    name: string;
    savedItems: SavedItem[];
  };
  onDelete?: () => void;
}

export function LibraryList({ list, onDelete }: LibraryListProps) {
  const [selectedResource, setSelectedResource] = useState<string | null>(null);

  const { data: resourceDetails } = useQuery({
    queryKey: ['resource', selectedResource],
    queryFn: async () => {
      if (!selectedResource) return null;
      const { data } = await supabase
        .from('resources')
        .select('*')
        .eq('id', selectedResource)
        .single();
      return data;
    },
    enabled: !!selectedResource
  });

  const handleItemClick = (item: SavedItem) => {
    if (item.type === 'resource') {
      setSelectedResource(item.id);
    }
  };

  const handleDeleteList = async () => {
    try {
      const { error } = await supabase
        .from('user_lists')
        .delete()
        .eq('id', list.id);

      if (error) throw error;

      toast.success("Listan har tagits bort");
      onDelete?.();
    } catch (error) {
      console.error('Error deleting list:', error);
      toast.error("Kunde inte ta bort listan");
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">{list.name}</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDeleteList}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {list.savedItems.length > 0 ? (
        <div className="space-y-2">
          {list.savedItems.map((item) => (
            <SavedListItem
              key={item.id}
              item={item}
              listId={list.id}
              onItemClick={handleItemClick}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">Inga sparade objekt i denna lista</p>
      )}

      {resourceDetails && (
        <ResourceDetailsDialog
          resource={resourceDetails}
          open={!!selectedResource}
          onOpenChange={(open) => !open && setSelectedResource(null)}
        />
      )}
    </div>
  );
}