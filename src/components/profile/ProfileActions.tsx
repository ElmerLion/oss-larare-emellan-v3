import { Button } from "@/components/ui/button";
import { MessageCircle, UserPlus } from "lucide-react";

export function ProfileActions() {
  return (
    <div className="flex flex-col gap-2">
      <Button variant="default" className="bg-sage-400 hover:bg-sage-500">
        <MessageCircle className="w-4 h-4 mr-2" />
        Meddela
      </Button>
      <Button variant="outline" className="border-sage-200 hover:bg-sage-50">
        <UserPlus className="w-4 h-4 mr-2" />
        Lägg till som kontakt
      </Button>
    </div>
  );
}