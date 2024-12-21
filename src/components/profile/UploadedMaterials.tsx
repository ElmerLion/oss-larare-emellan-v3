import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MaterialTag {
  subject: string;
  level: string;
  difficulty: string;
}

interface Material {
  title: string;
  description: string;
  tags: MaterialTag[];
}

interface UploadedMaterialsProps {
  materials: Material[];
}

export function UploadedMaterials({ materials }: UploadedMaterialsProps) {
  return (
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
          {materials.map((material, index) => (
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
  );
}