import { Eye, Users } from "lucide-react";
import { Button } from "./ui/button";

export function ProfileCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-sage-200 h-32"></div>
      <div className="p-6 -mt-16">
        <div className="mb-4">
          <img
            src="/lovable-uploads/144055b7-14c4-4338-bad3-b07c15415914.png"
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white mx-auto object-cover"
          />
        </div>
        
        <div className="text-center mb-2">
          <h2 className="text-xl font-semibold">Elmer Almer Ershagen</h2>
          <p className="text-sm text-gray-500 mb-3">Lärare på NTI Helsingborg</p>
          <Button variant="outline" size="sm" className="mb-4">
            Lägg till som kontakt
          </Button>
        </div>

        <p className="text-sm text-gray-600 text-center mb-6">
          Hej, jag heter Elmer, jag lär ut programmering på NTI och försöker
          alltid hitta nya sätt att undervisa.
        </p>

        <div className="flex justify-center gap-6">
          <div className="text-center">
            <div className="flex items-center gap-1 text-gray-600 mb-1">
              <Users className="w-4 h-4 text-[#F97316]" />
              <span className="font-semibold">5</span>
            </div>
            <p className="text-xs text-gray-500">Nedladdningar</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 text-gray-600 mb-1">
              <Eye className="w-4 h-4 text-[#FEC6A1]" />
              <span className="font-semibold">12</span>
            </div>
            <p className="text-xs text-gray-500">Profilvisningar</p>
          </div>
        </div>
      </div>
    </div>
  );
}