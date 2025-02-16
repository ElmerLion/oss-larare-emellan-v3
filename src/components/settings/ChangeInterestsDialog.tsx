// src/components/settings/ChangeInterestsDialog.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  subjectOptionsForGrundskola,
  courseSubjectOptionsForGymnasiet,
} from "@/types/resourceOptions";
import { interestsOptions } from "@/types/interestsOptions";

interface ChangeInterestsDialogProps {
  onComplete?: () => void;
}

export default function ChangeInterestsDialog({ onComplete }: ChangeInterestsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Use proper capitalization for the education level.
  const [educationLevel, setEducationLevel] = useState<"Grundskola" | "Gymnasiet">("Grundskola");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // When the dialog opens, fetch the current user's profile data.
  useEffect(() => {
    const fetchProfileData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("subjects, interests, education_level")
        .eq("id", user.id)
        .single();
      if (error) {
        console.error("Error fetching profile data:", error);
      } else if (data) {
        setSelectedSubjects(data.subjects || []);
        setSelectedInterests(data.interests || []);
        if (data.education_level === "Gymnasiet" || data.education_level === "Grundskola") {
          setEducationLevel(data.education_level);
        }
      }
      setIsLoading(false);
    };

    if (isOpen) {
      fetchProfileData();
    }
  }, [isOpen]);

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

      // Update the user's profile with subjects, interests, and the education level.
      const { error } = await supabase
        .from("profiles")
        .update({
          subjects: selectedSubjects,
          interests: selectedInterests,
          education_level: educationLevel,
        })
        .eq("id", user.id);
      if (error) throw error;

      toast.success("Profil uppdaterad. Dina intressen har sparats.");
      setIsOpen(false);
      if (onComplete) onComplete();
    } catch (error: any) {
      console.error("Error updating interests:", error);
      toast.error("Fel: " + error.message);
    }
  };

  // Select subject options based on education level.
  const subjectOptions =
    educationLevel === "Grundskola"
      ? subjectOptionsForGrundskola
      : courseSubjectOptionsForGymnasiet;

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)} className="mt-4 ml-2">
        Ändra intressen och ämnen
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>Ändra intressen och ämnen</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="p-4">Laddar...</div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Education level toggle */}
              <div>
                <h3 className="text-lg font-medium mb-2">Välj utbildningsnivå</h3>
                <div className="flex gap-2">
                  <Button
                    variant={educationLevel === "Grundskola" ? "default" : "outline"}
                    className={educationLevel === "Grundskola" ? "bg-[var(--secondary)] hover:bg-[var(--hover-secondary)]" : ""}
                    onClick={() => setEducationLevel("Grundskola")}
                  >
                    Grundskola
                  </Button>
                  <Button
                    variant={educationLevel === "Gymnasiet" ? "default" : "outline"}
                    className={educationLevel === "Gymnasiet" ? "bg-[var(--secondary)] hover:bg-[var(--hover-secondary)]" : ""}
                    onClick={() => setEducationLevel("Gymnasiet")}
                  >
                    Gymnasiet
                  </Button>
                </div>
              </div>
              {/* Subjects selection */}
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {educationLevel === "Grundskola" ? "Ämnen" : "Kurser"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {subjectOptions.map((option) => (
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
              {/* Interests selection */}
              <div>
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
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
