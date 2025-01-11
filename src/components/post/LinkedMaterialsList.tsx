import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Material {
  id: string;
  title: string;
  description: string;
  type: string;
}

interface LinkedMaterialsListProps {
  materials: Material[];
  onRemove: (materialId: string) => void;
}

export function LinkedMaterialsList({ materials, onRemove }: LinkedMaterialsListProps) {
  if (materials.length === 0) return null;

  return (
    <div className="space-y-2">
      <Label>Länkade material</Label>
      <div className="space-y-2">
        {materials.map((material) => (
          <div
            key={material.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            <span>{material.title}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(material.id)}
            >
              Ta bort
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}