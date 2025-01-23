import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MiniProfile from "@/components/profile/MiniProfile";
import { Button } from "@/components/ui/button";
import { toggleContact } from "@/utils/ContactToggle"; // Import the reusable utility
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function RecommendedContacts() {
  const [contactStatuses, setContactStatuses] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const { data: contacts, isLoading, error } = useQuery({
    queryKey: ["recommended-contacts"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw userError;

      // Fetch connected contacts
      const { data: connectedContacts, error: connectedError } = await supabase
        .from("user_contacts")
        .select("contact_id")
        .eq("user_id", user.id);

      if (connectedError) throw connectedError;

      const connectedIds = connectedContacts?.map((contact) => contact.contact_id) || [];

      // Fetch recommended contacts excluding connected contacts and self
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, title, school, avatar_url")
        .not("id", "eq", user.id) // Exclude self
        .not("id", "in", `(${connectedIds.join(",")})`) // Exclude already connected contacts
        .order("created_at", { ascending: false })
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
            className="flex flex-col gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {/* MiniProfile */}
            <MiniProfile
              id={contact.id}
              name={contact.full_name || "Unnamed User"}
              avatarUrl={contact.avatar_url}
              title={contact.title || "Lärare"}
              school={contact.school || "Ingen skola angiven"}
              size="medium"
            />

            {/* Contact Button */}
            <Button
              variant="outline"
              size="sm"
              className="text-xs self-start mt-4 w-full"
              onClick={() =>
                handleContactToggle(contact.id, contactStatuses[contact.id] || false)
              }
            >
              {contactStatuses[contact.id] ? "Ta bort kontakt" : "Lägg till som kontakt"}
            </Button>
          </div>
        ))}
      </div>
    </Card>

  );
}
