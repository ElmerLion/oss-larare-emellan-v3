// ResourceTabContent.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ResourceCard } from "@/components/resources/ResourceCard";
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
  subject_level?: string | null;
}

interface ResourceTabContentProps {
  initialSearchQuery: string;
}

export default function ResourceTabContent({ initialSearchQuery }: ResourceTabContentProps) {
  // Use a default filter object for ordering/searching; no UI to change these
  const defaultFilters = {
    orderBy: "created_at",
    type: "all",
    school: "",
    subject: "all",
    grade: "all",
    courseLevel: "all",
    difficulty: "all",
  };

  const [searchQuery] = useState(initialSearchQuery);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const { data: queryResult, isLoading } = useQuery({
    queryKey: ["resources", defaultFilters, searchQuery, page],
    queryFn: async () => {
      let queryBuilder = supabase.from("resources").select("*", { count: "exact" });

      // --- School-level Filtering (based on default values) ---
      if (defaultFilters.school) {
        if (defaultFilters.school === "Gymnasiet") {
          queryBuilder = queryBuilder.eq("grade", "Gymnasiet");
          if (defaultFilters.courseLevel !== "all") {
            queryBuilder = queryBuilder.eq("subject_level", defaultFilters.courseLevel);
          } else if (defaultFilters.subject !== "all") {
            queryBuilder = queryBuilder.ilike("subject", `${defaultFilters.subject}%`);
          }
        } else if (defaultFilters.school === "Grundskola") {
          if (defaultFilters.grade === "all") {
            queryBuilder = queryBuilder.in("grade", [
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
            queryBuilder = queryBuilder.eq("grade", defaultFilters.grade);
          }
          if (defaultFilters.subject !== "all") {
            queryBuilder = queryBuilder.eq("subject", defaultFilters.subject);
          }
        }
      } else {
        if (defaultFilters.grade !== "all") {
          queryBuilder = queryBuilder.eq("grade", defaultFilters.grade);
        }
        if (defaultFilters.subject !== "all") {
          queryBuilder = queryBuilder.eq("subject", defaultFilters.subject);
        }
      }

      // --- Search Query ---
      if (searchQuery) {
        queryBuilder = queryBuilder.or(
          `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
        );
      }

      // --- Ordering ---
      switch (defaultFilters.orderBy) {
        case "downloads":
          queryBuilder = queryBuilder.order("downloads", { ascending: false });
          break;
        case "rating":
          queryBuilder = queryBuilder.order("rating", { ascending: false });
          break;
        default:
          queryBuilder = queryBuilder.order("created_at", { ascending: false });
      }

      // --- Pagination ---
      queryBuilder = queryBuilder.range((page - 1) * pageSize, page * pageSize - 1);

      const { data, error, count } = await queryBuilder;
      if (error) throw error;
      return { resources: data as Resource[], count: count ?? 0 };
    },
  });

  const resources = queryResult?.resources || [];
  const totalResources = queryResult?.count || 0;
  const totalPages = Math.ceil(totalResources / pageSize);

  return (
    <div className="bg-[#F6F6F7] p-6">
      {isLoading ? (
        <div className="text-center py-4">Laddar resurser...</div>
      ) : resources.length === 0 ? (
        <div className="text-center py-4">Inga resurser hittades</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
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
  );
}
