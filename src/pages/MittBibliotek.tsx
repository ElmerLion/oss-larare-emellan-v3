import { AppSidebar } from "@/components/AppSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface SavedItem {
  id: string;
  title: string;
  type: 'post' | 'material' | 'resource';
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

    // Fetch saved materials
    const { data: savedMaterials } = await supabase
      .from('list_saved_materials')
      .select(`
        id,
        material:post_materials(
          id,
          title
        )
      `)
      .eq('list_id', list.id);

    savedMaterials?.forEach(item => {
      if (item.material) {
        savedItems.push({
          id: item.material.id,
          title: item.material.title,
          type: 'material'
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
  const [newListName, setNewListName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: lists = [], isLoading, error, refetch } = useQuery({
    queryKey: ['userLists'],
    queryFn: fetchUserLists
  });

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      toast.error("Du måste ange ett namn för listan");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Du måste vara inloggad för att skapa en lista");
        return;
      }

      const { error } = await supabase
        .from('user_lists')
        .insert([
          { name: newListName, user_id: user.id }
        ]);

      if (error) throw error;

      setNewListName("");
      setIsDialogOpen(false);
      refetch();
      toast.success("Listan har skapats");
    } catch (error) {
      console.error('Error creating list:', error);
      toast.error("Ett fel uppstod när listan skulle skapas");
    }
  };

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
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-sage-500 hover:bg-sage-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Skapa ny lista
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Skapa ny lista</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Listans namn"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                  />
                  <Button 
                    className="w-full bg-sage-500 hover:bg-sage-600"
                    onClick={handleCreateList}
                  >
                    Skapa lista
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <ScrollArea className="h-[calc(100vh-140px)]">
            <div className="grid grid-cols-1 gap-6">
              {lists.map((list) => (
                <div
                  key={list.id}
                  className="bg-white rounded-lg p-6 shadow-sm space-y-4"
                >
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
                          className="bg-gray-50 p-3 rounded-md flex justify-between items-center"
                        >
                          <div>
                            <span className="text-gray-900">{item.title}</span>
                            <span className="ml-2 text-sm text-gray-500">({item.type})</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            {item.type === 'material' || item.type === 'resource' ? 'Ladda ner' : 'Visa'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">Inga sparade objekt i denna lista</p>
                  )}
                </div>
              ))}

              {lists.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Du har inga listor än. Skapa en ny lista för att börja spara innehåll!
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}