import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProfileCompletion } from "@/components/auth/ProfileCompletion";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LandingPageHeader } from "@/components/landingPage/LandingPageHeader";

export default function Login() {
  const navigate = useNavigate();
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [school, setSchool] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const constLocation = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(constLocation.search);
    if (params.get("register") === "true") {
      setIsRegistering(true);
    }
  }, [constLocation]);

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    navigate(`/login${!isRegistering ? "?register=true" : ""}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegistering && !acceptPolicy) {
      toast({ title: "Du måste acceptera integritetspolicyn för att fortsätta." });
      return;
    }

    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          toast({ title: "Lösenorden matchar inte" });
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          if (
            error.code === "23505" ||
            (error.message && error.message.toLowerCase().includes("duplicate"))
          ) {
            toast({ title: "Kontot finns redan" });
            return;
          }
          throw error;
        }

        const sessionResult = await supabase.auth.getSession();
        if (!sessionResult.data.session?.user?.id) {
          toast({ title: "Ett fel uppstod. Försök igen senare." });
          return;
        }

        const user = sessionResult.data.session.user;

        // Update the profile with full name, school, job title, and set default avatar
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            full_name: fullName,
            school: school,
            title: jobTitle,
            avatar_url: "/Images/DefaultProfile.png", // Default avatar image
          })
          .eq("id", user.id);

        if (updateError) {
          console.error("Profile Update Error:", updateError);
          toast({ title: "Ett fel uppstod när vi uppdaterade profilen" });
          return;
        }

        toast({ title: "Registrering lyckades! Kontrollera din e-post för verifiering." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: error.message === "Invalid login credentials"
          ? "Felaktiga inloggningsuppgifter"
          : "Ett fel uppstod, försök igen senare",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 border-b border-gray-200 bg-white">
        <LandingPageHeader />
      </div>

      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          {isRegistering ? "Skapa konto" : "Välkommen tillbaka!"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">För- och efternamn</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">Skola</Label>
                <Input
                  id="school"
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Jobbtitel</Label>
                <Input
                  id="jobTitle"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-postadress</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Lösenord</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isRegistering && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Bekräfta lösenord</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          {isRegistering && (
            <div className="space-y-2">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="acceptPolicy"
                  className="w-4 h-4 mr-2"
                  checked={acceptPolicy}
                  onChange={() => setAcceptPolicy(!acceptPolicy)}
                />
                <Label htmlFor="acceptPolicy">
                  Jag accepterar{" "}
                  <a
                    href="/integritets-policy"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    integritetspolicyn
                  </a>.
                </Label>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[color:var(--ole-green)] border-[color:var(--hover-green)] hover:bg-[color:var(--hover-green)]"
          >
            {isRegistering ? "Registrera" : "Logga in"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-gray-600 hover:underline"
          >
            {isRegistering
              ? "Har du redan ett konto? Logga in"
              : "Ny här? Skapa ett konto"}
          </button>
        </div>
      </div>
    </div>
  );
}
