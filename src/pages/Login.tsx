import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LandingPageHeader from "@/components/landingPage/LandingPageHeader";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import RegisterInterestsForm from "@/components/auth/RegisterInterestsForm";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStage, setRegistrationStage] = useState(1); // 1 = basic registration, 2 = interests selection

  // Update state based on the URL query parameter
  useEffect(() => {
    if (searchParams.get("register") === "true") {
      setIsRegistering(true);
    } else {
      setIsRegistering(false);
    }
  }, [searchParams]);

  // Toggle the mode and update the URL accordingly.
  const toggleMode = () => {
    if (isRegistering) {
      navigate("/login");
    } else {
      navigate("/login?register=true");
    }
    setRegistrationStage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingPageHeader></LandingPageHeader>
      <div className="pt-16">
        {isRegistering ? (
          registrationStage === 1 ? (
            // Stage 1: Basic registration form.
            <RegisterForm toggleMode={toggleMode} onComplete={() => setRegistrationStage(2)} />
          ) : (
            // Stage 2: Subjects and interests selection.
            <RegisterInterestsForm onComplete={() => navigate("/home")} />
          )
        ) : (
          // If not registering, show the login form.
          <LoginForm toggleMode={toggleMode} />
        )}
      </div>
    </div>
  );
}
