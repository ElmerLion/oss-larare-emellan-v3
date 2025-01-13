import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { ResourceDetailsDialog } from "./resources/ResourceDetailsDialog";

interface Material {
  title: string;
  type: string;
}

interface PostMaterialProps {
  materials: Material[];
}

export function PostMaterial({ materials }: PostMaterialProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: materialDetails } = useQuery({
    queryKey: ['material', selectedMaterial],
    queryFn: async () => {
      if (!selectedMaterial) return null;
      
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('title', selectedMaterial)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!selectedMaterial
  });

  const handleDownload = async (material: Material) => {
    try {
      const { data: resourceData } = await supabase
        .from('resources')
        .select('file_path, file_name')
        .eq('title', material.title)
        .single();

      if (!resourceData?.file_path) {
        toast({
          title: "Error",
          description: "Kunde inte hitta filen",
          variant: "destructive",
        });
        return;
      }

      const { error: updateError } = await supabase
                  .from('resources')
                  .update({ downloads: (resourceData.downloads || 0) + 1 })
                  .eq('title', material.title);

              if (updateError) {
                  console.error('Error updating downloads count:', updateError);
                  toast({
                      title: "Error",
                      description: "Kunde inte uppdatera nedladdningsantalet",
                      variant: "destructive",
                  });
                  return;
      }

      const { data, error } = await supabase.storage
        .from('resources')
        .download(resourceData.file_path);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = resourceData.file_name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Nedladdningen har startats",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Kunde inte ladda ner filen",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mb-4">
      {materials.map((material, index) => (
        <div
          key={index}
          className="bg-gray-50 border border-gray-200 rounded p-3 flex items-center justify-between"
        >
          <span 
            className="font-medium text-gray-700 cursor-pointer hover:text-sage-600"
            onClick={() => setSelectedMaterial(material.title)}
          >
            {material.title}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDownload(material)}
          >
            Ladda ner
          </Button>
        </div>
      ))}

      {materialDetails && (
        <ResourceDetailsDialog
          resource={materialDetails}
          open={!!selectedMaterial}
          onOpenChange={(open) => !open && setSelectedMaterial(null)}
        />
      )}
    </div>
  );
}