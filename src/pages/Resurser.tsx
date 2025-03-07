import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FilterSidebar, ResourceFilters } from "@/components/FilterSidebar";
import { CreateResourceDialog } from "@/components/CreateResourceDialog";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  // Set up filters
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

  // For mobile/tablet, toggle filter sidebar visibility.
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

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
          query = query.eq("grade", "Gymnasiet");
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
      {/* Main container: on mobile/tablet ml-0; on large screens, reserve space for the AppSidebar */}
      <div className="flex flex-1 ml-0 lg:ml-[235px]">
        {/* Flex container to arrange FilterSidebar and Resource Area */}
        <div className="flex flex-col lg:flex-row w-full">
          {/* Left side: FilterSidebar */}
          <div className="w-full lg:w-64">
            {/* On large screens, always show FilterSidebar attached to AppSidebar */}
            <div className="hidden lg:block sticky top-0 h-screen bg-white border-r border-gray-300 p-6">
              <FilterSidebar onFilterChange={setFilters} onSearchChange={setSearchQuery} />
            </div>
            {/* On mobile/tablet, render FilterSidebar above resource cards */}
            <div className="block lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="w-full flex items-center justify-between mb-2"
              >
                Filter
                {isMobileFiltersOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </Button>
              {isMobileFiltersOpen && (
                <div className="mb-4">
                  <FilterSidebar onFilterChange={setFilters} onSearchChange={setSearchQuery} />
                </div>
              )}
            </div>
          </div>
          {/* Right side: Main Resource Area */}
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
                  {/* Responsive grid: one column on very small devices, two columns on sm and up */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                      Föregående
                    </Button>
                    <span>
                      Sida {page} av {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={page === totalPages}
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    >
                      Nästa
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
