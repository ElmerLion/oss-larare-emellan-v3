import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProfileCompletion } from "@/components/auth/ProfileCompletion";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);
        
        if (session) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, school')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          if (profile?.full_name && profile?.school) {
            navigate('/');
          } else {
            setShowProfileCompletion(true);
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
        toast.error("Ett fel uppstod vid inloggning");
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      
      if (session) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('full_name, school')
            .eq('id', session.user.id)
            .single();

          if (error) throw error;

          if (profile?.full_name && profile?.school) {
            navigate('/');
          } else {
            setShowProfileCompletion(true);
          }
        } catch (error) {
          console.error("Profile check error:", error);
          toast.error("Ett fel uppstod vid hämtning av profil");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          toast.error("Lösenorden matchar inte");
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        toast.success("Registrering lyckades! Kontrollera din e-post för verifiering.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message === "Invalid login credentials"
        ? "Felaktiga inloggningsuppgifter"
        : "Ett fel uppstod, försök igen senare"
      );
    }
  };

  if (showProfileCompletion) {
    return <ProfileCompletion />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 border-b border-gray-200 bg-white">
        <button 
          onClick={() => navigate("/")} 
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 bg-sage-300 rounded-full flex items-center justify-center">
            <img src="/Images/OLELogga.png" alt="OLE Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-sm text-gray-600">Oss Lärare Emellan</span>
        </button>
      </div>

      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          {isRegistering ? "Skapa konto" : "Välkommen tillbaka!"}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button type="submit" className="w-full">
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