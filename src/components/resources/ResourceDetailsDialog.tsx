import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Resource {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  type: string;
  difficulty: "easy" | "medium" | "hard";
  file_path: string | null;
  file_name: string | null;
  author_id: string;
  subject_level?: string | null;
}

export interface ResourceDetailsDialogProps {
  resource: Resource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResourceUpdate: (updatedResource: Resource) => void;
}

const difficultyMap: Record<Resource["difficulty"], string> = {
  easy: "Lätt",
  medium: "Medel",
  hard: "Svår",
};

export function ResourceDetailsDialog({
  resource,
  open,
  onOpenChange,
  onResourceUpdate,
}: ResourceDetailsDialogProps) {
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Local state for resource details so we can update them in realtime.
  const [localResource, setLocalResource] = useState<Resource | null>(resource);

  // Update local resource when the resource prop changes.
  useEffect(() => {
    setLocalResource(resource);
  }, [resource]);

  // Fetch current user id.
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setCurrentUserId(data.session.user.id);
      }
    };
    getUser();
  }, []);

  // Subscribe to realtime updates for this resource.
  useEffect(() => {
    if (!resource) return;
    const channel = supabase
      .channel(`resource-${resource.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'resources',
          filter: `id=eq.${resource.id}`,
        },
        (payload) => {
          if (payload.new) {
            setLocalResource(payload.new);
            onResourceUpdate(payload.new); // update the parent (e.g., ResourceCard)
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [resource, onResourceUpdate]);

  // When entering edit mode, populate the edit fields.
  useEffect(() => {
    if (localResource && isEditing) {
      setEditTitle(localResource.title);
      setEditDescription(localResource.description);
    }
  }, [localResource, isEditing]);

  const { data: author } = useQuery({
    queryKey: ['profile', resource?.author_id],
    queryFn: async () => {
      if (!resource?.author_id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', resource.author_id)
        .single();
      return data;
    },
    enabled: !!resource?.author_id,
  });

  const { data: fileUrl } = useQuery({
    queryKey: ['resourceFile', resource?.file_path],
    queryFn: async () => {
      if (!resource?.file_path) return null;
      const { data } = await supabase.storage
        .from('resources')
        .getPublicUrl(resource.file_path);
      return data.publicUrl;
    },
    enabled: !!resource?.file_path,
  });

  const handleDownload = async () => {
    if (!resource?.file_path) return;
    try {
      const { data, error } = await supabase.storage
        .from('resources')
        .download(resource.file_path);
      if (error) throw error;
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = resource.file_name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast({
        title: "Nedladdning startad",
        description: "Din fil laddas ned nu",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte ladda ner filen. Försök igen.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteResource = async () => {
    try {
      const { error } = await supabase
        .from("resources")
        .delete()
        .eq("id", resource?.id);
      if (error) throw error;
      toast({
        title: "Resurs borttagen",
        description: "Resursen har tagits bort.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Kunde inte ta bort resursen. Försök igen.",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdits = async () => {
    if (!resource) return;
    try {
      const { error } = await supabase
        .from("resources")
        .update({
          title: editTitle,
          description: editDescription,
        })
        .eq("id", resource.id);
      if (error) throw error;
      toast({
        title: "Resurs uppdaterad",
        description: "Ändringarna har sparats.",
      });
      setIsEditing(false);
      const updatedResource = { ...localResource!, title: editTitle, description: editDescription };
      setLocalResource(updatedResource);
      onResourceUpdate(updatedResource);
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: "Kunde inte uppdatera resursen. Försök igen.",
        variant: "destructive",
      });
    }
  };

  if (!resource) return null;

  // Determine if the current user is the owner.
  const isOwner = currentUserId !== null && resource.author_id === currentUserId;

  // Determine file type for preview.
  const isImage = resource.file_name?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isPDF = resource.file_name?.match(/\.pdf$/i);
  const isPowerPoint = resource.file_name?.match(/\.(ppt|pptx)$/i);
  const isVideo = resource.file_name?.match(/\.(mp4|mov|webm)$/i); // added for video files
  const isAudio = resource.file_name?.match(/\.(mp3|wav|ogg)$/i);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-3xl mx-2 max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          {/* Left: If owner, show small edit and delete buttons */}
          {isOwner && !isEditing && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                title="Redigera"
                className="p-1 h-8 w-8"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteResource}
                title="Ta bort"
                className="p-1 h-8 w-8"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Center: Title (or editable input in edit mode) */}
          <div className="flex-1 text-center">
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-2xl font-semibold"
                placeholder="Redigera titel..."
              />
            ) : (
              <DialogTitle className="text-2xl font-semibold">
                {localResource?.title}
              </DialogTitle>
            )}
          </div>

          {/* Right: Empty spacer to balance layout */}
          <div className="w-16" />
        </div>

        {isEditing && (
          <div className="mb-4">
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="min-h-[100px] border border-gray-300 rounded p-2"
            />
            <div className="flex gap-2 mt-2">
              <Button onClick={handleSaveEdits} className="bg-[var(--ole-green)] hover:bg-[var(--hover-green)] text-white">
                Spara
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline">
                Avbryt
              </Button>
            </div>
          </div>
        )}

        {!isEditing && (
          <div className="space-y-4">
            {author && (
              <div className="flex items-center gap-3 mb-6">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={author.avatar_url || "/lovable-uploads/placeholder.png"}
                    alt={author.full_name || "Profile Picture"}
                  />
                </Avatar>
                <div>
                  <h3 className="font-semibold">{author.full_name || "Unnamed User"}</h3>
                  <p className="text-sm text-gray-500">{author.title || "Lärare"}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-gray-700">{localResource?.description}</p>

              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-[var(--secondary2)] text-white rounded text-xs">
                  {resource.type}
                </span>
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

              {fileUrl && (
                <div className="mt-6 space-y-4">
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-[var(--ole-green)] hover:bg-[var(--hover-green)]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Ladda ner {resource.file_name}
                  </Button>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Förhandsvisning</h4>
                    {isImage ? (
                      <img
                        src={fileUrl}
                        alt={resource.title}
                        className="max-h-[400px] object-contain mx-auto"
                      />
                    ) : isPDF ? (
                      <iframe
                        src={`${fileUrl}#view=FitH`}
                        className="w-full h-[400px]"
                        title={resource.title}
                      />
                    ) : isPowerPoint ? (
                      <div className="text-center p-4 bg-gray-50 rounded">
                        <p className="text-gray-600">PowerPoint-presentation</p>
                        <p className="text-sm text-gray-500">Ladda ner för att visa</p>
                      </div>
                    ) : isVideo ? (
                      <video
                        controls
                        src={fileUrl}
                        className="w-full max-h-[400px] object-contain"
                      />
                    ) : isAudio ? (
                      <audio controls src={fileUrl} className="w-full" />
                    ) : (
                      <div className="text-center p-4 bg-gray-50 rounded">
                        <p className="text-gray-600">Förhandsvisning inte tillgänglig</p>
                        <p className="text-sm text-gray-500">Ladda ner filen för att visa innehållet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
