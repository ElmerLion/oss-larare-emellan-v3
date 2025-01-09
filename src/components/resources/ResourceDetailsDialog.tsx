import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResourceDetailsDialogProps {
  resource: {
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
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const difficultyMap = {
  easy: "Lätt",
  medium: "Medel",
  hard: "Svår"
};

export function ResourceDetailsDialog({ resource, open, onOpenChange }: ResourceDetailsDialogProps) {
  const { toast } = useToast();

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

  if (!resource) return null;

  const isImage = resource.file_name?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isPDF = resource.file_name?.match(/\.pdf$/i);
  const isPowerPoint = resource.file_name?.match(/\.(ppt|pptx)$/i);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">{resource.title}</DialogTitle>
        </DialogHeader>

        {author && (
          <div className="flex items-center gap-3 mb-6">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={author.avatar_url || "/lovable-uploads/0d20194f-3eb3-4f5f-ba83-44b21f1060ed.png"}
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
          <p className="text-gray-700">{resource.description}</p>

          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
              {resource.subject}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
              {resource.grade}
            </span>
            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
              {difficultyMap[resource.difficulty]}
            </span>
          </div>

          {fileUrl && (
            <div className="mt-6 space-y-4">
              <Button 
                onClick={handleDownload}
                className="w-full bg-sage-500 hover:bg-sage-600"
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
      </DialogContent>
    </Dialog>
  );
}