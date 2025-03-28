import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type Task = {
    id: string;
    label: string;
    completed: boolean;
};

export default function BetaTestingPage(): JSX.Element {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const predefinedTasks = [
        { id: "profile_create", label: "Skapa en profil som beskriver dig och ditt arbete" },
        { id: "forum_create", label: "Starta ett samtal i forumet" },
        { id: "forum_answer", label: "Svara på ett samtal i forumet" },
        { id: "resource_upload", label: "Ladda upp en resurs" },
        { id: "add_contact", label: "Lägg till någon som kontakt" },
        { id: "search_function", label: "Testa sökfunktionen" },
        { id: "feedback_forum", label: "Skicka in feedback" },
    ];

    // On component mount, fetch the current user's tasks from DB
    useEffect(() => {
        let isMounted = true;
        const fetchTasks = async () => {
            setLoading(true);
            // 1. Get the current user
            const {
                data: { session },
            } = await supabase.auth.getSession();
            const userId = session?.user?.id;

            if (!userId) {
                setLoading(false);
                return;
            }

            // 2. Fetch existing task rows for this user
            const { data: dbTasks, error } = await supabase
                .from("profile_beta_tasks")
                .select("task_name, completed")
                .eq("profile_id", userId);

            if (error) {
                console.error("Error fetching tasks:", error);
                setLoading(false);
                return;
            }

            // 3. Merge DB data with our predefined tasks
            const mergedTasks = predefinedTasks.map((t) => {
                const match = dbTasks?.find((row) => row.task_name === t.id);
                return {
                    id: t.id,
                    label: t.label,
                    completed: match ? match.completed : false,
                };
            });

            if (isMounted) {
                setTasks(mergedTasks);
                setLoading(false);
            }
        };

        fetchTasks();
        return () => {
            isMounted = false;
        };
    }, []);

    // Handle checkbox toggles
    const handleTaskToggle = async (taskId: string, currentValue: boolean) => {
        // Optimistically update state
        setTasks((prev) =>
            prev.map((t) =>
                t.id === taskId ? { ...t, completed: !currentValue } : t
            )
        );

        // Get current user
        const {
            data: { session },
        } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (!userId) return;

        // Upsert (create/update) row in DB
        const { error } = await supabase
            .from("profile_beta_tasks")
            .upsert(
                {
                    profile_id: userId,
                    task_name: taskId,
                    completed: !currentValue,
                },
                {
                    onConflict: "profile_id,task_name",
                }
            );




        if (error) {
            console.error("Error updating task:", error);
            // Optional: revert state if error
        }
    };

    if (loading) {
        return <p className="p-4">Laddar...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 lg:ml-64">
            <h1 className="text-2xl font-bold mb-6">Testperiod 1 - Oss Lärare Emellan</h1>

            {/* Intro Text (based on your image’s content) */}
            <p className="mb-4">
                Vad roligt att du vill hjälpa oss på <strong>Oss Lärare Emellan (OLE)</strong> att
                testa och utveckla vår plattform! Vårt mål med OLE är att skapa en digital
                samlingsplats och ett community för Sveriges lärare. För att lyckas behöver vi just
                dig! Vi vill att du <em>testar OLE på riktigt</em> – utforskar, interagerar,
                analyserar och framför allt ger oss ärlig feedback.
            </p>

            <p className="mb-4 font-semibold">Var brutalt ärlig!</p>

            <p className="mb-6">
                Självklart uppskattar vi positiv feedback och vill höra vad du tycker är bra med
                OLE. Men vi vill också veta om något inte funkar, om något ser fult ut, är
                svårläst, eller helt enkelt inte “makes sense”. Ju mer ärlig och detaljerad feedback
                du ger, desto bättre kan vi göra OLE!
            </p>

            <p className="mb-6">
                Nedan ser du några saker vi gärna vill att du testar. Markera dem när du är klar.
            </p>

            {/* Task List */}
            <ul className="space-y-4">
                {tasks.map((task) => (
                    <li key={task.id} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleTaskToggle(task.id, task.completed)}
                        />
                        <span>{task.label}</span>
                    </li>
                ))}
            </ul>

            {/* Additional instructions or contact info */}
            <p className="mt-6">
                Har du fler synpunkter eller upptäcker du buggar? Tveka inte att skriva feedback
                eller maila oss på{" "}
                <a href="mailto:info@osslarareemellan.se" className="text-blue-600 underline">
                    info@osslarareemellan.se
                </a>
                .
                <br />Om du vill veta mer om någon specifik del av plattformen kan du läsa mer om de olika funktionerna <a href="/instruktionsmanual" className="underline">här</a>.
            </p>
        </div>
    );
}
