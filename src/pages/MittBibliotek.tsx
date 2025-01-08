import { AppSidebar } from "@/components/AppSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LibraryList } from "@/components/library/LibraryList";
import { CreateListDialog } from "@/components/library/CreateListDialog";

interface SavedItem {
  id: string;
  title: string;
  type: 'post' | 'resource';
}

interface List {
  id: string;
  name: string;
  savedItems: SavedItem[];
}

async function fetchUserLists() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Fetch user's lists
  const { data: lists, error: listsError } = await supabase
    .from('user_lists')
    .select('*')
    .eq('user_id', user.id);

  if (listsError) throw listsError;

  const enrichedLists: List[] = [];

  for (const list of lists) {
    const savedItems: SavedItem[] = [];

    // Fetch saved posts
    const { data: savedPosts } = await supabase
      .from('list_saved_posts')
      .select(`
        id,
        post:posts(
          id,
          content
        )
      `)
      .eq('list_id', list.id);

    savedPosts?.forEach(item => {
      if (item.post) {
        savedItems.push({
          id: item.post.id,
          title: item.post.content.substring(0, 100) + "...",
          type: 'post'
        });
      }
    });

    // Fetch saved resources
    const { data: savedResources } = await supabase
      .from('list_saved_resources')
      .select(`
        id,
        resource:resources(
          id,
          title
        )
      `)
      .eq('list_id', list.id);

    savedResources?.forEach(item => {
      if (item.resource) {
        savedItems.push({
          id: item.resource.id,
          title: item.resource.title,
          type: 'resource'
        });
      }
    });

    enrichedLists.push({
      id: list.id,
      name: list.name,
      savedItems
    });
  }

  return enrichedLists;
}

export default function MittBibliotek() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: lists = [], isLoading, error, refetch } = useQuery({
    queryKey: ['userLists'],
    queryFn: fetchUserLists
  });

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Laddar...</div>;
  }

  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-500">Ett fel uppstod</div>;
  }

  return (
    <div className="flex h-screen bg-[#F6F6F7]">
      <AppSidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Mitt Bibliotek</h1>
            
            <Button 
              className="bg-sage-500 hover:bg-sage-600"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Skapa ny lista
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-140px)]">
            <div className="grid grid-cols-1 gap-6">
              {lists.map((list) => (
                <LibraryList key={list.id} list={list} />
              ))}

              {lists.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Du har inga listor än. Skapa en ny lista för att börja spara innehåll!
                </div>
              )}
            </div>
          </ScrollArea>

          <CreateListDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSuccess={refetch}
          />
        </div>
      </div>
    </div>
  );
}