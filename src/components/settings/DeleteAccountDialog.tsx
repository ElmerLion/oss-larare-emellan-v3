import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function DeleteAccountDialog() {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id || ''
      );

      if (deleteError) throw deleteError;

      // Sign out after deletion
      await supabase.auth.signOut();
      
      // Navigate to home page
      navigate("/");
      
      toast.success("Ditt konto har raderats");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Ett fel uppstod när kontot skulle raderas");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Radera Konto</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Är du säker på att du vill radera ditt konto?</AlertDialogTitle>
          <AlertDialogDescription>
            Denna åtgärd kan inte ångras. Detta kommer permanent radera ditt konto och all relaterad data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Avbryt</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
            Radera Konto
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}