import { Button } from "@/components/ui/button";
import { FolderPlus, Trash2, X } from "lucide-react";
import { ResourceDetailsDialog } from "@/components/resources/ResourceDetailsDialog";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreateListDialog } from "./CreateListDialog";
import { useToast } from "@/hooks/use-toast";

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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

      toast({
        title: "Lista borttagen",
        description: "Listan har tagits bort",
      });

      onDelete?.();
    } catch (error) {
      console.error('Error deleting list:', error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte ta bort listan",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (item: SavedItem) => {
    try {
      const table = item.type === 'post' ? 'list_saved_posts' : 'list_saved_resources';
      const idField = item.type === 'post' ? 'post_id' : 'resource_id';

      const { error } = await supabase
        .from(table)
        .delete()
        .eq('list_id', list.id)
        .eq(idField, item.id);

      if (error) throw error;

      toast({
        title: "Objekt borttaget",
        description: "Objektet har tagits bort från listan",
      });

      queryClient.invalidateQueries({ queryKey: ['userLists'] });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte ta bort objektet",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">{list.name}</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            Lägg till
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteList}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {list.savedItems.length > 0 ? (
        <div className="space-y-2">
          {list.savedItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 p-3 rounded-md flex justify-between items-center cursor-pointer hover:bg-gray-100"
            >
              <div 
                className="flex-1"
                onClick={() => handleItemClick(item)}
              >
                <span className="text-gray-900">{item.title}</span>
                <span className="ml-2 text-sm text-gray-500">({item.type})</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveItem(item)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
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

      <CreateListDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        parentListId={list.id}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['userLists'] });
        }}
      />
    </div>
  );
}