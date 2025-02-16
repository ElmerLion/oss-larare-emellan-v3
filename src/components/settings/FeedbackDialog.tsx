import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function FeedbackDialog({ triggerElement }: { triggerElement: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error("Feedback kan inte vara tom.");
      return;
    }
    try {
      // Retrieve the current user
      const { data: { user } } = await supabase.auth.getUser();

      // Insert feedback including the user_id (if available)
      const { error } = await supabase
        .from("feedback")
        .insert({
          message: feedback,
          user_id: user ? user.id : null  // Set user_id if the user exists
        });
      if (error) throw error;

      toast.success("Tack för din feedback, vi tittar in på den snarast!");
      setFeedback("");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast.error("Kunde inte skicka feedback. Försök igen senare.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className="bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>Skicka Feedback</DialogTitle>
          <p className="text-sm">Har du hittat ett problem eller något du vill förbättra? Skriv till oss!
          <br /> Vi vill veta hur vi kan förbättra plattformen och tittar på allt som skickas in.
          <br /> <br />Är det ett akut problem? Vi svarar snabbare om du
          <a href="mailto:osslarareemellan@gmail.com" className="text-gray-600 hover:text-[var(--primary)]text-sm"> mailar</a> till oss eller skriver till oss på
          <a href="https://www.linkedin.com/company/oss-l%C3%A4rare-emellan/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[var(--primary)]"> LinkedIn</a>.
          </p>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            className="h-[140px]"
            placeholder="Din feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <Button onClick={handleSubmit} className="bg-[var(--primary)] hover:bg-[var(--hover-green)] text-white">
            Skicka
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
