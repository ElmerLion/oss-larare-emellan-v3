import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function BetaTestersList(): JSX.Element {
    const { data: testers, error, isLoading } = useQuery({
        queryKey: ["betaTesters"],
        queryFn: async () => {
            const { data, error } = await supabase.from("beta_testers").select("*");
            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
    });

    if (isLoading) {
        return <div>Laddar beta-testare...</div>;
    }

    if (error) {
        return <div>Något gick fel vid hämtningen av beta-testare.</div>;
    }

    return (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold">Registrerade Beta-testare</h2>
            <p className="mb-4">OBS: Dessa användare har inte tillgång till plattformen om dem inte finns under tillåtna användare.</p>
            {testers && testers.length === 0 ? (
                <p>Inga beta-testare registrerade.</p>
            ) : (
                <ul className="space-y-2">
                    {testers?.map((tester: { id: string; email: string }) => (
                        <li key={tester.id} className="border-b border-gray-200 pb-2">
                            {tester.email}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
