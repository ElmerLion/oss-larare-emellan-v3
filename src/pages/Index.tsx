import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Feed } from "@/components/Feed";
import { ProfileCard } from "@/components/ProfileCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />
      <Header />
      
      <main className="pl-64 pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <h1 className="text-2xl font-semibold mb-2">Välkommen tillbaka Elmer!</h1>
            <p className="text-gray-600 mb-8">Detta är vad som hänt senaste veckan</p>
            
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-3xl font-semibold mb-1 text-emerald-500">143</div>
                <div className="text-sm text-gray-500">Aktiva Lärare</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-3xl font-semibold mb-1 text-purple-500">14</div>
                <div className="text-sm text-gray-500">Nya lärare</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-3xl font-semibold mb-1 text-orange-500">27</div>
                <div className="text-sm text-gray-500">Material delade</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-3xl font-semibold mb-1 text-pink-500">398</div>
                <div className="text-sm text-gray-500">Material nedladdade</div>
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

export default Index;