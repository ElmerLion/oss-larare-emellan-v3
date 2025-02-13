import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { ResourceDetailsDialog } from "@/components/resources/ResourceDetailsDialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SavedListItem } from "./SavedListItem";

interface SavedItem {
  id: string;
  title: string;
  type: "post" | "resource";
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
  const [isPostsOpen, setIsPostsOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  const { data: resourceDetails } = useQuery({
    queryKey: ["resource", selectedResource],
    queryFn: async () => {
      if (!selectedResource) return null;
      const { data } = await supabase
        .from("resources")
        .select("*")
        .eq("id", selectedResource)
        .single();
      return data;
    },
    enabled: !!selectedResource,
  });

  const handleItemClick = (item: SavedItem) => {
    if (item.type === "resource") {
      setSelectedResource(item.id);
    }
  };

  const handleDeleteList = async () => {
    try {
      const { error } = await supabase.from("user_lists").delete().eq("id", list.id);

      if (error) throw error;

      toast( title: "Listan har tagits bort");
      onDelete?.();
    } catch (error) {
      console.error("Error deleting list:", error);
      toast.error("Kunde inte ta bort listan");
    }
  };

  const posts = list.savedItems.filter((item) => item.type === "post");
  const resources = list.savedItems.filter((item) => item.type === "resource");

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
        <div className="space-y-4">
          {/* Posts Section */}
          {posts.length > 0 && resources.length > 0 && (
            <div>
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsPostsOpen(!isPostsOpen)}
              >
                <h3 className="text-lg font-semibold text-gray-700">Inlägg</h3>
                {isPostsOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
              {isPostsOpen && (
                <div className="space-y-2 mt-2">
                  {posts.map((post) => (
                    <SavedListItem
                      key={post.id}
                      item={post}
                      listId={list.id}
                      onItemClick={handleItemClick}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Resources Section */}
          {resources.length > 0 && posts.length > 0 && (
            <div>
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
              >
                <h3 className="text-lg font-semibold text-gray-700">Resurser</h3>
                {isResourcesOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
              {isResourcesOpen && (
                <div className="space-y-2 mt-2">
                  {resources.map((resource) => (
                    <SavedListItem
                      key={resource.id}
                      item={resource}
                      listId={list.id}
                      onItemClick={handleItemClick}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* If Only One Type Exists */}
          {posts.length > 0 && resources.length === 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">Inlägg</h3>
              {posts.map((post) => (
                <SavedListItem
                  key={post.id}
                  item={post}
                  listId={list.id}
                  onItemClick={handleItemClick}
                />
              ))}
            </div>
          )}

          {resources.length > 0 && posts.length === 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">Resurser</h3>
              {resources.map((resource) => (
                <SavedListItem
                  key={resource.id}
                  item={resource}
                  listId={list.id}
                  onItemClick={handleItemClick}
                />
              ))}
            </div>
          )}
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
