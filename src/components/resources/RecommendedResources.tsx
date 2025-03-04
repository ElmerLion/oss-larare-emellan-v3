import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateResourceDialog } from "@/components/CreateResourceDialog";

const grundskolaGrades = [
  "Årskurs 1",
  "Årskurs 2",
  "Årskurs 3",
  "Årskurs 4",
  "Årskurs 5",
  "Årskurs 6",
  "Årskurs 7",
  "Årskurs 8",
  "Årskurs 9",
];

export function RecommendedResources() {
  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ["recommendedResourcesProfile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("subjects, education_level")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: resources, isLoading: resourcesLoading, error: resourcesError } = useQuery({
    queryKey: ["recommended-resources", profile?.subjects, profile?.education_level],
    queryFn: async () => {
      if (!profile || !profile.subjects || profile.subjects.length === 0) return [];
      let query = supabase.from("resources").select("*").in("subject", profile.subjects);
      if (profile.education_level === "Gymnasiet") {
        query = query.eq("grade", "Gymnasiet");
      } else if (profile.education_level === "Grundskola") {
        query = query.in("grade", grundskolaGrades);
      }
      query = query.order("created_at", { ascending: false }).limit(10);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!profile,
  });

  // Determine the number of cards per slide based on window width.
  const [cardsPerSlide, setCardsPerSlide] = useState(1);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setCardsPerSlide(2);
      } else {
        setCardsPerSlide(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (profileLoading || resourcesLoading) {
    return <div>Laddar rekommenderade resurser...</div>;
  }
  if (profileError || resourcesError) {
    return <div>Ett fel uppstod vid hämtning av rekommenderade resurser.</div>;
  }
  if (!resources || resources.length === 0) {
    return (
      <div className="mb-8">
        <div className="text-center text-gray-500">
          Inga rekommenderade resurser hittades inom dina ämnen. Dela dina resurser för att hjälpa andra!
        </div>
        <div className="flex justify-center mt-4">
          <CreateResourceDialog triggerElement={<Button variant="outline">Dela resurs</Button>} />
        </div>
      </div>
    );
  }

  // Get the items for the current slide.
  const visibleResources = resources.slice(currentIndex, currentIndex + cardsPerSlide);

  return (
    <div className="mb-8 w-full">
      <h2 className="text-2xl font-semibold mb-4">
        Nya resurser inom dina ämnen
      </h2>
      <div className="relative">
        {/* Left Arrow */}
        {currentIndex > 0 && (
          <button
            onClick={() => setCurrentIndex(currentIndex - cardsPerSlide)}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {/* Carousel Container */}
        <div className="flex justify-center space-x-4 overflow-hidden">
          {visibleResources.map((resource) => (
            <div
              key={resource.id}
              // If two cards per slide, each gets 50% minus gap; else full width.
              style={{ width: cardsPerSlide === 2 ? "calc(50% - 0.5rem)" : "100%" }}
            >
              <ResourceCard resource={resource} />
            </div>
          ))}
        </div>
        {/* Right Arrow */}
        {currentIndex + cardsPerSlide < resources.length && (
          <button
            onClick={() => setCurrentIndex(currentIndex + cardsPerSlide)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}

export default RecommendedResources;
