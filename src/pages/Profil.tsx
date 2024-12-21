import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface UploadedMaterial {
  title: string;
  description: string;
  tags: {
    subject: string;
    level: string;
    difficulty: string;
  }[];
}

const uploadedMaterials: UploadedMaterial[] = [
  {
    title: "Introduktion till Programmering",
    description: "En grundläggande guide för nybörjare i programmering, med fokus på Python och grundläggande koncept.",
    tags: [
      { subject: "Programmering", level: "Gymnasiet 1", difficulty: "Lätt" }
    ]
  },
  {
    title: "Webbutveckling Projekt",
    description: "Ett komplett projektmaterial för att lära ut HTML, CSS och JavaScript genom praktiska övningar.",
    tags: [
      { subject: "Webbutveckling", level: "Gymnasiet 2", difficulty: "Medel" }
    ]
  }
];

const recommendedConnections = [
  {
    name: "Anna Andersson",
    role: "Matematiklärare",
    school: "Stockholms Gymnasium",
    image: "/lovable-uploads/0d20194f-3eb3-4f5f-ba83-44b21f1060ed.png"
  },
  {
    name: "Erik Svensson",
    role: "Fysiklärare",
    school: "Uppsala Skola",
    image: "/lovable-uploads/7a5590cb-c66c-4fa4-8aa2-47b052f53e9f.png"
  },
  {
    name: "Maria Larsson",
    role: "Kemilärare",
    school: "Malmö Gymnasium",
    image: "/lovable-uploads/ac1ea747-7ba9-4d55-a96a-87f6e8210f7e.png"
  }
];

export default function Profil() {
  return (
    <div className="flex h-screen bg-[#F6F6F7]">
      <AppSidebar />
      <div className="flex-1 ml-64">
        <Header />
        
        <div className="p-6 mt-16">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <div className="flex items-center gap-6">
                    <img
                      src="/lovable-uploads/ac1ea747-7ba9-4d55-a96a-87f6e8210f7e.png"
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-white object-cover"
                    />
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold">Elmer Almer Ershagen</h2>
                      <p className="text-gray-500">Lärare på NTI Helsingborg</p>
                      <div className="flex gap-6 mt-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-[#F97316]" />
                          <span className="text-gray-600">5 Nedladdningar</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-[#FEC6A1]" />
                          <span className="text-gray-600">12 Profilvisningar</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Om Mig</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Jag är här för att</h3>
                      <p className="text-gray-800">Lära mig av likasinnade och hjälpa mina elever nå sina drömmar.</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Jag jobbar som lärare för att</h3>
                      <p className="text-gray-800">Jag älskar att se och kunna hjälpa andra yngre personer utveckla sig själva och se dem lyckas.</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2">På Oss Lärare Emellan bidrar jag med</h3>
                      <p className="text-gray-800">Positiv energi, relevanta diskussioner och massvis med material inom programmering.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Arbetslivserfarenhet</h2>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Lägg till erfarenhet
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <div className="text-gray-600">2020-Nu</div>
                        <div className="font-medium">Svenska-lärare</div>
                        <div className="text-gray-600">Springfieldskolan</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Uppladdade Material</h2>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ladda upp material
                    </Button>
                  </div>
                  
                  <ScrollArea className="h-[400px]">
                    <div className="grid grid-cols-2 gap-6">
                      {uploadedMaterials.map((material, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 relative group"
                        >
                          <h3 className="text-lg font-semibold mb-2">{material.title}</h3>
                          <p className="text-gray-600 text-sm mb-4">{material.description}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            {material.tags.map((tag, tagIndex) => (
                              <div key={tagIndex} className="flex gap-2">
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                                  {tag.subject}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                                  {tag.level}
                                </span>
                                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                                  {tag.difficulty}
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                            <Button variant="secondary" className="w-full bg-sage-100 hover:bg-sage-200">
                              Se mer
                            </Button>
                            <Button variant="secondary" className="w-full bg-sage-100 hover:bg-sage-200">
                              Ladda ner
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              {/* Recommended Connections */}
              <div className="col-span-1">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Rekommenderade Kontakter</h2>
                  <div className="space-y-4">
                    {recommendedConnections.map((connection, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={connection.image} alt={connection.name} />
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium">{connection.name}</h3>
                          <p className="text-sm text-gray-500">{connection.role}</p>
                          <p className="text-xs text-gray-400">{connection.school}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Följ
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}