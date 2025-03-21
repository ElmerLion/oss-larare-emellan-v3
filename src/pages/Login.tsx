import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LandingPageHeader from "@/components/landingPage/LandingPageHeader";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isRegistering, setIsRegistering] = useState(false);

    // State for registration data to be used with RegisterForm
    const [registrationData, setRegistrationData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        setIsRegistering(searchParams.get("register") === "true");
    }, [searchParams]);

    // Toggle mode and update URL accordingly
    const toggleMode = () => {
        if (isRegistering) {
            navigate("/login");
        } else {
            navigate("/login?register=true");
        }
    };

    // Update registration data
    const updateRegistrationData = (newData: Partial<typeof registrationData>) => {
        setRegistrationData((prev) => ({ ...prev, ...newData }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <LandingPageHeader />
            {/* Warning Banner */}
            <div className="pt-16">
                {isRegistering ? (
                    // Use RegisterForm for account creation
                    <RegisterForm
                        toggleMode={toggleMode}
                        data={registrationData}
                        updateData={updateRegistrationData}
                    />
                ) : (
                    // Otherwise, render the login form
                    <LoginForm toggleMode={toggleMode} />
                )}
            </div>
        </div>
    );
}
