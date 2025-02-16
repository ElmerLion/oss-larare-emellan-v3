import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegisterFormProps {
  toggleMode: () => void;
  onComplete: () => void;
}

export default function RegisterForm({ toggleMode, onComplete }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [school, setSchool] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [acceptPolicy, setAcceptPolicy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptPolicy) {
      toast.error("Du måste acceptera integritetspolicyn för att fortsätta.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Lösenorden matchar inte");
      return;
    }
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        if (
          error.code === "23505" ||
          (error.message && error.message.toLowerCase().includes("already"))
        ) {
          toast.error("Kontot finns redan");
          return;
        }
        throw error;
      }
      const sessionResult = await supabase.auth.getSession();
      if (!sessionResult.data.session?.user?.id) {
        toast.error("Ett fel uppstod. Försök igen senare.");
        return;
      }
      const user = sessionResult.data.session.user;

      // Update the profile with basic info and default avatar.
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          school: school,
          title: jobTitle,
          avatar_url: "/Images/DefaultProfile.png",
        })
        .eq("id", user.id);
      if (updateError) {
        console.error("Profile Update Error:", updateError);
        toast.error("Ett fel uppstod när vi uppdaterade profilen");
        return;
      }
      toast.success("Registrering lyckades! Vänligen fortsätt med att välja dina ämnen och intressen.");
      onComplete(); // Move to stage 2
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(
        error.message === "Duplicate key"
          ? "Kontot finns redan"
          : "Ett fel uppstod, försök igen senare"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold mb-6 text-center">Skapa konto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">För- och efternamn</Label>
          <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="school">Skola</Label>
          <Input id="school" type="text" value={school} onChange={(e) => setSchool(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Jobbtitel</Label>
          <Input id="jobTitle" type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-postadress</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Lösenord</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Bekräfta lösenord</Label>
          <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <div className="flex items-start">
          <input type="checkbox" id="acceptPolicy" className="w-4 h-4 mr-2" checked={acceptPolicy} onChange={() => setAcceptPolicy(!acceptPolicy)} />
          <Label htmlFor="acceptPolicy">
            Jag accepterar{" "}
            <a href="/integritets-policy" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
              integritetspolicyn
            </a>.
          </Label>
        </div>
        <Button type="submit" className="w-full bg-[var(--ole-green)] border-[var(--hover-green)] hover:bg-[var(--hover-green)]">
          Registrera
        </Button>
      </form>
      <div className="mt-4 text-center">
        <button onClick={toggleMode} className="text-sm text-gray-600 hover:underline">
          Har du redan ett konto? Logga in
        </button>
      </div>
    </div>
  );
}
