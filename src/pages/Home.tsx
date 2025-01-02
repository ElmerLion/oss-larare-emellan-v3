import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Feed } from "@/components/Feed";
import { ProfileCard } from "@/components/ProfileCard";
import { Users, UserPlus, FileText, Download } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />
      <Header />
      
      <main className="pl-64 pt-16">
        <div className="max-w-[1500px] mx-auto px-6 py-8 grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <h1 className="text-2xl font-semibold mb-2">Välkommen tillbaka Elmer!</h1>
            <p className="text-gray-600 mb-8">Detta är vad som hänt senaste veckan</p>
            
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex flex-col items-center mb-3">
                  <Users className="w-5 h-5 text-emerald-500" />
                  <div className="text-3xl font-semibold text-emerald-500">143</div>
                </div>
                <div className="text-sm text-gray-500 text-center">Aktiva Lärare</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex flex-col items-center mb-3">
                  <UserPlus className="w-5 h-5 text-purple-500" />
                  <div className="text-3xl font-semibold text-purple-500">14</div>
                </div>
                <div className="text-sm text-gray-500 text-center">Nya lärare</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex flex-col items-center mb-3">
                  <FileText className="w-5 h-5 text-orange-500" />
                  <div className="text-3xl font-semibold text-orange-500">27</div>
                </div>
                <div className="text-sm text-gray-500 text-center">Material delade</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex flex-col items-center mb-3">
                  <Download className="w-5 h-5 text-pink-500" />
                  <div className="text-3xl font-semibold text-pink-500">398</div>
                </div>
                <div className="text-sm text-gray-500 text-center">Material nedladdade</div>
              </div>
            </div>

            <Feed />
          </div>
          
          <div className="space-y-6">
            <ProfileCard />
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="font-semibold mb-4">Just Nu</h2>
              <div className="space-y-4">
                <h3 className="text-sm font-medium mb-2">Populära Diskussioner</h3>
                <div className="space-y-2">
                  {[
                    "Projekt-Baserad Inlärning",
                    "Bästa sättet att lära ut matte",
                    "Engagera eleverna",
                    "Använd AI på rätt sätt"
                  ].map((topic) => (
                    <a
                      key={topic}
                      href="#"
                      className="block text-sm text-gray-600 hover:text-sage-500"
                    >
                      {topic}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;