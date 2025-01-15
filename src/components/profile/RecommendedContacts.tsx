import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { toggleContact } from "@/utils/ContactToggle"; // Import the reusable utility
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function RecommendedContacts() {
  const [contactStatuses, setContactStatuses] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const { data: contacts, isLoading, error } = useQuery({
      queryKey: ['recommended-contacts'],
      queryFn: async () => {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw userError;

        // Fetch connected contacts
        const { data: connectedContacts, error: connectedError } = await supabase
          .from('user_contacts')
          .select('contact_id')
          .eq('user_id', user.id);

        if (connectedError) throw connectedError;

        const connectedIds = connectedContacts?.map((contact) => contact.contact_id) || [];

        // Fetch recommended contacts excluding connected contacts and self
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, title, school, avatar_url, created_at')
          .not('id', 'eq', user.id) // Exclude self
          .not('id', 'in', `(${connectedIds.join(',')})`) // Exclude already connected contacts
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        return data;
      },
    });

  const handleContactToggle = async (contactId: string, isContact: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await toggleContact(
      user.id,
      contactId,
      isContact,
      toast,
      () => setContactStatuses((prev) => ({ ...prev, [contactId]: !isContact }))
    );
  };

  if (isLoading) return <p>Laddar kontakter...</p>;
  if (error) return <p>Kunde inte ladda kontakter.</p>;

  return (
    <Card className="p-4 max-w-[300px]">
      <h2 className="text-lg font-semibold mb-3">Lärare vi tror du velat lära känna</h2>
      <div className="space-y-3">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={contact.avatar_url || "/placeholder.svg"} alt={contact.full_name} />
            </Avatar>
            <div className="flex-1">
              <Link
                to={`/profil/${contact.id}`}
                className="block font-medium text-sm hover:underline"
              >
                {contact.full_name || "Unnamed User"}
              </Link>
              <p className="text-xs text-gray-500">{contact.title || "Lärare"}</p>
              <p className="text-xs text-gray-400">{contact.school || "Ingen skola angiven"}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-xs"
                onClick={() =>
                  handleContactToggle(contact.id, contactStatuses[contact.id] || false)
                }
              >
                {contactStatuses[contact.id] ? "Ta bort kontakt" : "Lägg till som kontakt"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
