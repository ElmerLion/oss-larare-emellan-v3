import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Link } from "lucide-react";

interface PostActionButtonsProps {
  onUploadClick: () => void;
  onLinkClick: () => void;
}

export function PostActionButtons({ onUploadClick, onLinkClick }: PostActionButtonsProps) {
  return (
    <div className="space-y-2">
      <Label>Lägg till</Label>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onLinkClick}
        >
          <Link className="w-4 h-4 mr-2" />
          Länka material
        </Button>
      </div>
    </div>
  );
}