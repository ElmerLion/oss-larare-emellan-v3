import { Button } from "@/components/ui/button";
import { MessageCircle, UserPlus, UserMinus } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { toggleContact } from "@/utils/ContactToggle";

export function ProfileActions() {
  const { id: profileId } = useParams();
  const navigate = useNavigate();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isContact, setIsContact] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsCurrentUser(user?.id === profileId);

      if (user && profileId) {
        const { data } = await supabase
          .from('user_contacts')
          .select('*')
          .eq('user_id', user.id)
          .eq('contact_id', profileId)
          .maybeSingle();

        setIsContact(!!data);
      }
    };
    checkCurrentUser();
  }, [profileId]);

  const handleContactToggle = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !profileId) return;

    await toggleContact(
      user.id,
      profileId,
      isContact,
      toast,
      () => queryClient.invalidateQueries({ queryKey: ['contacts'] })
    );

    setIsContact(!isContact);
  };

  // Always navigate to the chat window for this profile.
  const handleSendMessage = () => {
    if (profileId) {
      navigate(`/meddelanden?chat=${profileId}`);
    }
  };

  if (isCurrentUser) return null;

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="default"
        className="bg-sage-400 hover:bg-sage-500"
        onClick={handleSendMessage}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Meddela
      </Button>
      <Button
        variant="outline"
        className="border-sage-200 hover:bg-sage-50"
        onClick={handleContactToggle}
      >
        {isContact ? (
          <>
            <UserMinus className="w-4 h-4 mr-2" />
            Ta bort kontakt
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4 mr-2" />
            Lägg till som kontakt
          </>
        )}
      </Button>
    </div>
  );
}
