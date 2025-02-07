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
  // Optionally, you can add subject_level if needed in TypeScript:
  subject_level?: string | null;
}

export default function Resurser() {
  const [filters, setFilters] = useState<ResourceFilters>({
    orderBy: "created_at",
    type: "all",
    school: "",         // e.g. "Gymnasiet" or "Grundskola"
    subject: "all",     // For Grundskola: subject; for Gymnasiet: course subject
    grade: "all",       // For Grundskola only
    courseLevel: "all", // For Gymnasiet only
    difficulty: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["resources", filters, searchQuery],
    queryFn: async () => {
      let query = supabase.from("resources").select("*");

      // Apply filters for type and difficulty
      if (filters.type !== "all") {
        query = query.eq("type", filters.type);
      }
      if (filters.difficulty !== "all") {
        query = query.eq("difficulty", filters.difficulty);
      }

      // Apply school-level filtering
      if (filters.school) {
        if (filters.school === "Gymnasiet") {
          // Ensure only Gymnasiet resources are returned by checking grade.
          query = query.eq("grade", "Gymnasiet");
          // For Gymnasiet, if a course level is selected, filter by subject_level.
          if (filters.courseLevel !== "all") {
            query = query.eq("subject_level", filters.courseLevel);
          } else if (filters.subject !== "all") {
            // If only a course subject is selected, perform a prefix search on subject.
            query = query.ilike("subject", `${filters.subject}%`);
          }
        } else if (filters.school === "Grundskola") {
          // For Grundskola, filter the grade column.
          if (filters.grade === "all") {
            query = query.in("grade", [
              "Årskurs 1",
              "Årskurs 2",
              "Årskurs 3",
              "Årskurs 4",
              "Årskurs 5",
              "Årskurs 6",
              "Årskurs 7",
              "Årskurs 8",
              "Årskurs 9",
            ]);
          } else {
            query = query.eq("grade", filters.grade);
          }
          // Also filter subject exactly if provided.
          if (filters.subject !== "all") {
            query = query.eq("subject", filters.subject);
          }
        }
      } else {
        // If no school filter is set, allow filtering by grade or subject if chosen.
        if (filters.grade !== "all") {
          query = query.eq("grade", filters.grade);
        }
        if (filters.subject !== "all") {
          query = query.eq("subject", filters.subject);
        }
      }

      // Apply search query
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Apply ordering
      switch (filters.orderBy) {
        case "downloads":
          query = query.order("downloads", { ascending: false });
          break;
        case "rating":
          query = query.order("rating", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

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
          <CreateResourceDialog
            triggerElement={
              <Button className="w-full bg-[color:var(--ole-green)] border-[color:var(--hover-green)] hover:bg-[color:var(--hover-green)] text-white py-6 text-lg font-medium mb-6">
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
