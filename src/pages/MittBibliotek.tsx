import { AppSidebar } from "@/components/AppSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface List {
  id: string;
  name: string;
  savedPosts: {
    id: string;
    title: string;
    type: 'post';
  }[];
  savedMaterials: {
    id: string;
    title: string;
    type: 'material';
  }[];
}

// Placeholder data
const placeholderLists: List[] = [
  {
    id: '1',
    name: 'Favoriter',
    savedPosts: [
      { id: '1', title: 'Matematikövningar för årskurs 6', type: 'post' },
      { id: '2', title: 'Tips för distansundervisning', type: 'post' }
    ],
    savedMaterials: [
      { id: '1', title: 'Geometri presentation', type: 'material' },
      { id: '2', title: 'Övningsuppgifter algebra', type: 'material' }
    ]
  },
  {
    id: '2',
    name: 'Läsåret 2024',
    savedPosts: [
      { id: '3', title: 'Kreativa skrivövningar', type: 'post' }
    ],
    savedMaterials: [
      { id: '3', title: 'Grammatikgenomgång', type: 'material' }
    ]
  }
];

export default function MittBibliotek() {
  const [lists, setLists] = useState<List[]>(placeholderLists);
  const [newListName, setNewListName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

      const { data, error } = await supabase
        .from('user_lists')
        .insert([
          { name: newListName, user_id: user.id }
        ])
        .select()
        .single();

      if (error) throw error;

      const newList: List = {
        id: data.id,
        name: data.name,
        savedPosts: [],
        savedMaterials: []
      };

      setLists([...lists, newList]);
      setNewListName("");
      setIsDialogOpen(false);
      toast.success("Listan har skapats");
    } catch (error) {
      console.error('Error creating list:', error);
      toast.error("Ett fel uppstod när listan skulle skapas");
    }
  };

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

                  {list.savedPosts.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Sparade inlägg</h3>
                      <div className="space-y-2">
                        {list.savedPosts.map((post) => (
                          <div
                            key={post.id}
                            className="bg-gray-50 p-3 rounded-md flex justify-between items-center"
                          >
                            <span className="text-gray-900">{post.title}</span>
                            <Button variant="ghost" size="sm">Visa</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {list.savedMaterials.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Sparade material</h3>
                      <div className="space-y-2">
                        {list.savedMaterials.map((material) => (
                          <div
                            key={material.id}
                            className="bg-gray-50 p-3 rounded-md flex justify-between items-center"
                          >
                            <span className="text-gray-900">{material.title}</span>
                            <Button variant="ghost" size="sm">Ladda ner</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}