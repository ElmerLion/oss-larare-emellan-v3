// Login.tsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LandingPageHeader from "@/components/landingPage/LandingPageHeader";
import LoginForm from "@/components/auth/LoginForm";
import MultiStepRegister from "@/components/auth/MultiStepRegister";

export default function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        setIsRegistering(searchParams.get("register") === "true");
    }, [searchParams]);

    // Toggle the mode and update the URL accordingly.
    const toggleMode = () => {
        if (isRegistering) {
            navigate("/login");
        } else {
            navigate("/login?register=true");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <LandingPageHeader />
            {/* Warning Banner */}
            <div className="pt-16">
                <div className="bg-yellow-100 text-yellow-800 p-4 text-center">
                    Du kan just nu inte logga in eller registrera dig då vi håller på att ändra systemet.
                </div>
                {isRegistering ? (
                    // Render the MultiStepRegister which handles all registration stages.
                    <MultiStepRegister toggleMode={toggleMode} onComplete={() => navigate("/home")} />
                ) : (
                    // Otherwise, render the login form.
                    <LoginForm toggleMode={toggleMode} />
                )}
            </div>
        </div>
    );
}
