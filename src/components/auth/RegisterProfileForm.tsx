// RegisterProfileForm.tsx
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegisterProfileFormProps {
  data: {
    fullName: string;
    school: string;
    jobTitle: string;
    city: string;
    email: string; // in case you need it later
  };
  updateData: (newData: Partial<{ fullName: string; school: string; jobTitle: string; city: string }>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function RegisterProfileForm({ data, updateData, nextStep, prevStep }: RegisterProfileFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sessionResult = await supabase.auth.getSession();
      if (!sessionResult.data.session?.user?.id) {
        toast.error("User not authenticated");
        return;
      }
      const user = sessionResult.data.session.user;

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.fullName,
          school: data.school,
          title: data.jobTitle,
          city: data.city,
          avatar_url: "/Images/DefaultProfile.png",
        })
        .eq("id", user.id);
      if (error) {
        console.error("Profile Update Error:", error);
        toast.error("Ett fel uppstod när vi uppdaterade profilen");
        return;
      }
      toast.success("Profil uppdaterad. Fortsätt gärna med dina intressen.");
      nextStep();
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error("Ett fel uppstod, försök igen senare");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold mb-6 text-center">Fyll i dina profiluppgifter</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">För- och efternamn</Label>
          <Input
            id="fullName"
            type="text"
            value={data.fullName}
            onChange={(e) => updateData({ fullName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="school">Skola</Label>
          <Input
            id="school"
            type="text"
            value={data.school}
            onChange={(e) => updateData({ school: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Jobbtitel</Label>
          <Input
            id="jobTitle"
            type="text"
            value={data.jobTitle}
            onChange={(e) => updateData({ jobTitle: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Stad</Label>
          <Input
            id="city"
            type="text"
            value={data.city}
            onChange={(e) => updateData({ city: e.target.value })}
            required
          />
        </div>
        <div className="flex justify-between">
          <Button type="button" onClick={prevStep} variant="outline">
            Tillbaka
          </Button>
          <Button type="submit" className="bg-[var(--ole-green)] border-[var(--hover-green)] hover:bg-[var(--hover-green)]">
            Nästa
          </Button>
        </div>
      </form>
    </div>
  );
}
