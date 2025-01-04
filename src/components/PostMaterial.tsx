import { Button } from "@/components/ui/button";

interface Material {
  title: string;
  type: string;
}

interface PostMaterialProps {
  materials: Material[];
}

export function PostMaterial({ materials }: PostMaterialProps) {
  return (
    <div className="mb-4">
      {materials.map((material, index) => (
        <div
          key={index}
          className="bg-gray-50 border border-gray-200 rounded p-3 flex items-center justify-between"
        >
          <span className="font-medium text-gray-700">{material.title}</span>
          <Button variant="outline" size="sm">Ladda ner</Button>
        </div>
      ))}
    </div>
  );
}