import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ResourceDetailsDialog } from "./ResourceDetailsDialog";
import { SaveToListDialog } from "../SaveToListDialog";

interface Resource {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  type: string;
  difficulty: "easy" | "medium" | "hard";
  file_path: string;
  file_name: string;
  author_id: string;
}

const difficultyMap = {
  easy: "Lätt",
  medium: "Medel",
  hard: "Svår",
};

export function ResourceCard({ resource }: { resource: Resource }) {
  const { toast } = useToast();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("resources")
        .download(resource.file_path);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = resource.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Error",
        description: "Kunde inte ladda ner filen. Försök igen.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg p-6 shadow-sm relative group">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsSaveDialogOpen(true)}
        >
          <Bookmark className="h-5 w-5" />
        </Button>

        <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{resource.description}</p>

        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-[var(--secondary2)] text-white rounded text-xs">
            {resource.subject}
          </span>
          <span className="px-2 py-1 bg-[var(--secondary2)] text-white rounded text-xs">
            {resource.grade}
          </span>
          <span className="px-2 py-1 bg-[var(--secondary2)] text-white rounded text-xs">
            {difficultyMap[resource.difficulty]}
          </span>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="secondary"
            className="w-full bg-[var(--ole-green)] hover:bg-[var(--hover-green)] text-white"
            onClick={() => setIsDetailsOpen(true)}
          >
            Se mer
          </Button>
          <Button
            variant="secondary"
            className="w-full bg-[var(--ole-green)] hover:bg-[var(--hover-green)] text-white"
            onClick={handleDownload}
          >
            Ladda ner
          </Button>
        </div>
      </div>

      {/* Resource Details Dialog */}
      <ResourceDetailsDialog
        resource={resource}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />

      {/* Save to List Dialog */}
      <SaveToListDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        itemId={resource.id}
        itemType="resource"
      />
    </>
  );
}
