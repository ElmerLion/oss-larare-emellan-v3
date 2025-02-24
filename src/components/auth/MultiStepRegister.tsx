// MultiStepRegister.tsx
import { useState } from "react";
import RegisterForm from "./RegisterForm"; // Stage 1: Email/Password
import RegisterProfileForm from "./RegisterProfileForm"; // Stage 2: Extra profile details
import RegisterInterestsForm from "./RegisterInterestsForm"; // Stage 3: Interests

interface MultiStepRegisterProps {
  toggleMode: () => void;
  onComplete: () => void;
}

export default function MultiStepRegister({ toggleMode, onComplete }: MultiStepRegisterProps) {
  // Manage which step you're on
  const [step, setStep] = useState(1);

  // Hold all user registration data with default values
  const [registrationData, setRegistrationData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    // Stage 2 fields:
    fullName: "",
    school: "",
    jobTitle: "",
    city: "",
  });

  // Function to update registration data
  const updateData = (newData: Partial<typeof registrationData>) => {
    setRegistrationData((prev) => ({ ...prev, ...newData }));
  };

  // Functions to navigate between steps
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
      {step === 1 && (
        <RegisterForm
          data={registrationData}
          updateData={updateData}
          nextStep={nextStep}
          toggleMode={toggleMode}
        />
      )}
      {step === 2 && (
        <RegisterProfileForm
          data={registrationData}
          updateData={updateData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      {step === 3 && (
        <RegisterInterestsForm
          registrationData={registrationData}
          onComplete={onComplete}
          prevStep={prevStep}
        />
      )}
    </div>
  );
}
