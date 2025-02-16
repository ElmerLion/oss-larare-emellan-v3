import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Feed } from "@/components/Feed";
import { ProfileCard } from "@/components/ProfileCard";
import { Users, UserPlus, FileText, Download } from "lucide-react";
import LatestDiscussions from "@/components/LatestDiscussions"; // Import the component
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
          .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
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

      <main className="pl-64 pt-8">
        <div className="max-w-[1500px] mx-auto px-6 py-8 grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <h1 className="text-2xl font-semibold mb-2">
              Välkommen tillbaka {firstName || "-"}!
            </h1>
            <p className="text-gray-600 mb-8">Detta är vad som hänt senaste veckan</p>

            <HomeStats />
            <RecommendedResources />
            <Feed />
          </div>

          <div className="space-y-6">
            <ProfileCard />
            <LatestDiscussions /> {/* Use the component */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
