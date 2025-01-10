import { Button } from "@/components/ui/button";
import { MessageCircle, UserPlus, UserMinus } from "lucide-react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export function ProfileActions() {
  const { id: profileId } = useParams();
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

    try {
      if (isContact) {
        // Remove contact
        const { error } = await supabase
          .from('user_contacts')
          .delete()
          .eq('user_id', user.id)
          .eq('contact_id', profileId);

        if (error) throw error;

        toast({
          title: "Kontakt borttagen",
          description: "Kontakten har tagits bort från din lista",
        });
      } else {
        // Add contact
        const { error } = await supabase
          .from('user_contacts')
          .insert({
            user_id: user.id,
            contact_id: profileId,
          });

        if (error) throw error;

        toast({
          title: "Kontakt tillagd",
          description: "Kontakten har lagts till i din lista",
        });
      }

      setIsContact(!isContact);
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    } catch (error) {
      console.error('Error toggling contact:', error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte uppdatera kontakten",
        variant: "destructive",
      });
    }
  };

  if (isCurrentUser) return null;

  return (
    <div className="flex flex-col gap-2">
      <Button variant="default" className="bg-sage-400 hover:bg-sage-500">
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