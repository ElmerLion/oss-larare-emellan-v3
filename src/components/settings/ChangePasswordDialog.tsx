import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function ChangePasswordDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure the new passwords match.
    if (newPassword !== confirmPassword) {
      toast({ title: "Lösenorden matchar inte." });
      return;
    }

    // Get the current user's email.
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user || !user.email) {
      toast({ title: "Inget inloggat konto hittades." });
      return;
    }

    // Re-authenticate the user using the new Supabase method.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (signInError) {
      toast({ title: "Ditt nuvarande lösenord är fel." });
      return;
    }

    // Update the password.
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: "Kunde inte uppdatera lösenordet", description: error.message });
    } else {
      toast({
        title: "Lösenord uppdaterat",
        description: "Ditt lösenord har ändrats.",
      });
      // Clear the form and close the dialog.
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-4">
          Ändra lösenord
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>Ändra lösenord</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nuvarande lösenord
            </label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          {/* New Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nytt lösenord
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          {/* Confirm New Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Bekräfta nytt lösenord
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              className="bg-[var(--ole-green)] hover:bg-[var(--hover-green)] text-white"
            >
              Uppdatera lösenord
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
