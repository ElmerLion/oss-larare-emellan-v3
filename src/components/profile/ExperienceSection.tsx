import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ExperienceSection() {
  return (
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
  );
}