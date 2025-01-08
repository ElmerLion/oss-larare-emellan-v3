import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { ResourceDetailsDialog } from "@/components/resources/ResourceDetailsDialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
}

export function LibraryList({ list }: LibraryListProps) {
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
    // Handle post clicks if needed
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">{list.name}</h2>
        <Button variant="outline" size="sm">
          <FolderPlus className="w-4 h-4 mr-2" />
          Lägg till
        </Button>
      </div>

      {list.savedItems.length > 0 ? (
        <div className="space-y-2">
          {list.savedItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 p-3 rounded-md flex justify-between items-center cursor-pointer hover:bg-gray-100"
              onClick={() => handleItemClick(item)}
            >
              <div>
                <span className="text-gray-900">{item.title}</span>
                <span className="ml-2 text-sm text-gray-500">({item.type})</span>
              </div>
              <Button variant="ghost" size="sm">
                {item.type === 'resource' ? 'Ladda ner' : 'Visa'}
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
    </div>
  );
}