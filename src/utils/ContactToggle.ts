import { supabase } from "@/integrations/supabase/client";

export async function toggleContact(userId: string, contactId: string, isContact: boolean, toast: any, invalidateQuery: () => void) {
  try {
      // Prevent adding yourself as a contact
      if (userId === contactId) {
        toast({
          title: "Ogiltig åtgärd",
          description: "Du kan inte lägga till dig själv som en kontakt.",
          variant: "warning",
        });
        return;
      }

    if (isContact) {
      // Remove contact
      const { error } = await supabase
        .from('user_contacts')
        .delete()
        .eq('user_id', userId)
        .eq('contact_id', contactId);

      if (error) throw error;

      toast({
        title: "Kontakt borttagen",
        description: "Kontakten har tagits bort från din lista",
      });
    } else {
      // Check if contact already exists
      const { data: existingContact, error: fetchError } = await supabase
        .from('user_contacts')
        .select('*')
        .eq('user_id', userId)
        .eq('contact_id', contactId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (existingContact) {
        toast({
          title: "Kontakt finns redan",
          description: "Den här kontakten är redan i din lista.",
          variant: "warning",
        });
        return;
      }

      // Add contact
      const { error } = await supabase
        .from('user_contacts')
        .insert({
          user_id: userId,
          contact_id: contactId,
        });

      if (error) throw error;

      toast({
        title: "Kontakt tillagd",
        description: "Kontakten har lagts till i din lista",
      });
    }

    invalidateQuery();
  } catch (error) {
    console.error("Error toggling contact:", error);
    toast({
      title: "Ett fel uppstod",
      description: "Kunde inte uppdatera kontakten",
      variant: "destructive",
    });
  }
}
