import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export function ProfileCard() {
  return (
    <Card className="p-6 border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Min Profil</h2>
      <div className="flex flex-col items-center">
        {/* Profile Avatar */}
        <Avatar className="h-24 w-24">
          <AvatarImage
            src="/lovable-uploads/7a5590cb-c66c-4fa4-8aa2-47b052f53e9f.png"
            alt="Elmer Almer Ershagen"
          />
        </Avatar>

        {/* Profile Name and Title */}
        <h3 className="font-semibold mt-4">Elmer Almer Ershagen</h3>
        <p className="text-sm text-gray-500 mb-2">Lärare på NTI Helsingborg</p>

        {/* Bio */}
        <p className="text-sm text-gray-700 text-center mb-6">
          Hej, jag heter Elmer, jag lär ut programmering på NTI och försöker
          alltid hitta nya sätt att undervisa.
        </p>

        {/* Stats */}
        <div className="flex space-x-4">
          {/* Downloads Stat */}
          <div className="flex items-center bg-orange-100 border border-orange-300 p-4 rounded-md space-x-3">
            <div className="w-10 h-10 flex items-center justify-center bg-orange-300 rounded-full text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-black">5</div>
              <div className="text-sm text-gray-600">Nedladdningar</div>
            </div>
          </div>

          {/* Profile Views Stat */}
          <div className="flex items-center bg-orange-100 border border-orange-300 p-4 rounded-md space-x-3">
            <div className="w-10 h-10 flex items-center justify-center bg-orange-300 rounded-full text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zm-7.5 9a15.978 15.978 0 0115 0M4.5 21c-.333-.444-1.5-1.556-1.5-3 0-2.5 2-4 4.5-4s4.5 1.5 4.5 4c0 1.444-1.167 2.556-1.5 3H4.5z"
                />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-black">12</div>
              <div className="text-sm text-gray-600">Profilvisningar</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
