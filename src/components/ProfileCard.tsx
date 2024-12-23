import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export function ProfileCard() {
  return (
    <Card className="p-6">
      <div className="flex flex-col items-center">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/lovable-uploads/7a5590cb-c66c-4fa4-8aa2-47b052f53e9f.png" alt="Profile" />
        </Avatar>
        <h3 className="font-semibold mt-4">Elmer Almer Ershagen</h3>
        <p className="text-sm text-gray-500 mb-4">Lärare på NTI Helsingborg</p>
        <p className="text-sm mt-2">Hej, jag heter Elmer, jag lär ut programmering på NTI och försöker alltid hitta nya sätt att undervisa.</p>
        <div class="flex space-x-4">
          <!-- Downloads Card -->
          <div class="flex items-center bg-orange-100 border border-orange-300 p-4 rounded-md space-x-3">
            <div class="w-8 h-8 flex items-center justify-center bg-orange-300 rounded-full text-white">
              <!-- Icon for Downloads -->
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-black">5</div>
              <div class="text-sm text-gray-600">Nedladdningar</div>
            </div>
          </div>

          <!-- Profile Views Card -->
          <div class="flex items-center bg-orange-100 border border-orange-300 p-4 rounded-md space-x-3">
            <div class="w-8 h-8 flex items-center justify-center bg-orange-300 rounded-full text-white">
              <!-- Icon for Profile Views -->
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zm-7.5 9a15.978 15.978 0 0115 0M4.5 21c-.333-.444-1.5-1.556-1.5-3 0-2.5 2-4 4.5-4s4.5 1.5 4.5 4c0 1.444-1.167 2.556-1.5 3H4.5z" />
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-black">12</div>
              <div class="text-sm text-gray-600">Profilvisningar</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}