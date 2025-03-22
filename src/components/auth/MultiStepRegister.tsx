import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import RegisterProfileForm from "./RegisterProfileForm"; // Stage 1: Profile details
import RegisterInterestsForm from "./RegisterInterestsForm"; // Stage 2: Interests

interface MultiStepRegisterProps {
    toggleMode: () => void;
    onComplete: () => void;
}

export default function MultiStepRegister({ toggleMode, onComplete }: MultiStepRegisterProps) {
    // Now we only have 2 steps.
    const [step, setStep] = useState(1);

    // Hold all user registration data (excluding email/password)
    const [registrationData, setRegistrationData] = useState({
        fullName: "",
        school: "",
        jobTitle: "",
        city: "",
    });

    // Function to update registration data
    const updateData = (newData: Partial<typeof registrationData>) => {
        setRegistrationData((prev) => ({ ...prev, ...newData }));
    };

    // Navigation functions between steps
    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    // Logout function to prevent user from getting stuck
    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
    };

    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-sm mt-16 mb-16 sm:max-w-4xl md:max-w-5xl lg:max-w-6xl">
            {/* Description at the top */}
            <p className="mb-4 text-center text-gray-700">
                Vänligen fyll i dina uppgifter för att slutföra din registrering.
            </p>
            {step === 1 && (
                <RegisterProfileForm
                    data={registrationData}
                    updateData={updateData}
                    nextStep={nextStep}
                    toggleMode={toggleMode}
                />
            )}
            {step === 2 && (
                <RegisterInterestsForm
                    registrationData={registrationData}
                    onComplete={onComplete}
                    prevStep={prevStep}
                />
            )}
            {/* Logout button at the bottom with a border */}
            <div className="mt-8">
                <Button onClick={handleLogout} size="sm" className="w-xl bg-[#fa878d] hover:bg-[#fc6068]">
                    Logga ut
                </Button>
            </div>
        </div>
    );

}
