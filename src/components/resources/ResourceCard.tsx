import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useState, useEffect } from "react";
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
  subject_level?: string | null;
  downloads?: number;
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

  // Local resource state to allow realtime updates.
  const [localResource, setLocalResource] = useState<Resource | null>(resource);

  // Update local resource if the prop changes.
  useEffect(() => {
    setLocalResource(resource);
  }, [resource]);

  // Subscribe to realtime changes on this resource.
  useEffect(() => {
    if (!resource) return;
    const channel = supabase
      .channel(`resource-${resource.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "resources",
          filter: `id=eq.${resource.id}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setLocalResource(null);
            toast.info("Denna resurs finns inte längre");
          } else if (payload.new) {
            setLocalResource(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [resource, toast]);

  // If the resource doesn't exist anymore, display a fallback message.
  if (!localResource) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-gray-600 text-sm">
          Denna resurs finns inte längre.
        </p>
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      // Get the current user.
      const { data: { user } } = await supabase.auth.getUser();
      // If the current user is not the owner, update the downloads count.
      if (user && user.id !== localResource.author_id) {
        const currentDownloads = localResource.downloads || 0;
        const { error: updateError } = await supabase
          .from("resources")
          .update({ downloads: currentDownloads + 1 })
          .eq("id", localResource.id);
        if (updateError) throw updateError;
        // Update local state so the UI reflects the new downloads count.
        setLocalResource({ ...localResource, downloads: currentDownloads + 1 });
      }

      // Proceed to download the file.
      const { data, error } = await supabase.storage
        .from("resources")
        .download(localResource.file_path);
      if (error) throw error;
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = localResource.file_name;
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
          className="absolute right-4 top-4 transition-opacity"
          onClick={() => setIsSaveDialogOpen(true)}
        >
          <Bookmark className="h-5 w-5" />
        </Button>

        <h3 className="text-lg font-semibold mb-2">{localResource.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-1">
          {localResource.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-[var(--secondary2)] text-white rounded text-xs">
            {localResource.grade}
          </span>
          <span className="px-2 py-1 bg-[var(--secondary2)] text-white rounded text-xs">
            {localResource.subject} {localResource.subject_level}
          </span>
          <span className="px-2 py-1 bg-[var(--secondary2)] text-white rounded text-xs">
            {localResource.type}
          </span>
          <span className="px-2 py-1 bg-[var(--secondary2)] text-white rounded text-xs">
            {difficultyMap[localResource.difficulty]}
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

      <ResourceDetailsDialog
        resource={localResource}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onResourceUpdate={(updatedResource) => setLocalResource(updatedResource)}
      />

      <SaveToListDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        itemId={localResource.id}
        itemType="resource"
      />
    </>
  );
}
