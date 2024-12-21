import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { AboutSection } from "@/components/profile/AboutSection";
import { ExperienceSection } from "@/components/profile/ExperienceSection";
import { UploadedMaterials } from "@/components/profile/UploadedMaterials";
import { RecommendedContacts } from "@/components/profile/RecommendedContacts";

const uploadedMaterials = [
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

const recommendedContacts = [
  {
    name: "Amanda Gunnarsson Nial",
    role: "Lärare",
    school: "Affärsgymnasiet",
    image: "/lovable-uploads/23886c31-4d07-445c-bf13-eee4b2127d40.png"
  },
  {
    name: "Erik Svensson",
    role: "Lärare",
    school: "Affärsgymnasiet",
    image: "/lovable-uploads/e7d324d6-19e4-4218-97a3-91fd2b88597c.png"
  },
  {
    name: "Maria Larsson",
    role: "Lärare",
    school: "Affärsgymnasiet",
    image: "/lovable-uploads/360aff04-e122-43cf-87b2-bad362e840e6.png"
  },
  {
    name: "Johan Andersson",
    role: "Lärare",
    school: "Affärsgymnasiet",
    image: "/lovable-uploads/528dd7e5-5612-42d0-975c-7bbf91b02672.png"
  },
  {
    name: "Lisa Bergman",
    role: "Lärare",
    school: "Affärsgymnasiet",
    image: "/lovable-uploads/e8c5fbf6-ba45-4f5a-99ee-66dbc7fd22d1.png"
  }
];

export default function Profil() {
  return (
    <div className="flex h-screen bg-[#F6F6F7]">
      <AppSidebar />
      <div className="flex-1 ml-64">
        <Header />
        
        <div className="p-6 mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <ProfileHeader
                  name="Elmer Almer Ershagen"
                  role="Lärare på NTI Helsingborg"
                  followers={192}
                  reviews={54}
                  imageUrl="/lovable-uploads/144055b7-14c4-4338-bad3-b07c15415914.png"
                />

                <AboutSection
                  purpose="Lära mig av likasinnade och hjälpa mina elever nå sina drömmar."
                  motivation="Jag älskar att se och kunna hjälpa andra yngre personer utveckla sig själva och se dem lyckas."
                  contribution="Positiv energi, relevanta diskussioner och massvis med material inom programmering."
                />

                <ExperienceSection />

                <UploadedMaterials materials={uploadedMaterials} />
              </div>

              <div className="col-span-1">
                <RecommendedContacts contacts={recommendedContacts} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}