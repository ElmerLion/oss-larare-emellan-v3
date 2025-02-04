import { AppSidebar } from "@/components/AppSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilterSidebar, ResourceFilters } from "@/components/FilterSidebar";
import { CreateResourceDialog } from "@/components/CreateResourceDialog";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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

export default function Resurser() {
  const [filters, setFilters] = useState<ResourceFilters>({
    orderBy: "created_at",
    type: "all",
    subject: "all",
    grade: "all",
    difficulty: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["resources", filters, searchQuery],
    queryFn: async () => {
      let query = supabase.from("resources").select("*");

      if (filters.type !== "all") query = query.eq("type", filters.type);
      if (filters.subject !== "all") query = query.eq("subject", filters.subject);
      if (filters.grade !== "all") query = query.eq("grade", filters.grade);
      if (filters.difficulty !== "all") query = query.eq("difficulty", filters.difficulty);

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data as Resource[];
    },
  });

  return (
    <div className="flex h-screen bg-[#F6F6F7]">
      <AppSidebar />
      <FilterSidebar onFilterChange={setFilters} onSearchChange={setSearchQuery} />

      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Use the custom trigger element to render the big full-width ole-green button */}
          <CreateResourceDialog
            triggerElement={
              <Button
                className="w-full bg-[color:var(--ole-green)] border-[color:var(--hover-green)] hover:bg-[color:var(--hover-green)] text-white py-6 text-lg font-medium mb-6"
              >
                Dela material
              </Button>
            }
          />

          <ScrollArea className="h-[calc(100vh-40px)]">
            {isLoading ? (
              <div className="text-center py-4">Laddar resurser...</div>
            ) : resources.length === 0 ? (
              <div className="text-center py-4">Inga resurser hittades</div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {resources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
