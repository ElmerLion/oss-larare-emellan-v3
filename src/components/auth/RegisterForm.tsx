import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface RegisterFormProps {
  toggleMode: () => void;
  nextStep: () => void;
  data: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  updateData: (newData: Partial<{ email: string; password: string; confirmPassword: string }>) => void;
}

export default function RegisterForm({ toggleMode, nextStep, data, updateData }: RegisterFormProps) {
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptPolicy) {
      toast.error("Du måste acceptera integritetspolicyn för att fortsätta.");
      return;
    }
    if (data.password !== data.confirmPassword) {
      toast.error("Lösenorden matchar inte");
      return;
    }

    // Normalize email by trimming and converting to lowercase.
    const normalizedEmail = data.email.trim().toLowerCase();

    console.log(normalizedEmail);
    console.log(data.email);
    // Check if the email is allowed
    const { data: allowedUser, error: allowedError } = await supabase
      .from("allowed_users")
      .select("email")
      .eq("email", normalizedEmail)
      .maybeSingle();

    console.log(allowedUser);
    console.log(allowedError);
    if (allowedError) {
      console.error("Error checking allowed users:", allowedError);
      toast.error("Ett fel uppstod, försök igen senare.");
      return;
    }

    if (!allowedUser) {
      toast.error("Du har inte tillåtelse att skapa ett konto. Om du tror att något är fel, vänligen maila oss.");
      return;
    }

    try {
      // Use the normalized email in the sign-up call
      const { error } = await supabase.auth.signUp({ email: normalizedEmail, password: data.password });
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
      toast.success("Registrering lyckades! Fortsätt med att lägga till dina profiluppgifter.");
      nextStep();
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
          <Label htmlFor="email">E-postadress</Label>
          <Input
            id="email"
            type="email"
            value={data?.email}
            onChange={(e) => updateData({ email: e.target.value })}
            required
          />
        </div>
        <div className="relative space-y-2">
          <Label htmlFor="password">Lösenord</Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={data?.password}
            onChange={(e) => updateData({ password: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-11 right-3 transform -translate-y-1/2 text-sm text-gray-600 focus:outline-none"
          >
            {showPassword ? "Dölj" : "Visa"}
          </button>
        </div>
        <div className="relative space-y-2">
          <Label htmlFor="confirmPassword">Bekräfta lösenord</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={data?.confirmPassword}
            onChange={(e) => updateData({ confirmPassword: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-11 right-3 transform -translate-y-1/2 text-sm text-gray-600 focus:outline-none"
          >
            {showPassword ? "Dölj" : "Visa"}
          </button>
        </div>
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
              href="/integritetspolicy"
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              integritetspolicyn
            </a>.
          </Label>
        </div>
        <Button
          type="submit"
          className="w-full bg-[var(--ole-green)] border-[var(--hover-green)] hover:bg-[var(--hover-green)]"
        >
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
