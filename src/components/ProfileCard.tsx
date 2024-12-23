import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export function ProfileCard() {
  return (
    <Card className="p-6 border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Min Profil</h2>

      {/* Green Background with Avatar */}
      <div className="relative w-full h-[120px] bg-[#8da685] rounded-md">
        <div className="absolute inset-x-0 bottom-10 transform translate-y-1/2 flex justify-center">
          <Avatar className="h-24 w-24 rounded-full border-2 border-white">
            <AvatarImage
              src="/lovable-uploads/0d20194f-3eb3-4f5f-ba83-44b21f1060ed.png"
              alt="Elmer Almer Ershagen"
            />
          </Avatar>
        </div>
      </div>

      {/* Profile Name and Title */}
      <h3 className="font-semibold mt-8">Elmer Almer Ershagen</h3>
      <p className="text-sm text-gray-500 mb-2">Lärare på NTI Helsingborg</p>

      {/* Bio */}
      <p className="text-sm text-gray-700 mb-6">
        Hej, jag heter Elmer, jag lär ut programmering på NTI och försöker
        alltid hitta nya sätt att undervisa.
      </p>

      {/* Stats */}
      <div className="flex space-x-4 justify-evenly">
        {/* Downloads Stat */}
        <div className="flex items-center">
          {/* Background */}
          <div className="w-9 h-9 flex items-center justify-center bg-orange-300 rounded-md text-white">
            {/* Icon */}
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
            <div className="text-sm font-bold px-2 text-black">5</div>
            <div className="text-xs text-gray-600 px-2">Nedladdningar</div>
          </div>
        </div>

        {/* Profile Views Stat */}
        <div className="h-12 flex items-center">
          <div className="flex items-center">
            {/* Background */}
            <div className="w-9 h-9 flex items-center justify-center bg-orange-300 rounded-md text-white">
              {/* Icon */}
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
          </div>
          <div>
            <div className="text-sm font-bold px-2 text-black">12</div>
            <div className="text-xs text-gray-600 px-2">Profilvisningar</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
