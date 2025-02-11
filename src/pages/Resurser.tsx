import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/AppSidebar";
import { FilterSidebar, ResourceFilters } from "@/components/FilterSidebar";
import { CreateResourceDialog } from "@/components/CreateResourceDialog";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

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
  subject_level?: string | null;
}

export default function Resurser() {
  // Set up filters including school, subjects, etc.
  const [filters, setFilters] = useState<ResourceFilters>({
    orderBy: "created_at",
    type: "all",
    school: "",
    subject: "all",
    grade: "all",
    courseLevel: "all",
    difficulty: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const { data: queryResult, isLoading } = useQuery({
    queryKey: ["resources", filters, searchQuery, page],
    queryFn: async () => {
      let query = supabase.from("resources").select("*", { count: "exact" });

      // --- Type & Difficulty Filters ---
      if (filters.type !== "all") {
        query = query.eq("type", filters.type);
      }
      if (filters.difficulty !== "all") {
        query = query.eq("difficulty", filters.difficulty);
      }

      // --- School-level Filtering ---
      if (filters.school) {
        if (filters.school === "Gymnasiet") {
          // For Gymnasiet, we require the grade column to be exactly "Gymnasiet"
          query = query.eq("grade", "Gymnasiet");
          // Then use subject_level (if selected) or else a prefix search on subject.
          if (filters.courseLevel !== "all") {
            query = query.eq("subject_level", filters.courseLevel);
          } else if (filters.subject !== "all") {
            query = query.ilike("subject", `${filters.subject}%`);
          }
        } else if (filters.school === "Grundskola") {
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

      // --- Search Query ---
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // --- Ordering ---
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

      // --- Pagination ---
      query = query.range((page - 1) * pageSize, page * pageSize - 1);

      const { data, error, count } = await query;
      if (error) throw error;
      return { resources: data as Resource[], count: count ?? 0 };
    },
  });

  const resources = queryResult?.resources || [];
  const totalResources = queryResult?.count || 0;
  const totalPages = Math.ceil(totalResources / pageSize);

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F6F7]">
      {/* Main content area */}
      <div className="flex flex-1">
        <AppSidebar />
        {/* Content container with left margin equal to AppSidebar width */}
        <div className="flex flex-1 ml-[255px]">
          {/* Filters Sidebar – sticky with white background extending full height */}
          <div className="sticky top-0 h-screen">
            <FilterSidebar onFilterChange={setFilters} onSearchChange={setSearchQuery} />
          </div>
          {/* Main resource area: only this section scrolls */}
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <CreateResourceDialog
                triggerElement={
                  <Button className="w-full bg-[var(--ole-green)] border-[var(--hover-green)] hover:bg-[var(--hover-green)] text-white py-6 text-lg font-medium mb-6">
                    Dela Resurs
                  </Button>
                }
              />
              {isLoading ? (
                <div className="text-center py-4">Laddar resurser...</div>
              ) : resources.length === 0 ? (
                <div className="text-center py-4">Inga resurser hittades</div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    {resources.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                  {/* Pagination Controls */}
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    >
                      Previous
                    </Button>
                    <span>
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={page === totalPages}
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
