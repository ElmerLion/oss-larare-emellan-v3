// HomeStats.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserPlus, FileText, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserListPopup from "@/components/home/UserListPopup";

const HomeStats = () => {
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

  // State for controlling the user list popup
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [userListTitle, setUserListTitle] = useState("");
  const [userList, setUserList] = useState<any[]>([]); // Replace 'any' with your ExtendedProfile type if available

  // Fetch all active teachers (for this example, we just fetch all profiles)
  const fetchActiveTeachers = async () => {
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) {
      console.error("Error fetching active teachers:", error);
      return [];
    }
    return data;
  };

  // Fetch new teachers: those who signed up within the last week
  const fetchNewTeachers = async () => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .gte("created_at", oneWeekAgo);
    if (error) {
      console.error("Error fetching new teachers:", error);
      return [];
    }
    return data;
  };

  const handleActiveTeachers = async () => {
    const activeTeachersList = await fetchActiveTeachers();
    setUserList(activeTeachersList);
    setUserListTitle("Aktiva Lärare");
    setIsUserListOpen(true);
  };

  const handleNewTeachers = async () => {
    const newTeachersList = await fetchNewTeachers();
    setUserList(newTeachersList);
    setUserListTitle("Nya lärare");
    setIsUserListOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Button onClick={handleActiveTeachers} className="block">
          <div className="bg-white p-4 rounded-lg border border-gray-200 transform transition-transform duration-300 hover:scale-95">
            <div className="flex flex-col items-center mb-3">
              <Users className="w-5 h-5 text-[var(--secondary2)]" />
              <div className="text-3xl font-semibold text-[var(--secondary2)]">
                {stats?.activeTeachers || 0}
              </div>
            </div>
            <div className="text-sm text-gray-500 text-center">Aktiva Lärare</div>
          </div>
        </Button>

        <Button onClick={handleNewTeachers} className="block">
          <div className="bg-white p-4 rounded-lg border border-gray-200 transform transition-transform duration-300 hover:scale-95">
            <div className="flex flex-col items-center mb-3">
              <UserPlus className="w-5 h-5 text-[var(--secondary)]" />
              <div className="text-3xl font-semibold text-[var(--secondary)]">
                {stats?.newTeachers || 0}
              </div>
            </div>
            <div className="text-sm text-gray-500 text-center">Nya lärare</div>
          </div>
        </Button>

        <Link to="/resurser" className="block">
          <div className="bg-white p-4 rounded-lg border border-gray-200 transform transition-transform duration-300 hover:scale-95">
            <div className="flex flex-col items-center mb-3">
              <FileText className="w-5 h-5 text-[var(--secondary2)]" />
              <div className="text-3xl font-semibold text-[var(--secondary2)]">
                {stats?.sharedMaterials || 0}
              </div>
            </div>
            <div className="text-sm text-gray-500 text-center">Resurser delade</div>
          </div>
        </Link>

        <Link to="/resurser" className="block">
          <div className="bg-white p-4 rounded-lg border border-gray-200 transform transition-transform duration-300 hover:scale-95">
            <div className="flex flex-col items-center mb-3">
              <Download className="w-5 h-5 text-[var(--secondary)]" />
              <div className="text-3xl font-semibold text-[var(--secondary)]">
                {stats?.totalDownloads || 0}
              </div>
            </div>
            <div className="text-sm text-gray-500 text-center">Resurser nedladdade</div>
          </div>
        </Link>
      </div>
      <UserListPopup
        open={isUserListOpen}
        onOpenChange={setIsUserListOpen}
        title={userListTitle}
        users={userList}
      />
    </>
  );
};

export default HomeStats;
