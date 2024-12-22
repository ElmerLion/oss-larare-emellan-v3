import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export function ProfileCard() {
  return (
    <Card className="p-6">
      <div className="flex flex-col items-center">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/lovable-uploads/144055b7-14c4-4338-bad3-b07c15415914.png" alt="Profile" />
        </Avatar>
        <h3 className="font-semibold mt-4">Elmer Almer Ershagen</h3>
        <p className="text-sm text-gray-500 mb-4">Lärare på NTI Helsingborg</p>
        <Button variant="outline" className="w-full">
          <MessageCircle className="w-4 h-4 mr-2" />
          Meddela
        </Button>
      </div>
    </Card>
  );
}