import { Button } from "@/components/ui/button";
import { MessageCircle, UserPlus } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  role: string;
  followers: number;
  reviews: number;
  imageUrl: string;
}

export function ProfileHeader({ name, role, followers, reviews, imageUrl }: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-start gap-6">
        <img
          src={imageUrl}
          alt={name}
          className="w-28 h-28 rounded-full border-4 border-white object-cover"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{name}</h2>
          <p className="text-gray-500">{role}</p>
          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-1">
              <span className="text-gray-600 font-semibold"><span className="text-blue-400">{followers}</span> Följare</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-600 font-semibold"><span className="text-green-600">{reviews}</span> Positiva Recensioner</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="default" className="bg-sage-400 hover:bg-sage-500">
            <MessageCircle className="w-4 h-4 mr-2" />
            Meddela
          </Button>
          <Button variant="outline" className="border-sage-200 hover:bg-sage-50">
            <UserPlus className="w-4 h-4 mr-2" />
            Lägg till som kontakt
          </Button>
        </div>
      </div>
    </div>
  );
}