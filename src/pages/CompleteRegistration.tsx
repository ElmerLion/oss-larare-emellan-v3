import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MultiStepRegister from "@/components/auth/MultiStepRegister"; // Adjust path as needed
import { LandingPageHeader } from "@/components/landingPage/LandingPageHeader";

export default function CompleteRegistration() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [needsSetup, setNeedsSetup] = useState<boolean>(false);

    useEffect(() => {
        async function checkUserSetup() {
            const { data: session } = await supabase.auth.getSession();
            if (!session?.session) {
                navigate("/login");
                return;
            }
            const userId = session.session.user.id;
            const { data: profile, error } = await supabase
                .from("profiles")
                .select("is_setup")
                .eq("id", userId)
                .single();
            if (error) {
                console.error("Error fetching profile:", error);
                // Handle error as needed
            } else if (profile) {
                if (profile.is_setup) {
                    navigate("/home");
                    return;
                } else {
                    setNeedsSetup(true);
                }
            }
            setIsLoading(false);
        }
        checkUserSetup();
    }, [navigate]);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <div className="mt-16">
                {needsSetup ? (
                    <MultiStepRegister
                        toggleMode={() => navigate("/login")}
                        onComplete={async () => {
                            const { data: session } = await supabase.auth.getSession();
                            const userId = session?.session?.user?.id;
                            if (userId) {
                                const { error } = await supabase
                                    .from("profiles")
                                    .update({ is_setup: true })
                                    .eq("id", userId);
                                if (error) {
                                    console.error("Error updating is_setup:", error);
                                } else {
                                    navigate("/");
                                }
                            }
                        }}
                        initialStep={2} // Start at the second step
                    />
                ) : null}
            </div>
        </div>
    );
}

