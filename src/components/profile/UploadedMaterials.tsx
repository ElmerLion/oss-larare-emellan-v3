import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ResourceCard } from "@/components/resources/ResourceCard";

interface Resource {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  type: string;
  difficulty: "easy" | "medium" | "hard";
  file_path: string;
  file_name: string;
  author_id: string;
}

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
      return data as Resource[];
    },
  });

  const handleDownload = async (resource: Resource) => {
    try {
      const { data, error } = await supabase.storage
        .from('resources')
        .download(resource.file_path);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = resource.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
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
              <ResourceCard
                key={resource.id}
                resource={resource}
                onSelect={() => {}}
                onDownload={handleDownload}
                onSave={() => {}}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
