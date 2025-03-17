import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserPlus, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserListPopup from "@/components/home/UserListPopup";
import ResourceListPopup from "@/components/home/ResourceListPopup";

const HomeStats = () => {
    const { data: stats } = useQuery({
        queryKey: ["home-stats"],
        queryFn: async () => {
            // Query for active teachers, new teachers and resource downloads:
            const [
                { count: activeTeachers },
                { count: newTeachers },
                { data: resourcesData },
            ] = await Promise.all([
                supabase.from("profiles").select("*", { count: "exact", head: true }),
                supabase
                    .from("profiles")
                    .select("*", { count: "exact", head: true })
                    .gte(
                        "created_at",
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                    ),
                supabase.from("resources").select("downloads"),
            ]);

            // Sum up downloads from each resource
            const totalDownloads =
                resourcesData?.reduce(
                    (sum, resource) => sum + (resource.downloads || 0),
                    0
                ) || 0;

            // Get recommended resources count based on the current user
            let recommendedResourcesCount = 0;
            const { data: userData } = await supabase.auth.getUser();
            const user = userData?.user;
            if (user) {
                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("subjects, education_level")
                    .eq("id", user.id)
                    .single();
                if (!profileError && profile && profile.subjects && profile.subjects.length > 0) {
                    let query = supabase
                        .from("resources")
                        .select("*", { count: "exact", head: true })
                        .in("subject", profile.subjects);
                    if (profile.education_level === "Gymnasiet") {
                        query = query.eq("grade", "Gymnasiet");
                    } else if (profile.education_level === "Grundskola") {
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
                        query = query.in("grade", grundskolaGrades);
                    }
                    const { count, error: recommendedError } = await query;
                    if (recommendedError) {
                        console.error("Error fetching recommended resources count:", recommendedError);
                    } else {
                        recommendedResourcesCount = count || 0;
                    }
                }
            }

            return {
                activeTeachers: activeTeachers || 0,
                newTeachers: newTeachers || 0,
                recommendedResources: recommendedResourcesCount,
                totalDownloads,
            };
        },
    });


    // State for controlling the user list popup
    const [isUserListOpen, setIsUserListOpen] = useState(false);
    const [userListTitle, setUserListTitle] = useState("");
    const [userList, setUserList] = useState<any[]>([]); // Replace 'any' with your ExtendedProfile type if available

    // State for controlling the resource popup
    const [isResourcePopupOpen, setIsResourcePopupOpen] = useState(false);
    const [resourcePopupTitle, setResourcePopupTitle] = useState("");
    const [recommendedResources, setRecommendedResources] = useState<any[]>([]); // Replace 'any' with your Resource type if available

    // Fetch all active teachers sorted by newest created_at
    const fetchActiveTeachers = async () => {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) {
            console.error("Error fetching active teachers:", error);
            return [];
        }
        return data;
    };

    // Fetch new teachers: those who signed up within the last week, sorted by newest created_at
    const fetchNewTeachers = async () => {
        const oneWeekAgo = new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
        ).toISOString();
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .gte("created_at", oneWeekAgo)
            .order("created_at", { ascending: false });
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

    const handleRecommendedResources = async () => {
        // Get current user
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            console.error("User not logged in");
            return;
        }
        // Get user's profile (subjects, education_level)
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("subjects, education_level")
            .eq("id", user.id)
            .single();
        if (profileError) {
            console.error("Error fetching profile:", profileError);
            return;
        }
        if (!profile || !profile.subjects || profile.subjects.length === 0) {
            console.log("No subjects found for the user");
            setRecommendedResources([]);
            setResourcePopupTitle("Rekommenderade Resurser");
            setIsResourcePopupOpen(true);
            return;
        }

        // Build the query for recommended resources based on subjects and education_level
        let query = supabase
            .from("resources")
            .select("*")
            .in("subject", profile.subjects);
        if (profile.education_level === "Gymnasiet") {
            query = query.eq("grade", "Gymnasiet");
        } else if (profile.education_level === "Grundskola") {
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
            query = query.in("grade", grundskolaGrades);
        }
        query = query.order("created_at", { ascending: false }).limit(10);
        const { data: resourcesData, error: resourcesError } = await query;
        if (resourcesError) {
            console.error("Error fetching recommended resources:", resourcesError);
            return;
        }
        setRecommendedResources(resourcesData || []);
        setResourcePopupTitle("Rekommenderade Resurser");
        setIsResourcePopupOpen(true);
    };

    const handleTopDownloads = async () => {
        // Query for the top 10 resources with the most downloads
        const { data: topDownloads, error: topDownloadsError } = await supabase
            .from("resources")
            .select("*")
            .order("downloads", { ascending: false })
            .limit(10);
        if (topDownloadsError) {
            console.error("Error fetching top downloaded resources:", topDownloadsError);
            return;
        }
        setRecommendedResources(topDownloads || []);
        setResourcePopupTitle("Topp 10 Nedladdade Resurser");
        setIsResourcePopupOpen(true);
    };

    return (
        <>
            <div className="grid grid-cols-4 gap-4 mb-8">
                <Button onClick={handleActiveTeachers} className="block p-0">
                    <div
                        className="bg-white p-4 rounded-lg border border-gray-200 transform transition-transform duration-300 hover:scale-95"
                        title="Aktiva medlemmar"
                    >
                        <div className="flex flex-col items-center mb-3">
                            <Users className="w-5 h-5 text-[var(--secondary2)]" />
                            <div className="text-3xl font-semibold text-[var(--secondary2)]">
                                {stats?.activeTeachers || 0}
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 text-center hidden sm:block">
                            Aktiva medlemmar
                        </div>
                    </div>
                </Button>

                <Button onClick={handleNewTeachers} className="block p-0">
                    <div
                        className="bg-white p-4 rounded-lg border border-gray-200 transform transition-transform duration-300 hover:scale-95"
                        title="Nya medlemmar"
                    >
                        <div className="flex flex-col items-center mb-3">
                            <UserPlus className="w-5 h-5 text-[var(--secondary)]" />
                            <div className="text-3xl font-semibold text-[var(--secondary)]">
                                {stats?.newTeachers || 0}
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 text-center hidden sm:block">
                            Nya medlemmar
                        </div>
                    </div>
                </Button>

                <Button onClick={handleRecommendedResources} className="block p-0">
                    <div
                        className="bg-white p-4 rounded-lg border border-gray-200 transform transition-transform duration-300 hover:scale-95"
                        title="Rekommenderade Resurser"
                    >
                        <div className="flex flex-col items-center mb-3">
                            <FileText className="w-4 h-4 text-[var(--secondary2)]" />
                            <div className="text-3xl font-semibold text-[var(--secondary2)]">
                                {stats?.recommendedResources || 0}
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 text-center hidden sm:block">
                            Rekommenderade Resurser
                        </div>
                    </div>
                </Button>

                <Button onClick={handleTopDownloads} className="block p-0 mb-16">
                    <div
                        className="bg-white p-4 rounded-lg border border-gray-200 transform transition-transform duration-300 hover:scale-95"
                        title="Resurser nedladdade"
                    >
                        <div className="flex flex-col items-center mb-3">
                            <Download className="w-4 h-4 text-[var(--secondary)]" />
                            <div className="text-3xl font-semibold text-[var(--secondary)]">
                                {stats?.totalDownloads || 0}
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 text-center hidden sm:block">
                            Nedladdningar
                        </div>
                    </div>
                </Button>
            </div>
            <UserListPopup
                open={isUserListOpen}
                onOpenChange={setIsUserListOpen}
                title={userListTitle}
                users={userList}
            />
            <ResourceListPopup
                open={isResourcePopupOpen}
                onOpenChange={setIsResourcePopupOpen}
                title={resourcePopupTitle}
                resources={recommendedResources}
            />
        </>
    );
};

export default HomeStats;
