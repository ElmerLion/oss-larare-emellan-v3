import { AppSidebar } from "@/components/AppSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { FilterSidebar, ResourceFilters } from "@/components/FilterSidebar";
import { CreateResourceDialog } from "@/components/CreateResourceDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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
}

const difficultyMap = {
  easy: "Lätt",
  medium: "Medel",
  hard: "Svår"
};

export default function Resurser() {
  const { toast } = useToast();
  const [filters, setFilters] = useState<ResourceFilters>({
    orderBy: 'created_at',
    type: 'all',
    subject: 'all',
    grade: 'all',
    difficulty: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['resources', filters, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('resources')
        .select('*')
        
      // Apply filters
      if (filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }
      if (filters.subject !== 'all') {
        query = query.eq('subject', filters.subject);
      }
      if (filters.grade !== 'all') {
        query = query.eq('grade', filters.grade);
      }
      if (filters.difficulty !== 'all') {
        query = query.eq('difficulty', filters.difficulty);
      }
      
      // Apply search
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Apply ordering
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data as Resource[];
    }
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
      toast({
        title: "Error",
        description: "Kunde inte ladda ner filen. Försök igen.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-[#F6F6F7]">
      <AppSidebar />
      <FilterSidebar 
        onFilterChange={setFilters}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <CreateResourceDialog />

          <ScrollArea className="h-[calc(100vh-40px)]">
            {isLoading ? (
              <div className="text-center py-4">Laddar resurser...</div>
            ) : resources.length === 0 ? (
              <div className="text-center py-4">Inga resurser hittades</div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-white rounded-lg p-6 shadow-sm relative group"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Bookmark className="h-5 w-5" />
                    </Button>
                    
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
                      <Button variant="secondary" className="w-full bg-sage-200 hover:bg-sage-300">
                        Se mer
                      </Button>
                      <Button 
                        variant="secondary" 
                        className="w-full bg-sage-200 hover:bg-sage-300"
                        onClick={() => handleDownload(resource)}
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
      </div>
    </div>
  );
}