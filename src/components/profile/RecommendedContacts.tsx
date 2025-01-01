import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Contact {
  name: string;
  role: string;
  school: string;
  image: string;
}

interface RecommendedContactsProps {
  contacts: Contact[];
}

export function RecommendedContacts({ contacts }: RecommendedContactsProps) {
  return (
    <Card className="p-4 max-w-[300px]">
      <h2 className="text-lg font-semibold mb-3">Lärare vi tror du velat lära känna</h2>
      <div className="space-y-3">
        {contacts.map((contact, index) => (
          <div key={index} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <Avatar className="h-10 w-10">
              <AvatarImage src={contact.image} alt={contact.name} />
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium text-sm">{contact.name}</h3>
              <p className="text-xs text-gray-500">{contact.role}</p>
              <p className="text-xs text-gray-400">{contact.school}</p>
              <Button variant="outline" size="sm" className="mt-2 text-xs">
                Lägg till som kontakt
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}