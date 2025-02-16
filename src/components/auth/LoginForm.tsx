import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ toggleMode }: { toggleMode: () => void }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Välkommen tillbaka!");
      navigate("/home");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: error.message === "Invalid login credentials"
          ? "Felaktiga inloggningsuppgifter"
          : "Ett fel uppstod, försök igen senare",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold mb-6 text-center">Välkommen tillbaka!</h1>
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
        <Button
          type="submit"
          className="w-full bg-[color:var(--ole-green)] border-[color:var(--hover-green)] hover:bg-[color:var(--hover-green)]"
        >
          Logga in
        </Button>
      </form>
      <div className="mt-4 text-center">
        <button onClick={toggleMode} className="text-sm text-gray-600 hover:underline">
          Ny här? Skapa ett konto
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
