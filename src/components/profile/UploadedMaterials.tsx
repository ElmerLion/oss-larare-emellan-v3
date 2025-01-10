import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UploadedMaterialsProps {
  userId: string;
  isCurrentUser: boolean;
}

export function UploadedMaterials({ userId, isCurrentUser }: UploadedMaterialsProps) {
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['userResources', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('author_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const difficultyMap = {
    easy: "Lätt",
    medium: "Medel",
    hard: "Svår"
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Uppladdade Material</h2>
        {isCurrentUser && (
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Ladda upp material
          </Button>
        )}
      </div>
      
      <ScrollArea className="h-[400px]">
        {isLoading ? (
          <div className="text-center py-4">Laddar material...</div>
        ) : resources.length === 0 ? (
          <div className="text-center py-4">Inga material uppladdade än</div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                    {resource.subject}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                    {resource.grade}
                  </span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                    {difficultyMap[resource.difficulty]}
                  </span>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="secondary" 
                    className="w-full bg-sage-100 hover:bg-sage-200"
                  >
                    Se mer
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="w-full bg-sage-100 hover:bg-sage-200"
                  >
                    Ladda ner
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}