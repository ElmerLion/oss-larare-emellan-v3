import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Feed } from "@/components/Feed";
import { ProfileCard } from "@/components/ProfileCard";
import LatestDiscussions from "@/components/LatestDiscussions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import HomeStats from "@/components/home/HomeStats";
import RecommendedResources from "@/components/resources/RecommendedResources";

const Home = () => {
  const [firstName, setFirstName] = useState("");

  const { data: stats } = useQuery({
    queryKey: ["home-stats"],
    queryFn: async () => {
      const [
        { count: activeTeachers },
        { count: newTeachers },
        { count: sharedMaterials },
        { count: totalDownloads },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gte(
            "created_at",
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          ),
        supabase.from("resources").select("*", { count: "exact", head: true }),
        supabase.from("resource_downloads").select("*", { count: "exact", head: true }),
      ]);

      return {
        activeTeachers: activeTeachers || 0,
        newTeachers: newTeachers || 0,
        sharedMaterials: sharedMaterials || 0,
        totalDownloads: totalDownloads || 0,
      };
    },
  });

  // Fetch the current user's first name
  useEffect(() => {
    const fetchUserFirstName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        if (!error && profile?.full_name) {
          const first = profile.full_name.split(" ")[0];
          setFirstName(first);
        }
      }
    };
    fetchUserFirstName();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />

      {/* On extra-large screens, add left padding for the sidebar */}
      <main className="pl-0 lg:pl-64 pt-8">
        <div className="max-w-[1500px] mx-auto px-4 xl:px-6 py-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Column: full-width on screens below xl, 2/3 on xl and up */}
          <div className="xl:col-span-2 space-y-8">
            <h1 className="text-2xl font-semibold mb-2">
              Välkommen tillbaka {firstName || "-"}!
            </h1>
            <p className="text-gray-600 mb-8">
              Detta är vad som hänt senaste veckan
            </p>

            <HomeStats />
            <RecommendedResources />

            {/* LatestDiscussions is shown inline when the sidebar is hidden (i.e. below xl) */}
            <div className="xl:hidden">
              <LatestDiscussions />
            </div>

            <Feed />
          </div>

          {/* Sidebar Column: Only visible on xl and above */}
          <div className="hidden xl:block space-y-6">
            <ProfileCard />
            <LatestDiscussions />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
