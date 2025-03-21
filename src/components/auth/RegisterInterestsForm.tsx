import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
// Import both sets of subject options.
import { subjectOptionsForGrundskola, courseSubjectOptionsForGymnasiet } from "@/types/resourceOptions";
import { interestsOptions } from "@/types/interestsOptions";

interface RegisterInterestsFormProps {
    onComplete: () => void;
}

export default function RegisterInterestsForm({ onComplete }: RegisterInterestsFormProps) {
    const [educationLevel, setEducationLevel] = useState<"grundskola" | "gymnasiet" | null>(null);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const handleToggleSubject = (subject: string) => {
        setSelectedSubjects(prev =>
            prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
        );
    };

    const handleToggleInterest = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
        );
    };

    const handleSubmit = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            // Update the user's profile with the selected subjects, interests, education level,
            // and mark is_setup as true.
            const { error } = await supabase
                .from("profiles")
                .update({
                    subjects: selectedSubjects,
                    interests: selectedInterests,
                    education_level: educationLevel,
                    is_setup: true,
                })
                .eq("id", user.id);
            if (error) throw error;

            toast.success("Profil uppdaterad. Dina intressen har sparats.");
            // Redirect to home after successful registration setup
            window.location.href = "/home";
        } catch (error: any) {
            console.error("Error updating interests:", error);
            toast.error("Fel: " + error.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-16 p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-center">Välj dina ämnen och intressen</h2>
            {/* Education Level Selection */}
            <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Välj utbildningsnivå</h3>
                <div className="flex gap-2">
                    <Button
                        className={educationLevel === "grundskola"
                            ? "bg-[var(--secondary)] hover:bg-[var(--hover-secondary)]"
                            : ""}
                        variant={educationLevel === "grundskola" ? "default" : "outline"}
                        onClick={() => setEducationLevel("grundskola")}
                    >
                        Grundskola
                    </Button>
                    <Button
                        className={educationLevel === "gymnasiet"
                            ? "bg-[var(--secondary)] hover:bg-[var(--hover-secondary)]"
                            : ""}
                        variant={educationLevel === "gymnasiet" ? "default" : "outline"}
                        onClick={() => setEducationLevel("gymnasiet")}
                    >
                        Gymnasiet
                    </Button>
                </div>
            </div>
            {/* Subject Options */}
            {educationLevel && (
                <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">
                        {educationLevel === "grundskola" ? "Ämnen jag arbetar med" : "Kurser jag arbetar med"}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {(educationLevel === "grundskola"
                            ? subjectOptionsForGrundskola
                            : courseSubjectOptionsForGymnasiet
                        ).map((option) => (
                            <Button
                                key={option.value}
                                variant={selectedSubjects.includes(option.value) ? "default" : "outline"}
                                className={selectedSubjects.includes(option.value)
                                    ? "bg-[var(--secondary2)] text-white hover:bg-[var(--hover-secondary2)]"
                                    : ""}
                                onClick={() => handleToggleSubject(option.value)}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
            {/* Interests Options */}
            <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Intressen</h3>
                <div className="flex flex-wrap gap-2">
                    {interestsOptions.map((option) => (
                        <Button
                            key={option.value}
                            variant={selectedInterests.includes(option.value) ? "default" : "outline"}
                            onClick={() => handleToggleInterest(option.value)}
                            className={selectedInterests.includes(option.value)
                                ? "bg-[var(--secondary2)] text-white hover:bg-[var(--hover-secondary2)]"
                                : ""}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>
            <Button onClick={handleSubmit} className="w-full bg-[var(--ole-green)] hover:bg-[var(--hover-green)] text-white">
                Spara intressen
            </Button>
        </div>
    );
}
