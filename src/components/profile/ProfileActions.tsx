import { Button } from "@/components/ui/button";
import { MessageCircle, UserPlus } from "lucide-react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export function ProfileActions() {
  const { id: profileId } = useParams();
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const checkCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsCurrentUser(user?.id === profileId);
    };
    checkCurrentUser();
  }, [profileId]);

  if (isCurrentUser) return null;

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