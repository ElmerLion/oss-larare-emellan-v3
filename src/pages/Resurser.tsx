import { AppSidebar } from "@/components/AppSidebar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { FilterSidebar } from "@/components/FilterSidebar";

interface Resource {
  title: string;
  description: string;
  tags: {
    subject: string;
    level: string;
    difficulty: string;
  }[];
}

const resources: Resource[] = [
  {
    title: "Avancerad Algebra Genomgång",
    description: "En detaljerad och pedagogisk genomgång för elever som studerar avancerad algebra. Materialet täcker viktiga koncept och problemlösningar på en högre nivå.",
    tags: [
      { subject: "Matematik", level: "Gymnasiet 1", difficulty: "Svår" }
    ]
  },
  {
    title: "Geometri i Praktiken",
    description: "En detaljerad genomgång av geometriska formler för yta och volym, med praktiska exempel som elever kan relatera till.",
    tags: [
      { subject: "Matematik", level: "Årskurs 9", difficulty: "Medel" }
    ]
  },
  {
    title: "Trigonometri Introduktion",
    description: "Material som täcker grunderna i trigonometri med fokus på sinus, cosinus och tangens, inklusive lösningar på trianglar.",
    tags: [
      { subject: "Matematik", level: "Gymnasiet 1", difficulty: "Svår" }
    ]
  },
  {
    title: "Stilfigurer i Litteraturen",
    description: "Ett lektionsmaterial som går igenom olika stilfigurer som metaforer, alliteration och hyperboler, med exempel från kända litterära verk.",
    tags: [
      { subject: "Svenska", level: "Gymnasiet 1", difficulty: "Medel" }
    ]
  },
  {
    title: "Bygg ditt Första Python-program",
    description: "Introduktion till Python där elever får skriva sitt första program: en enkel kalkylator som summerar och subtraherar tal.",
    tags: [
      { subject: "Programmering", level: "Gymnasiet 1", difficulty: "Lätt" }
    ]
  },
  {
    title: "Skapa en Interaktiv Webbsida med HTML och CSS",
    description: "Ett projektbaserat material där elever lär sig grunderna i HTML och CSS för att bygga en personlig portfolio-sida.",
    tags: [
      { subject: "Programmering", level: "Gymnasiet 1", difficulty: "Svår" }
    ]
  },
  {
    title: "Förståelse för Shakespeare – Romeo och Julia",
    description: "En djupgående analys av Shakespeares klassiska verk med fokus på teman, karaktärer och historisk kontext.",
    tags: [
      { subject: "Engelska", level: "Gymnasiet 3", difficulty: "Medel" }
    ]
  },
  {
    title: "Derivata och Funktioners Lutning",
    description: "Omfattande material om derivata och dess tillämpningar i praktiska situationer.",
    tags: [
      { subject: "Matematik", level: "Gymnasiet 3", difficulty: "Svår" }
    ]
  }
];

export default function Resurser() {
  return (
    <div className="flex h-screen bg-[#F6F6F7]">

      <AppSidebar />
      <FilterSidebar />

      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">

          <ScrollArea className="h-[calc(100vh-40px)]">
            <div className="grid grid-cols-2 gap-6">
              {resources.map((resource, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-sm relative group"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Bookmark className="h-5 w-5" />
                  </Button>
                  
                  <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, tagIndex) => (
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
                    <Button variant="secondary" className="w-full bg-sage-200 hover:bg-sage-300">
                      Se mer
                    </Button>
                    <Button variant="secondary" className="w-full bg-sage-200 hover:bg-sage-300">
                      Ladda ner
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}