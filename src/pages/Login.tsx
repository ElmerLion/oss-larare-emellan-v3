import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProfileCompletion } from "@/components/auth/ProfileCompletion";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "react-router-dom";
import { LandingPageHeader } from "@/components/landingPage/LandingPageHeader"

export default function Login() {
  const navigate = useNavigate();
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [acceptPolicy, setAcceptPolicy] = useState(false); // State for the checkbox
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("register") === "true") {
      setIsRegistering(true);
    }
  }, [location]);

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    navigate(`/login${!isRegistering ? "?register=true" : ""}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegistering && !acceptPolicy) {
      toast.error("Du måste acceptera integritetspolicyn för att fortsätta.");
      return;
    }

    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          toast.error("Lösenorden matchar inte");
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        const session = await supabase.auth.getSession();
        if (!session.data.session?.user?.id) {
          toast.error("Ett fel uppstod. Försök igen senare.");
          return;
        }

        const user = session.data.session.user;

        const { error: updateError } = await supabase
          .from("profiles")
          .update({ full_name: fullName })
          .eq("id", user.id);

        if (updateError) {
          console.error("Profile Update Error:", updateError);
          toast.error("Ett fel uppstod när vi uppdaterade profilen");
          return;
        }

        toast.success(
          "Registrering lyckades! Kontrollera din e-post för verifiering."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(
        error.message === "Invalid login credentials"
          ? "Felaktiga inloggningsuppgifter"
          : "Ett fel uppstod, försök igen senare"
      );
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
