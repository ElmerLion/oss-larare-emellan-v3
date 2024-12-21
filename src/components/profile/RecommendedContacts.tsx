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
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Lärare vi tror du velat lära känna</h2>
      <div className="space-y-4">
        {contacts.map((contact, index) => (
          <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <Avatar className="h-12 w-12">
              <AvatarImage src={contact.image} alt={contact.name} />
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium">{contact.name}</h3>
              <p className="text-sm text-gray-500">{contact.role}</p>
              <p className="text-xs text-gray-400">{contact.school}</p>
            </div>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              Lägg till som kontakt
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}